/* ===== 導入元件 ===== */
import React, { useState, useEffect, useRef, useCallback } from 'react'; // 時間更動元件 -> 即時更新
import { Link, NavLink, useNavigate } from 'react-router-dom';  // 分頁元件 Link -> 取代 a 標籤，實現無刷新頁面切換。

/* ===== 獨立組件 ===== */
import InteractiveGalaxy from './InteractiveGalaxy';
import { mockEntries } from './mockEntries';
import MainLayout from './MainLayout'; // 佈局
import Icon from './Icon'; // 全域 Icon



const HomePage = () => {
    /* ===== 跳頁實現 ===== */
    const navigate = useNavigate();
    

    /* ===== 主題切換實現 ===== */
    // 主題切換功能 (CSS 變數做法)
  // const toggleTheme = () => {
  //   const root = document.documentElement;
  //   if (root.classList.contains('dark')) {
  //     root.classList.remove('dark');
  //     localStorage.setItem('theme', 'light');
  //   } else {
  //     root.classList.add('dark');
  //     localStorage.setItem('theme', 'dark');
  //   }
  // };

  
  /* ===== 心情表達邏輯 ===== */
  // 算本週 (日~六) 的日期陣列
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 取得今天是禮拜幾 (0是週日，6是週六)
  
  // 算本週「禮拜日」是哪一天
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);

  // 產生 7 天的完整資料
  const weekDays = Array(7).fill(null).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    
    // 格式化日期，例如 "2026/04/26"
    const dateString = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    
    // TODO: 未來這裡要改成去檢查資料庫
    // 1. 看這天有沒有寫日記？
    // 2. 是什麼心情？
    // 目前因為是全新帳號，一律預設為 'empty'
    const mood = 'empty'; 
    
    return { date: dateString, mood: mood, dayOfWeek: index };
  });
    

    /* ===== 音樂撥放器邏輯 ===== */
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


    /* ===== 時間邏輯 ===== */
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


    /* ===== 數學計算區 ===== */
    // 計算時鐘指針的旋轉角度
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();

    // 計算旋轉角度 -> 一圈 360 度
    const secondDeg = seconds * 6; // 60秒一圈，一秒轉 6 度
    const minuteDeg = minutes * 6 + (seconds * 0.1);     // seconds * 0.1 -> 秒數微調，讓分針平滑移動。
    const hourDeg = (hours % 12) * 30 + (minutes * 0.5); // minutes * 0.5 -> 分鐘微調，時針會慢慢走到下一個數字。

  return (
      <MainLayout>

        {/* ── Block 2 Habit（Left） ── */}
        <aside className="w-64 flex flex-col gap-4">
          
            {/* 時間方塊 */}
            <div className="bg-moOlive rounded-3xl p-5 shadow-sm border border-moBlack flex flex-col justify-center">
              <p className="text-xs text-moBlack font-serif tracking-wider mb-1">{formattedDate}</p>
              <h2 className="text-4xl font-serif text-moBlack">{formattedTime}</h2>
            </div>

            {/* 簡約風時鐘 */}
            <div className="relative w-28 h-28 mx-auto my-auto rounded-full bg-moCream border border-moBlack shadow-inner flex items-center justify-center flex-shrink-0">
          
              {/* 1. 十二個極簡刻度 */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[2px] h-2 bg-moBrown/30 rounded-full"
                  style={{
                    // translateY(-46px) -> 把刻度推到時鐘最邊緣
                    transform: `rotate(${i * 30}deg) translateY(-46px)` 
                  }}
                />
              ))}

              {/* 2. 時針 (粗、短) */}
                <div
                  className="absolute bg-moBrown/80 rounded-full origin-bottom"
                  style={{ width: '3px', height: '24px', bottom: '50%', transform: `rotate(${hourDeg}deg)` }}
                />

              {/* 3. 分針 (中等) */}
                <div
                  className="absolute bg-moBrown/50 rounded-full origin-bottom"
                  style={{ width: '3px', height: '36px', bottom: '50%', transform: `rotate(${minuteDeg}deg)` }}
                />

              {/* 4. 秒針 (指定色 moOlive) */}
                <div
                  className="absolute bg-moOlive rounded-full origin-bottom"
                  style={{ width: '1px', height: '42px', bottom: '50%', transform: `rotate(${secondDeg}deg)` }}
                />

              {/* 5. 中心固定圓點 */}
                <div className="absolute w-2 h-2 bg-moBrown rounded-full z-10 shadow-sm" />
            </div>

            {/* Habit */}
            <div className="flex-1 bg-moCream/80 rounded-[2rem] p-6 flex flex-col shadow-sm border border-moBlack relative">
              <h3 className="text-3xl font-bold font-serif text-moBlack mb-1">Habit</h3>

              {/* 習慣清單 */}
              <ul className="space-y-4 flex-1">
                <li className="text-sm font-medium text-gray-400 text-center mt-4">尚未新增任何習慣</li>
                {/* <li className="flex items-center gap-3 text-sm font-medium text-moBrown">
                  <Icon name="check" size={18} color="#A1A34E" /> Drink Water
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-moBrown">
                  <Icon name="check" size={18} color="#A1A34E" /> Exercise
                </li> */}
                {/* 這行加了底線分隔 */}
                {/* <li className="flex items-center gap-3 text-sm font-medium text-moBrown border-b border-[#E8E9DF] pb-4 mb-2">
                  <Icon name="check" size={18} color="#A1A34E" /> Sleep 8 hr
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-moBrown">
                  <Icon name="square" size={18} /> Dinner
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-moBrown">
                  <Icon name="square" size={18} /> Presentation
                </li> */}
              </ul>

              {/* 習慣按鈕 */}
              {/* 傳送門 -> 用 absolute 定位卡在底部中間，點擊後平滑切換到炯宇的 Habit 頁面。 */}
              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <button 
                  // 這裡填炯宇的 Habit page 路徑，如果有專門新增習慣的頁面，改成 '/habit/new'。
                  onClick={() => navigate('/habit')} 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-moBrown hover:bg-moOlive hover:text-white transition-colors border border-gray-100"
                >
                  {/* 記得確保我有把 plus 的 Icon 加進去 */}
                  <Icon name="plus" size={16} color="currentColor" />
                </button>
              </div>
            </div>
        </aside>

        {/* － Block 3 主視覺（Middle） － */}
        <main className="border border-moBlack rounded-2xl flex-1 flex justify-center items-center py-4 overflow-hidden relative bg-[#FDFBF7] shadow-sm">            
            <div className="w-full h-full relative">
               <InteractiveGalaxy diaries={[]} />
            </div>
        </main>

        {/* ── Block 4 Today（Right） ── */}
        <aside className="w-[250px] flex flex-col gap-4"> 

        {/* 4-1 今日狀態 */}
        <div className="flex-1 bg-moCream/80 rounded-[2rem] border border-moBlack p-6 shadow-sm flex flex-col">
          <h3 className="text-2xl font-black font-serif text-moBlack mb-1">Today</h3>
          {/* 預設的鼓勵小語 */}
          <p className="text-xs text-moBrown/60 mb-6 font-medium">Ready to write your first journal!</p>
          
          {/* 空白狀態的標籤 */}
          <div className="flex justify-start gap-2 text-xs font-bold text-moBrown/50 mb-4">
            <span className="bg-white border border-moBrown/20 py-1 px-3 rounded-full">尚未記錄標籤</span>
          </div>

          <div className="space-y-4">
            {/* 把 done 全部設為 0 */}
            {[{label:"Mood", done:0, total:5},
              {label:"Sleep", done:0, total:5},
              {label:"Stress", done:0, total:5}].map(a => (
              <div key={a.label}>
                <div className="flex justify-between text-xs font-bold text-moBrown/80 mb-2">
                  <span>{a.label}</span>
                  <span>{a.done}/{a.total}</span>
                </div>
                {/* 進度條底色 */}
                <div className="h-2 bg-moBrown/10 rounded-full overflow-hidden border border-moBrown/20">
                  {/* 進度條進度：因為 done 都是 0，所以一開始會是全空的 */}
                  <div 
                    className="h-full bg-moOlive rounded-full transition-all duration-500"
                    style={{ width: `${(a.done/a.total)*100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-2： 週心情 */}
        <div className="h-32 bg-moCream/80 rounded-[2rem] border border-moBlack p-5 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-moBrown mb-3 px-2">Mood</p>
          
          <div className="flex justify-between items-center px-2">
            {/* 用算好的 weekDays 陣列來跑迴圈 */}
            {weekDays.map((day, index) => (
              <span 
                key={index} 
                title={day.date} // 滑鼠移過去會顯示日期
                // 點擊後，帶著日期跳轉到寫日記的頁面
                onClick={() => navigate(`/diary/new?date=${day.date}`)}
                className="cursor-pointer transition-transform hover:scale-125 duration-300"
              >
                {day.mood === 'empty' ? (
                  // 空白狀態的圈圈
                  <div className="text-gray-300 hover:text-moOlive transition-colors">
                    <Icon name="circleOutline" size={20} color="currentColor" />
                  </div>
                ) : (
                  // 有心情狀態的圖片
                  <img 
                    src={`/emoji_${day.mood}.svg`} 
                    alt={`Mood: ${day.mood}`} 
                    className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" 
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 4-3 音樂播放器 */}
        <div className="mt-auto pt-4 border-t border-moBrown/20 flex flex-col items-center gap-3">
          
          {/* 隱藏的音樂播放元件 */}
          <audio ref={audioRef} src={playlist[currentTrack].src} loop />

          {/* 歌曲資訊與律動圈圈 */}
          <div className="flex items-center gap-3 w-full px-2">
            {/* 律動圈圈：如果 isPlaying 為 true，就加上 animate-spin 讓它轉動 */}
            <div className={`w-8 h-8 rounded-full border border-moBlack flex items-center justify-center bg-white shadow-sm transition-all duration-500 ${isPlaying ? 'animate-spin shadow-[0_0_10px_#A1A34E]' : ''}`} style={{ animationDuration: '4s' }}>
              <Icon name="musicNote" size={14} color="#A1A34E" />
            </div>
            
            {/* 跑馬燈或歌名顯示 */}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-moBrown truncate">{playlist[currentTrack].title}</p>
              <p className="text-[10px] text-moBrown/50">Ambient sounds</p>
            </div>
          </div>

          {/* 播放控制按鈕 */}
          <div className="flex items-center gap-4 bg-white border border-moBlack rounded-full px-4 py-1 shadow-sm">
            <button onClick={prevTrack} className="text-moBrown/60 hover:text-moOlive transition-colors">
              <Icon name="skipBack" size={14} color="currentColor" />
            </button>
            
            <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-moOlive text-white rounded-full hover:bg-[#8e9043] transition-colors shadow-sm">
              <Icon name={isPlaying ? "pause" : "play"} size={14} color="currentColor" />
            </button>
            
            <button onClick={nextTrack} className="text-moBrown/60 hover:text-moOlive transition-colors">
              <Icon name="skipForward" size={14} color="currentColor" />
            </button>
          </div>

        </div>

        {/* 4-4 相簿 */}
        <div onClick={()=>navigate('habit')} className="h-32 bg-moCream/50 rounded-[2rem] border-2 border-dashed border-moBrown/80 p-5 flex flex-col items-center justify-center hover:bg-moCream/80 transition cursor-pointer">
          <p className="text-sm font-bold text-moBrown/50 mb-1">Photo</p>
          <span className="text-xs text-moBrown/40">Click to upload</span>
        </div>

        </aside>

        </MainLayout>

    
    
  );
};

export default HomePage;