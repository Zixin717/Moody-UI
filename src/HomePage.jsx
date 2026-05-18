/* ===== 導入元件 ===== */
import React, { useState, useEffect, useRef, useCallback } from 'react'; // 時間更動元件 -> 即時更新

/* ===== 獨立組件 ===== */
import InteractiveGalaxy from './InteractiveGalaxy';
import Icon from './Icon'; // 全域 Icon

// =====================================================
// 心情 → 顏色 對應表（已對齊資料庫 Mood 表的 12 種心情）
// 邏輯在下面的載入本月日記狀態 useEffect 裡面
// =====================================================
const MOOD_COLORS = {
  // ─ 正向心情 ─
  happy:    '#FFD700',   // 開心
  excited:  '#FF6B9D',   // 興奮
  joyful:   '#FFA94D',   // 愉快
  calm:     '#A8E6CF',   // 平靜
  relaxed:  '#B5EAD7',   // 放鬆
  touched:  '#FFB6C1',   // 感動
  // ─ 負向心情 ─
  angry:    '#FF6B6B',   // 生氣
  anxious:  '#9B59B6',   // 焦慮
  troubled: '#8E44AD',   // 煩惱
  sad:      '#5DADE2',   // 難過
  tired:    '#95A5A6',   // 疲憊
  lonely:   '#70B2D9',   // 孤單
};

const NEUTRAL_COLOR = '#F9F9F9';  // 純文字日記用

const HomePage = () => {
    
  /* ===== 心情表達邏輯 ===== */
  const [todayMoods, setTodayMoods] = useState([]);

  useEffect(() => {
  fetch('/api/diary/today-moods', {
    credentials: 'include'
  })
    .then(async res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => setTodayMoods(data.moods ?? []))
    .catch(err => console.error('心情載入失敗', err));
  }, []);
    

  // ==========================================
  // 時鐘數學邏輯
  // ==========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  // 0. 音樂素材
  // 這裡放未來準備好的音樂檔案路徑 (例如放在 public 資料夾下)
  // 目前先用假名稱示意，之後換成真實的 .mp3 路徑。
  const playlist = [
    { title: "Rainy Day Lo-Fi", src: "/music/track1.mp3" },
    { title: "Forest Morning", src: "/music/track2.mp3" },
    { title: "Midnight Piano", src: "/music/track3.mp3" }
  ];

  // 1. 播放/暫停切換
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 2. 切換下一首
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true); // 切歌自動播放
  };

  // 3. 切換上一首
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  // 4. 當 currentTrack 改變時，自動載入並播放新歌
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);



  // ==========================================
  // 時鐘數學邏輯 1
  // ==========================================
  // 1. 宣告一個 state -> 存當前時間，初始值為 new Date() (現在的時間)
  const [currentTime, setCurrentTime] = useState(new Date());

  // 2. 設定計時器 -> 每 1000 毫秒 (1秒) 更新一次時間
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // 離開網頁時清除計時器
  }, []);

  // 3. 把時間格式化成指定形式
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = `${currentTime.getFullYear()} / ${currentTime.getMonth() + 1} / ${currentTime.getDate()}`;


  // ==========================================
  // 時鐘數學邏輯 2
  // ==========================================
  // 1. 取得動態變數
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  // 2. 計算旋轉角度 -> 一圈 360 度
  const secondDeg = seconds * 6; // 60秒一圈，一秒轉 6 度
  const minuteDeg = minutes * 6 + (seconds * 0.1);     // seconds * 0.1 -> 秒數微調，讓分針平滑移動。
  const hourDeg = (hours % 12) * 30 + (minutes * 0.5); // minutes * 0.5 -> 分鐘微調，時針會慢慢走到下一個數字。

  // ==========================================
  // Habit 欄位邏輯
  // ==========================================
  const [habits, setHabits] = useState([]);

  useEffect(() => {
  fetch('/api/task/list', {
    credentials: 'include'
  })
    .then(async res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => setHabits(data.tasks ?? []))
    .catch(err => console.error('習慣載入失敗', err));
  }, []);

  // ==========================================
  // Today 動態更新
  // ==========================================
  const [todaySummary, setTodaySummary] = useState({
    hasDiary: false,
    diaryId: null,
    tags: [],
    moodValue: 0,
    sleepValue: 0,
    stressValue: 0,
  });

  useEffect(() => {
    fetch('/api/diary/today-summary', {
    credentials: 'include'
  })
    .then(async res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => setTodaySummary(data))
    .catch(err => console.error('今日摘要載入失敗', err));
  }, []);

// =====================================================
// 載入本月的日記狀態（給星系上色用）
// =====================================================
const [monthDiaries, setMonthDiaries] = useState([]);
useEffect(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;   // JS getMonth() 從 0 開始，要 +1

  fetch(`/api/diary/month-status?year=${year}&month=${month}`, {
    credentials: 'include'             // 帶上 Session Cookie，後端才認得是誰
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      // 把 API 格式（YYYY-MM-DD）轉成 InteractiveGalaxy 用的格式（"YYYY / MM / DD"）
      // 並決定每筆的顏色
      const formatted = data
        .filter(item => item.hasDiary)               // 只留有寫的天
        .map(item => {
          const [y, m, d] = item.date.split('-');
          const galaxyDate = `${y} / ${m} / ${d}`;   // 配合 InteractiveGalaxy 的日期格式

          // 決定顏色：有 moodId 就查表、沒 moodId（純文字）用中性色
          const color = item.moodId
            ? (MOOD_COLORS[item.moodId] ?? NEUTRAL_COLOR)
            : NEUTRAL_COLOR;

          return {
            date: galaxyDate,                         // InteractiveGalaxy 比對日期用
            diaryId: item.diaryId,                    // hover 卡片連結到正確的日記頁面
            color: color,                             // 星球顏色
            title: item.title || '未命名',            // hover 卡片顯示 emoji
            previewText: item.previewText,           // hover 卡片顯示預覽文字
            content: item.previewText,               // 同上，配合 DiaryCard 結構
            moodId: item.moodId,
          };
        });

      setMonthDiaries(formatted);
    })
    .catch(err => {
      console.error('載入本月日記狀態失敗', err);
    });
}, []);  // [] 表示只在元件第一次渲染時跑一次


// ==========================================
// 載入當日日記的預覽照片
// ==========================================
const [previewImage, setPreviewImage] = useState(null);
useEffect(() => {
  // 如果今天還沒寫日記，直接清空預覽圖並中斷
  if (!todaySummary.diaryId) {
    setPreviewImage(null);
    return; 
  }

  // 打電話給後端要照片
  fetch(`/api/media/preview?diaryId=${todaySummary.diaryId}`, {
    credentials: 'include' // 帶上 Session Cookie
  })
    .then(res => res.json())
    .then(data => {
      // 如果後端有傳回 fileUrl，就設定到畫面上；沒有就保持 null
      if (data.fileUrl) {
        setPreviewImage(data.fileUrl);
      }
    })
    .catch(err => console.error('照片預覽載入失敗', err));

}, [todaySummary.diaryId]); // 依賴陣列放 diaryId，當 ID 出現時就會觸發這個效應



  return (
<div className="h-full flex flex-col overflow-hidden font-sans bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] text-[var(--color-text-main)] transition-colors duration-300">
  <div className="flex flex-row w-full h-full gap-6 p-4 bg-transparent overflow-hidden">

        {/* ── Block 2 Habit（Left） ── */}
        <aside className="w-64 flex flex-col gap-4 overflow-y-auto">
          
            {/* 時間方塊 */}
            <div className="bg-moOlive rounded-3xl p-5 shadow-sm border border-moBlack flex flex-col justify-center">
              <p className="text-xs text-moBlack font-serif tracking-wider mb-1">{formattedDate}</p>
              <h2 className="text-4xl font-serif text-moBlack">{formattedTime}</h2>
            </div>

            {/* 簡約風時鐘 */}
            <div className="relative w-28 h-28 mx-auto my-auto rounded-full bg-[var(--mo-cream)] border border-[var(--mo-black)] shadow-inner flex items-center justify-center flex-shrink-0">
          
              {/* 1. 十二個極簡刻度 */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[2px] h-2 bg-[var(--color-orbit)] rounded-full"
                  style={{
                    // translateY(-46px) -> 把刻度推到時鐘最邊緣
                    transform: `rotate(${i * 30}deg) translateY(-46px)` 
                  }}
                />
              ))}

              {/* 2. 時針 (粗、短) */}
                <div
                  className="absolute bg-[var(--mo-brown)] rounded-full origin-bottom"
                  style={{ width: '3px', height: '24px', bottom: '50%', transform: `rotate(${hourDeg}deg)` }}
                />

              {/* 3. 分針 (中等) */}
                <div
                  className="absolute bg-[var(--mo-brown-20)] rounded-full origin-bottom"
                  style={{ width: '3px', height: '36px', bottom: '50%', transform: `rotate(${minuteDeg}deg)` }}
                />

              {/* 4. 秒針 (指定色 moOlive) */}
                <div
                  className="absolute bg-[var(--mo-olive)] rounded-full origin-bottom"
                  style={{ width: '1px', height: '42px', bottom: '50%', transform: `rotate(${secondDeg}deg)` }}
                />

              {/* 5. 中心固定圓點 */}
                <div className="absolute w-2 h-2 bg-[var(--mo-brown)] rounded-full z-10 shadow-sm" />
            </div>

            {/* Task */}
            <div className="flex-1 bg-[var(--mo-cream)] rounded-[2rem] p-6 flex flex-col shadow-sm border border-[var(--mo-black)] relative">
              <h3 className="text-3xl font-bold font-serif text-[var(--mo-black)] mb-1">Task</h3>

              {/* Task 清單 */}
              <ul className="space-y-3 flex-1">
                {habits.length > 0 ? (
                  habits.map(habit => (
                    <li key={habit.taskId}
                      className="flex items-center gap-3 text-sm font-medium text-[var(--mo-brown)]">
                      <Icon 
                        name={habit.isCompletedToday ? "checkSquare" : "square"}   // 條件渲染
                        size={18} 
                        color={habit.isCompletedToday ? "var(--mo-olive)" : "var(--mo-brown-20)"}
                      />
                      {habit.title}
                      {/* 顯示頻率標籤 */}
                      <span className="ml-auto text-[10px] text-[var(--mo-brown)]/40 font-normal">
                        {habit.rhythmType === 'Daily' ? '每日' : '非每日'}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm font-medium text-gray-400 text-center mt-4">
                    尚未新增任何習慣
                  </li>
                )}
              </ul>

              {/* 習慣按鈕 */}
              {/* 傳送門 -> 用 absolute 定位卡在底部中間，點擊後平滑切換到炯宇的 Habit 頁面。 */}
              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <button 
                  // 這裡填炯宇的 Habit page 路徑，如果有專門新增習慣的頁面，改成 '/habit/new'。
                  onClick={() => { window.location.href = '/Task/Index'; }} 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-[var(--mo-brown)] hover:bg-[var(--mo-olive)] hover:text-white transition-colors border border-gray-100"
                >
                  {/* 記得確保我有把 plus 的 Icon 加進去 */}
                  <Icon name="plus" size={16} color="currentColor" />
                </button>
              </div>
            </div>
        </aside>

        {/* － Block 3 主視覺（Middle） － */}
        <main className="border border-[var(--mo-black)] rounded-2xl 
                         flex-1 flex justify-center items-center py-4 overflow-hidden relative 
                         bg-[var(--color-glaxy)] shadow-sm">            
            <div className="w-full h-full relative">
              <InteractiveGalaxy diaries={monthDiaries} />
            </div>
        </main>

        {/* ── Block 4 Today（Right） ── */}
        <aside className="w-[250px] flex flex-col gap-4 overflow-y-auto"> 

        {/* 4-1 今日狀態 */}
        <div className="flex-1 bg-[var(--mo-cream)] rounded-[2rem] border border-[var(--mo-black)] p-6 shadow-sm flex flex-col">
          <h3 className="text-2xl font-black font-serif text-[var(--mo-black)] mb-1">Today</h3>
          {/* 預設的鼓勵小語 */}
          <p className="text-xs text-[var(--mo-brown)]/60 mb-6 font-medium">
            {todaySummary.hasDiary ? '今天的星球已點亮！' : 'Ready to write your first journal!'}
          </p>
          
          {/* 標籤區 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {todaySummary.tags.length > 0 ? (
              todaySummary.tags.map(tag => (
                <span key={tag}
                  className="bg-white border border-[var(--mo-brown)]/20 py-1 px-3 rounded-full text-xs font-bold">
                  {tag}
                </span>
              ))
            ) : (
              <span className="bg-white border border-[var(--mo-brown)]/20 py-1 px-3 rounded-full text-xs font-bold text-[var(--color-text-muted)]">
                尚未記錄標籤
              </span>
            )}
          </div>

          {/* 進度條區 */}
          {[
            { label: "Mood",   done: todaySummary.moodValue,   total: 10 },
            { label: "Sleep",  done: todaySummary.sleepValue,  total: 10 },
            { label: "Stress", done: todaySummary.stressValue, total: 10 },
          ].map(a => (
            <div key={a.label}>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>{a.label}</span>
                <span>{a.done}/{a.total}</span>
              </div>
              <div className="h-2 bg-[var(--mo-brown)]/10 rounded-full overflow-hidden border border-[var(--mo-brown)]/20">
                <div
                  className="h-full bg-[var(--mo-olive)] rounded-full transition-all duration-500"
                  style={{ width: `${(a.done / a.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 4-2：當天心情 */}
        <div className="h-32 bg-[var(--mo-cream)] rounded-[2rem] border border-[var(--mo-brown)] p-5 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-[var(--mo-brown)] mb-3 px-2">Mood</p>

          <div className="flex gap-3 items-center px-2 flex-wrap">
            {todayMoods.length > 0 ? (
              // 有心情資料 → 顯示 emoji
              todayMoods.map(mood => (
                <span 
                  key={mood.moodId} 
                  title={mood.moodName}
                  className="text-xl cursor-default transition-transform hover:scale-125 duration-300"
                >
                  {mood.emoji}
                </span>
              ))
            ) : (
              // 沒有 → 顯示 6 個空圈（上限 6 種）
              Array(6).fill(null).map((_, i) => (
                <span
                  key={i}
                  onClick={() => {
                    const today = new Date();
                    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
                          window.location.href = `/Diary/DiaryList?date=${dateStr}`;
                  }} // 點擊空圈也可以進日記頁新增心情
                  className="cursor-pointer transition-transform hover:scale-125 duration-300 text-gray-300 hover:text-[var(--mo-olive)]"
                >
                  <Icon name="circleOutline" size={20} color="currentColor" />
                </span>
              ))
            )}
          </div>
        </div>

        {/* 4-3 音樂播放器 */}
        <div className="mt-auto pt-4 border-t border-[var(--mo-brown)]/20 flex flex-col items-center gap-3">
          
          {/* 隱藏的音樂播放元件 */}
          <audio ref={audioRef} src={playlist[currentTrack].src} loop />

          {/* 歌曲資訊與律動圈圈 */}
          <div className="flex items-center gap-3 w-full px-2">
            {/* 律動圈圈：如果 isPlaying 為 true，就加上 animate-spin 讓它轉動 */}
            <div className={`w-8 h-8 rounded-full border border-[var(--mo-brown)] flex items-center justify-center bg-white shadow-sm transition-all duration-500 ${isPlaying ? 'animate-spin shadow-[0_0_10px_#A1A34E]' : ''}`} style={{ animationDuration: '4s' }}>
              <Icon name="musicNote" size={14} color="#A1A34E" />
            </div>
            
            {/* 跑馬燈或歌名顯示 */}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-[var(--mo-brown)] truncate">{playlist[currentTrack].title}</p>
              <p className="text-[10px] text-[var(--mo-brown)]/50">Ambient sounds</p>
            </div>
          </div>

          {/* 播放控制按鈕 */}
          <div className="flex items-center gap-4 bg-white border border-[var(--mo-brown)] rounded-full px-4 py-1 shadow-sm">
            <button onClick={prevTrack} className="text-[var(--mo-brown)]/60 hover:text-[var(--mo-olive)] transition-colors">
              <Icon name="skipBack" size={14} color="currentColor" />
            </button>
            
            <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-[var(--mo-olive)] text-white rounded-full hover:bg-[#8e9043] transition-colors shadow-sm">
              <Icon name={isPlaying ? "pause" : "play"} size={14} color="currentColor" />
            </button>
            
            <button onClick={nextTrack} className="text-[var(--mo-brown)]/60 hover:text-[var(--mo-olive)] transition-colors">
              <Icon name="skipForward" size={14} color="currentColor" />
            </button>
          </div>

        </div>

        {/* 4-4 相簿預覽視窗 */}
        <div 
          // 點擊後，交給瀏覽器直接跳轉到 MVC 的日記頁面，並帶上 ?date=2024-06-18 這種查詢參數，讓日記頁面一打開就知道要顯示哪一天的內容。
          onClick={() => {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
            
            // 傳統跳轉方式，會整頁刷新，但可以確保 MVC 的路由和 Session 都正常運作。
            // 這裡的 '/Diary/Index' 只是範例，請確認組員的 DiaryController 是設定什麼路由
            window.location.href = `/Diary/Index?date=${dateStr}`; 
          }} 
          className="h-32 bg-[var(--mo-cream-20)] rounded-[2rem] border-2 border-dashed border-[var(--mo-brown)]/80 flex flex-col items-center justify-center hover:bg-[var(--mo-cream)]/80 transition cursor-pointer overflow-hidden relative"
        >
          {previewImage ? (
            // 情境 A：有已發布的照片，完美顯示！
            <img src={previewImage} alt="Today's Memory" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
          ) : (
            // 情境 B：沒有照片或還沒發布，顯示引導文字
            <>
              <p className="text-sm font-bold text-[var(--mo-brown)]/50 mb-1">
                {todaySummary.hasDiary ? "Photo" : "No Diary Yet"}
              </p>
              <span className="text-xs text-[var(--mo-brown)]/40 text-center px-4">
                {todaySummary.hasDiary ? "尚未上傳照片" : "點擊前往記錄今天的美好"}
              </span>
            </>
          )}
        </div>

        </aside>

    </div>
  </div>  
    
  );
};

export default HomePage;