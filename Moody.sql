/* =========================================================
   Diary + Emotion Task merged database schema
   Target: SQL Server
   ========================================================= */

SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ARITHABORT ON;
SET NUMERIC_ROUNDABORT OFF;
GO

IF DB_ID(N'DiaryTaskDB') IS NULL
BEGIN
    CREATE DATABASE [DiaryTaskDB];
END;
GO

USE [DiaryTaskDB];
GO

/* Drop child tables first so this script can be rerun cleanly. */
DROP TABLE IF EXISTS dbo.task_checkin_log;
DROP TABLE IF EXISTS dbo.task_schedule_rule;
DROP TABLE IF EXISTS dbo.DiaryReaction;
DROP TABLE IF EXISTS dbo.DiaryMedia;
DROP TABLE IF EXISTS dbo.DiaryTag;
DROP TABLE IF EXISTS dbo.DiaryMoodSelection;
DROP TABLE IF EXISTS dbo.DiaryMood;
DROP TABLE IF EXISTS dbo.DiaryNormal;
DROP TABLE IF EXISTS dbo.task;
DROP TABLE IF EXISTS dbo.Tag;
DROP TABLE IF EXISTS dbo.Mood;
DROP TABLE IF EXISTS dbo.Diary;
DROP TABLE IF EXISTS dbo.[User];
GO

/* =========================================================
   0. Shared user table
   ========================================================= */
CREATE TABLE dbo.[User]
(
    UserId                INT IDENTITY(1,1) NOT NULL,
    Email                 NVARCHAR(255) NOT NULL,
    Password              NVARCHAR(255) NOT NULL,
    Phone                 NVARCHAR(50) NOT NULL,
    Nickname              NVARCHAR(100) NOT NULL,
    Birthday              DATE NULL,
    CreatedAt             DATETIME2 NOT NULL
        CONSTRAINT DF_User_CreatedAt DEFAULT (SYSDATETIME()),
    ResetCode             NVARCHAR(100) NULL,
    ResetCodeExpiration   DATETIME2 NULL,
    IsNotificationEnabled BIT NOT NULL
        CONSTRAINT DF_User_IsNotificationEnabled DEFAULT (CONVERT(BIT, 0)),
    Theme                 NVARCHAR(50) NOT NULL
        CONSTRAINT DF_User_Theme DEFAULT (N''),
    IsDeleted             BIT NOT NULL 
        CONSTRAINT DF_User_IsDeleted DEFAULT (CONVERT(BIT, 0)),
    DeletedAt             DATETIME2 NULL,

    CONSTRAINT PK_User PRIMARY KEY (UserId),
    CONSTRAINT UQ_User_Email UNIQUE (Email),
    CONSTRAINT CK_User_Email_NotBlank CHECK (LEN(LTRIM(RTRIM(Email))) > 0),
    CONSTRAINT CK_User_Password_NotBlank CHECK (LEN(LTRIM(RTRIM(Password))) > 0),
    CONSTRAINT CK_User_Phone_NotBlank CHECK (LEN(LTRIM(RTRIM(Phone))) > 0),
    CONSTRAINT CK_User_Nickname_NotBlank CHECK (LEN(LTRIM(RTRIM(Nickname))) > 0)
);
GO

/* =========================================================
   1. Diary base table
   ========================================================= */
CREATE TABLE dbo.Diary
(
    DiaryId      BIGINT IDENTITY(1,1) NOT NULL, 
    UserId       INT NOT NULL,                  
    TemplateType VARCHAR(20) NOT NULL,          
    PreviewText  NVARCHAR(300) NULL,             
    DiaryDate    DATE NOT NULL,                 
    DiaryTime    TIME(0) NOT NULL,
    WeatherType  VARCHAR(20) NULL,              
    Visibility   VARCHAR(20) NOT NULL
        CONSTRAINT DF_Diary_Visibility DEFAULT ('private'),
    Status       VARCHAR(20) NOT NULL
        CONSTRAINT DF_Diary_Status DEFAULT ('draft'),
    CreatedAt    DATETIME2 NOT NULL
        CONSTRAINT DF_Diary_CreatedAt DEFAULT (SYSDATETIME()),
    UpdatedAt    DATETIME2 NOT NULL
        CONSTRAINT DF_Diary_UpdatedAt DEFAULT (SYSDATETIME()),
    DeletedAt    DATETIME2 NULL,

    CONSTRAINT PK_Diary PRIMARY KEY (DiaryId),
    CONSTRAINT FK_Diary_User
        FOREIGN KEY (UserId) REFERENCES dbo.[User],
    CONSTRAINT CK_Diary_TemplateType
        CHECK (TemplateType IN ('normal', 'mood')),
    CONSTRAINT CK_Diary_WeatherType
        CHECK (WeatherType IS NULL OR WeatherType IN ('sunny', 'cloudy', 'rainy')),
    CONSTRAINT CK_Diary_Visibility
        CHECK (Visibility IN ('private', 'shared')),
    CONSTRAINT CK_Diary_Status
        CHECK (Status IN ('draft', 'published', 'deleted')),
    CONSTRAINT CK_Diary_DeletedAt
        CHECK ((Status = 'deleted' AND DeletedAt IS NOT NULL) OR Status <> 'deleted')
);
GO

CREATE INDEX IX_Diary_User_DiaryDate_CreatedAt
ON dbo.Diary (UserId, DiaryDate DESC, CreatedAt DESC);
GO

CREATE INDEX IX_Diary_User_Status
ON dbo.Diary (UserId, Status);
GO

CREATE INDEX IX_Diary_User_Visibility
ON dbo.Diary (UserId, Visibility);
GO

CREATE TABLE dbo.DiaryNormal
(
    DiaryId BIGINT NOT NULL,
    Title   NVARCHAR(200) NULL,
    Body    NVARCHAR(MAX) NULL,

    CONSTRAINT PK_DiaryNormal PRIMARY KEY (DiaryId),
    CONSTRAINT FK_DiaryNormal_Diary
        FOREIGN KEY (DiaryId) REFERENCES dbo.Diary(DiaryId)
        ON DELETE CASCADE
);
GO

CREATE TABLE dbo.DiaryMood
(
    DiaryId     BIGINT NOT NULL,
    EnergyValue TINYINT NULL, 
    StressValue TINYINT NULL, 
    SleepValue  TINYINT NULL, 
    EventNote   NVARCHAR(500) NULL,
    ThoughtNote NVARCHAR(500) NULL,
    NeedNote    NVARCHAR(500) NULL,

    CONSTRAINT PK_DiaryMood PRIMARY KEY (DiaryId),
    CONSTRAINT FK_DiaryMood_Diary
        FOREIGN KEY (DiaryId) REFERENCES dbo.Diary(DiaryId)
        ON DELETE CASCADE,
    CONSTRAINT CK_DiaryMood_EnergyValue
        CHECK (EnergyValue IS NULL OR EnergyValue BETWEEN 0 AND 10),
    CONSTRAINT CK_DiaryMood_StressValue
        CHECK (StressValue IS NULL OR StressValue BETWEEN 0 AND 10),
    CONSTRAINT CK_DiaryMood_SleepValue
        CHECK (SleepValue IS NULL OR SleepValue BETWEEN 0 AND 10)
);
GO

CREATE TABLE dbo.Mood
(
    MoodId       VARCHAR(20) NOT NULL,
    MoodName     NVARCHAR(50) NOT NULL,
    MoodEmoji    NVARCHAR(10) NOT NULL,
    IsPositive   BIT NOT NULL,
    IsHighEnergy BIT NOT NULL,

    CONSTRAINT PK_Mood PRIMARY KEY (MoodId),
    CONSTRAINT CK_Mood_MoodName_NotBlank CHECK (LEN(LTRIM(RTRIM(MoodName))) > 0),
    CONSTRAINT CK_Mood_MoodEmoji_NotBlank CHECK (LEN(LTRIM(RTRIM(MoodEmoji))) > 0)
);
GO

CREATE TABLE dbo.DiaryMoodSelection
(
    DiaryId BIGINT NOT NULL,
    MoodId  VARCHAR(20) NOT NULL, 

    CONSTRAINT PK_DiaryMoodSelection PRIMARY KEY (DiaryId, MoodId),
    CONSTRAINT FK_DiaryMoodSelection_Diary
        FOREIGN KEY (DiaryId) REFERENCES dbo.Diary(DiaryId)
        ON DELETE CASCADE,
    CONSTRAINT FK_DiaryMoodSelection_Mood
        FOREIGN KEY (MoodId) REFERENCES dbo.Mood(MoodId)
);
GO

CREATE TABLE dbo.Tag
(
    TagId     VARCHAR(20) NOT NULL,
    UserId    INT NULL,
    TagName   NVARCHAR(50) NOT NULL,
    TagType   VARCHAR(20) NOT NULL,
    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_Tag_CreatedAt DEFAULT (SYSDATETIME()),
    IsActive  BIT NOT NULL
        CONSTRAINT DF_Tag_IsActive DEFAULT (1),

    CONSTRAINT PK_Tag PRIMARY KEY (TagId),
    CONSTRAINT FK_Tag_User
        FOREIGN KEY (UserId) REFERENCES dbo.[User],
    CONSTRAINT CK_Tag_TagName_NotBlank
        CHECK (LEN(LTRIM(RTRIM(TagName))) > 0),
    CONSTRAINT CK_Tag_TagType
        CHECK (TagType IN ('system', 'custom')),
    CONSTRAINT CK_Tag_SystemOrCustom
        CHECK ((TagType = 'system' AND UserId IS NULL) OR (TagType = 'custom' AND UserId IS NOT NULL))
);
GO

CREATE UNIQUE INDEX UX_Tag_System_TagName
ON dbo.Tag (TagName)
WHERE UserId IS NULL;
GO

CREATE UNIQUE INDEX UX_Tag_User_TagName
ON dbo.Tag (UserId, TagName)
WHERE UserId IS NOT NULL;
GO

CREATE TABLE dbo.DiaryTag
(
    DiaryId BIGINT NOT NULL,
    TagId   VARCHAR(20) NOT NULL, 

    CONSTRAINT PK_DiaryTag PRIMARY KEY (DiaryId, TagId),
    CONSTRAINT FK_DiaryTag_Diary
        FOREIGN KEY (DiaryId) REFERENCES dbo.Diary(DiaryId)
        ON DELETE CASCADE,
    CONSTRAINT FK_DiaryTag_Tag
        FOREIGN KEY (TagId) REFERENCES dbo.Tag(TagId)
);
GO

CREATE INDEX IX_DiaryTag_TagId
ON dbo.DiaryTag (TagId);
GO

CREATE TABLE dbo.DiaryMedia
(
    MediaId   VARCHAR(20) NOT NULL,
    DiaryId   BIGINT NOT NULL,
    MediaType VARCHAR(20) NOT NULL,
    FileUrl   NVARCHAR(300) NOT NULL, 
    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_DiaryMedia_CreatedAt DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_DiaryMedia PRIMARY KEY (MediaId),
    CONSTRAINT FK_DiaryMedia_Diary
        FOREIGN KEY (DiaryId) REFERENCES dbo.Diary(DiaryId)
        ON DELETE CASCADE,
    CONSTRAINT CK_DiaryMedia_MediaType
        CHECK (MediaType IN ('image', 'drawing')),
    CONSTRAINT CK_DiaryMedia_FileUrl_NotBlank
        CHECK (LEN(LTRIM(RTRIM(FileUrl))) > 0)
);
GO

CREATE INDEX IX_DiaryMedia_DiaryId_CreatedAt
ON dbo.DiaryMedia (DiaryId, CreatedAt ASC);
GO

CREATE TABLE dbo.DiaryReaction
(
    ReactionId   BIGINT IDENTITY(1,1) NOT NULL,
    DiaryId      BIGINT NOT NULL,
    UserId       INT NOT NULL,
    ReactionType VARCHAR(20) NOT NULL,
    CreatedAt    DATETIME2 NOT NULL
        CONSTRAINT DF_DiaryReaction_CreatedAt DEFAULT (SYSDATETIME()),
    UpdatedAt    DATETIME2 NULL,

    CONSTRAINT PK_DiaryReaction PRIMARY KEY (ReactionId),
    CONSTRAINT FK_DiaryReaction_Diary
        FOREIGN KEY (DiaryId) REFERENCES dbo.Diary(DiaryId)
        ON DELETE CASCADE,
    CONSTRAINT FK_DiaryReaction_User
        FOREIGN KEY (UserId) REFERENCES dbo.[User],
    CONSTRAINT CK_DiaryReaction_ReactionType
        CHECK (ReactionType IN ('like', 'love', 'hug', 'empathy', 'cheer')),
    CONSTRAINT UQ_DiaryReaction_Diary_User
        UNIQUE (DiaryId, UserId)
);
GO

CREATE INDEX IX_DiaryReaction_DiaryId
ON dbo.DiaryReaction (DiaryId);
GO

/* =========================================================
   2. Emotion task tables
   ========================================================= */
CREATE TABLE dbo.task
(
    task_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,
    title NVARCHAR(100) NOT NULL,
    rhythm_type NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL
        CONSTRAINT DF_task_status DEFAULT (N'Active'),
    created_at DATETIME2 NOT NULL
        CONSTRAINT DF_task_created_at DEFAULT (SYSDATETIME()),
    updated_at DATETIME2 NOT NULL
        CONSTRAINT DF_task_updated_at DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_task PRIMARY KEY (task_id),
    CONSTRAINT FK_task_User
        FOREIGN KEY (user_id) REFERENCES dbo.[User],
    CONSTRAINT CK_task_title_not_blank
        CHECK (LEN(LTRIM(RTRIM(title))) > 0),
    CONSTRAINT CK_task_rhythm_type
        CHECK (rhythm_type IN (N'Daily', N'NonDaily')),
    CONSTRAINT CK_task_status
        CHECK (status IN (N'Active', N'Archived'))
);
GO

CREATE INDEX IX_task_user_id
ON dbo.task(user_id);
GO

CREATE TABLE dbo.task_schedule_rule
(
    rule_id INT IDENTITY(1,1) NOT NULL,
    task_id INT NOT NULL,
    weekly_target_count INT NULL,
    start_date DATE NOT NULL
        CONSTRAINT DF_task_schedule_rule_start_date DEFAULT (CAST(GETDATE() AS DATE)),
    end_date DATE NULL,

    CONSTRAINT PK_task_schedule_rule PRIMARY KEY (rule_id),
    CONSTRAINT UQ_task_schedule_rule_task_id UNIQUE (task_id),
    CONSTRAINT FK_task_schedule_rule_task
        FOREIGN KEY (task_id) REFERENCES dbo.task(task_id)
        ON DELETE CASCADE,
    CONSTRAINT CK_task_schedule_rule_weekly_target_count
        CHECK (weekly_target_count IS NULL OR weekly_target_count > 0),
    CONSTRAINT CK_task_schedule_rule_end_date
        CHECK (end_date IS NULL OR end_date >= start_date)
);
GO

CREATE TABLE dbo.task_checkin_log
(
    checkin_id INT IDENTITY(1,1) NOT NULL,
    task_id INT NOT NULL,
    checkin_date DATE NOT NULL,
    checkin_at DATETIME2 NOT NULL
        CONSTRAINT DF_task_checkin_log_checkin_at DEFAULT (SYSDATETIME()),
    checkin_type NVARCHAR(20) NOT NULL
        CONSTRAINT DF_task_checkin_log_checkin_type DEFAULT (N'Complete'),

    CONSTRAINT PK_task_checkin_log PRIMARY KEY (checkin_id),
    CONSTRAINT UQ_task_checkin_log_task_date UNIQUE (task_id, checkin_date),
    CONSTRAINT FK_task_checkin_log_task
        FOREIGN KEY (task_id) REFERENCES dbo.task(task_id)
        ON DELETE CASCADE,
    CONSTRAINT CK_task_checkin_log_checkin_type
        CHECK (checkin_type IN (N'Complete', N'Undo', N'Makeup'))
);
GO

CREATE INDEX IX_task_checkin_log_task_id
ON dbo.task_checkin_log(task_id);
GO

CREATE INDEX IX_task_checkin_log_checkin_date
ON dbo.task_checkin_log(checkin_date);
GO

PRINT N'DiaryTaskDB schema created successfully.';
GO