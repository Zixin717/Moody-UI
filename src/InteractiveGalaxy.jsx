import React, { useState } from 'react';
import ReactDOM from 'react-dom';       // ← 新增：Portal 需要用到
import { useNavigate } from 'react-router-dom';

// ─── Icon 元件 ───────────────────────────
const LocalIcon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    heart:       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke={color} strokeWidth="1.5"/>,
    chat:        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    arrowUpRight:<><line x1="7" y1="17" x2="17" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><polyline points="7 7 17 7 17 17" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    arrowRight:  <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{icons[name] ?? null}</svg>;
};

// ─── 用 Portal 把卡片渲染到 <body> 最外層 ──────────────
//
// 因為卡片被包在 [transform-style:preserve-3d] 的軌道環裡面，
// 在 3D 空間中 z-index 完全失效，瀏覽器只看 3D Z 軸深度。
// 用 Portal 讓卡片直接掛在 <body>，完全脫離 3D 容器，
// 就可以正常用 z-index 和 fixed 定位顯示在最前面。
//
// cardPos：紀錄滑鼠的螢幕座標，讓 Portal 卡片可以貼在正確位置。
const DiaryCard = ({ entry, pos, onClick }) => {
  if (!entry || !pos) return null;

  // ReactDOM.createPortal(內容, 掛載點)
  // 把卡片直接掛到 document.body，完全脫離 3D 堆疊空間
  return ReactDOM.createPortal(
    <div
      // fixed：相對於視窗定位，不受任何父層影響
      // pointer-events-none 防止卡片本身攔截到 mouseleave
      style={{
        position: 'fixed',
        top: pos.y + 16,   // 滑鼠下方 16px
        left: pos.x + 16,  // 滑鼠右方 16px
        zIndex: 9999,       // 現在 z-index 有效了
        pointerEvents: 'auto',
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-moBrown/40 shadow-xl w-[220px] animate-fade-in-up hover:bg-moCream transition-colors">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <LocalIcon name="heart" size={14} color={entry.color} />
            <span className="text-[12px] text-gray-500 font-serif">{entry.date}</span>
          </div>
          <LocalIcon name="arrowUpRight" size={14} color="#9ca3af" />
        </div>
        <h4 className="text-md text-moBlack mb-1 font-serif">{entry.title}</h4>
        <p className="text-xs text-moBrown/80 truncate">{entry.content}</p>
      </div>
    </div>,
    document.body   // ← 卡片掛在這裡，脫離所有 3D 容器
  );
};

// ─── 主元件 ──────────────────────────────────────────────────
const InteractiveGalaxy = ({ diaries }) => {
  const navigate = useNavigate();

  // hoveredEntry：目前 hover 的日記資料
  const [hoveredEntry, setHoveredEntry] = useState(null);
  // cardPos：滑鼠在螢幕上的座標（給 Portal 卡片定位用）
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

// const getOrbitSize = (orbitIndex) => 240 + (orbitIndex - 1) * 100;

  // 滑鼠移動時更新座標
  // e.clientX / e.clientY 是相對於視窗的座標，和 fixed 定位搭配使用
  const handleMouseMove = (e) => {
    setCardPos({ x: e.clientX, y: e.clientY });
  };

   // 1. 動態日曆邏輯：取得目前的年、月，以及這個月有幾天
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonthNum = todayDate.getMonth() + 1; // 1-12
  const daysInMonth = new Date(currentYear, currentMonthNum, 0).getDate(); // 取得當月總天數 (例如 31)
  
  // 取得月份的英文縮寫 (例如 "May", "Apr")，用來顯示在主星上
  const monthName = todayDate.toLocaleString('en-US', { month: 'short' });

  // 產生一個陣列，長度為當月天數，例如 [1, 2, ..., 31]
  const monthDaysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 判斷今天是否有寫日記
  const todayString = `${currentYear} / ${String(currentMonthNum).padStart(2, '0')} / ${String(todayDate.getDate()).padStart(2, '0')}`;
  const hasTodayDiary = diaries.some(entry => entry.date === todayString);


  return (
    // onMouseMove 掛在整個 Galaxy 容器，隨時追蹤滑鼠位置
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden [perspective:1000px] relative"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-6 left-6 text-m text-moBrown opacity-50 flex items-center gap-2">
        <LocalIcon name="chat" size={14} color="currentColor" />
        滑鼠懸停星星可暫停並查看日記
      </div>

      {/* 右下角：新增日記按鈕與動態提示文字 */}
      <div className="absolute bottom-8 right-8 flex items-center gap-5 z-40">
        <div className="text-right">
          {hasTodayDiary ? (
            <>
              {/* 如果今天已經有寫日記 */}
              <p className="text-sm font-bold text-moOlive font-serif">今日星球已點亮！</p>
              <p className="text-xs text-moBrown/50 mt-1">去看看其他日子的回憶吧</p>
            </>
          ) : (
            <>
              {/* 如果今天還沒寫日記 (草圖樣式) */}
              <p className="text-sm font-bold text-moBrown/60 font-serif">欸呀！主星系還沒有添加星球</p>
              <p className="text-xs text-moBrown/40 mt-1">試著添加今日星球吧！</p>
            </>
          )}
        </div>
        
        {/* 圓形按鈕：懸停時箭頭會有往右推的小動畫 */}
        <button 
          onClick={() => navigate('/diary/new')}
          className="w-14 h-14 rounded-full border border-moBlack bg-transparent flex items-center justify-center text-moBlack hover:bg-moOlive hover:text-white hover:border-moOlive transition-colors shadow-sm group cursor-pointer"
        >
          <span className="group-hover:translate-x-1 transition-transform">
            <LocalIcon name="arrowRight" size={24} color="currentColor" />
          </span>
        </button>
      </div>

      {/* 3D 太陽系轉盤 */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center [transform:rotateX(45deg)] [transform-style:preserve-3d]">

        {/* 中心主星 */}
        <div className="absolute w-28 h-28 bg-[#FFFFFF] rounded-full shadow-[0_0_80px_rgba(250,255,184,0.6)] flex items-center justify-center z-20 [transform:rotateX(-45deg)] border border-moBrown/20">
          <span className="text-moBrown font-bold tracking-wider drop-shadow-md font-serif text-lg">{monthName}</span>
        </div>

        {/* 2. 迴圈印出 1 到 31 號的軌道 */}
        {monthDaysArray.map((day, index) => {
          const dateString = `${currentYear} / ${String(currentMonthNum).padStart(2, '0')} / ${String(day).padStart(2, '0')}`;
          const entry = diaries.find(d => d.date === dateString); 
          
          // ─── 核心公式 ────────────────────────────────────────────
          //
          // 目標：30 條軌道，內圈密集、外圈自然散開，超出畫面也沒關係。
          // 公式：orbitSize = BASE + LOG_SCALE * Math.log(index + 1) * (index + 1) ^ POWER
          //
          // 參數 -> 可以自由調整：
          const BASE       = 160;   // 主星到第一條軌道的距離（單位 px）
          const LOG_SCALE  = 55;    // 整體「散開速度」，越大外圈越快飛出去
          const POWER      = 0.72;  // 指數：< 1 讓外圈間距緩慢遞增，= 1 就是純對數

          // ─── 套用到元件 ──────────────────────────────────────────
          const getOrbitSize = (index) => {
            // Math.log(index + 1)：對數曲線，index=0 時輸出 0，之後快速增大然後趨緩
            // Math.pow(index + 1, POWER)：再乘上一個緩增指數，讓外圈繼續「往外推」
            // 兩者相乘：結合了對數的「內密」和指數的「外疏」
            const logCurve = Math.log(index + 1);
            const spread   = Math.pow(index + 1, POWER);
            
            // jitter：讓每條軌道有 ±6px 的錯落感，避免太機械。
            // 用 sin 而不是 Math.random()，原因是 random() 每次 render 都會變，
            // 而 sin(index) 的結果是固定的（同一個 index 永遠同一個偏移量）
            const jitter = Math.sin(index * 1.7) * 6;
            
            return BASE + LOG_SCALE * logCurve * spread + jitter;
          };

          // ─── 各軌道的預估大小（讓你有感覺）────────────────────────────
          // index 0  → ~160px   （貼著主星）
          // index 4  → ~330px
          // index 9  → ~530px   （約畫布邊緣）
          // index 14 → ~730px   （開始超出畫面）
          // index 20 → ~1000px  （大部分看不到，只剩弧線）
          // index 29 → ~1380px  （完全超出，但動畫依然在跑）

          // ─── 轉速公式（同步調整）────────────────────────────────────
          // 內圈快、外圈慢，且差異要夠大才有層次感
          const getAnimationDuration = (index) => {
            // 從 12s（最內圈）到 90s（最外圈），用平方根讓速度不要掉太快
            return 12 + Math.sqrt(index) * 14;
          };

          // ─── 軌道與公轉 ───────────────────────────────────

          // 3. 軌道縮放邏輯：指數擴張 + 自然微調 (Generative Art 技巧)
          const orbitSize = getOrbitSize(index);
          const animationDuration = getAnimationDuration(index);
          
          // 4. 統一公轉方向 -> 所有行星同向環繞，符合自然法則
          const orbitDirection = 'normal';
          const planetDirection = 'reverse'; // 星星本體永遠要反向自轉，才能保持面向鏡頭。

          

          return (
            <div
              key={day}
              style={{
                width: `${orbitSize}px`,
                height: `${orbitSize}px`,
                animationDuration: `${animationDuration}s`,
                animationDirection: orbitDirection,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
              className={`absolute border rounded-full 
                animate-spin [transform-style:preserve-3d] 
                ${entry ? 'border-moBrown/20' : 'border-moBrown/20'}`} // 有日記的軌道比較明顯，沒有日記的軌道淡一點
            >
              <div
                style={{
                  animationDuration: `${animationDuration}s`,
                  animationDirection: planetDirection,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
                className="absolute top-0 left-1/2 w-0 h-0 animate-spin [transform-style:preserve-3d]"
              >
                <div className="absolute [transform:rotateX(-45deg)] [transform-style:flat]">
                  
                  {/* 判斷是否有日記 */}
                  {entry ? (
                    <button
                      style={{ background: entry.color }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-transform duration-300 hover:scale-150 cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredEntry(entry);
                        setIsPaused(true);
                      }}
                      onMouseLeave={() => {
                        setHoveredEntry(null);
                        setIsPaused(false);
                      }}
                      onClick={() => navigate('/diary/blank')}
                    />
                  ) : (
                    <button
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-moBrown/30 bg-white/20 transition-all duration-300 hover:scale-150 hover:bg-white hover:border-white cursor-pointer"
                      onClick={() => navigate('/diary/new')} 
                      title={`新增 ${currentMonthNum}/${day} 的日記`}
                    />
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DiaryCard
        entry={hoveredEntry}
        pos={cardPos}
        onClick={() => navigate('/diary/blank')}
      />
    </div>
  );
};

export default InteractiveGalaxy;