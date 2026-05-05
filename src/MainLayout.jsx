// src/MainLayout.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from './Icon'; // 全域 Icon


// ─── 火花元件 ──────────────────────────────────────────────────
const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);

    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;

    const draw = timestamp => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);
  };

  return (
    <div className="relative w-full h-full" onClick={handleClick}>
      <canvas ref={canvasRef} className="w-full h-full block absolute top-0 left-0 select-none pointer-events-none z-50" />
      {children}
    </div>
  );
};

// ─── 佈局主元件 ──────────────────────────────────────────────────
// ({ children }) ->  React 核心概念，代表包在這個元件裡面的內容。
const MainLayout = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate(); // 宣告 navigate 才能實現登出跳頁，不要再忘記了。


  // 主題切換功能（優先級 3 -> 暫不處理 尚未建置此功能，勿動。）
  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // 登出功能處理函式
  const handleLogout = () => {
    // Step A：清空瀏覽器裡儲存的用戶資料
    localStorage.removeItem('userData');
    
    // Step B：關閉選單
    setOpenMenu(null);
    
    // Step C：跳出提示並導回登入頁面
    alert("已成功登出！");
    navigate('/login'); 
  };

  return (
    /* 圖層層級 */
    // ClickSpark -> z-50 ｜ TopBar -> z-45 ｜ 透明遮罩 -> z-40

    // ─── 火光特效 ──────────────────────────────────────────────────
    <ClickSpark sparkColor="#786C56" sparkSize={12} sparkRadius={20} sparkCount={6} z-50>
    
        {/*/ 網格背景、全螢幕設定、主題顏色 */}
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-[var(--color-bg-space)] text-[var(--color-text-main)] transition-colors duration-300 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]">
        
            {/* 透明遮罩 -> 點擊空白處關閉選單 */}
            {openMenu && <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />}

                {/* ===== 1. 頂層導覽列 (TopBar) ===== */}
                <header className="relative z-45 bg-moOlive border-b border-moBlack text-white flex items-center justify-between px-8 py-4 mb-3 flex-shrink-0">
                    <Link to="/home" className="text-[30px] text-moBlack font-bold font-serif cursor-pointer hover:text-moCitron transition-colors">Moody</Link>
                    
                    {/* 1-1 搜尋列 */}
                    <div className="relative">
                        <div className="flex items-center bg-white border border-moBlack focus-within:border-moAzure transition-all rounded-full px-5 py-2 w-[700px] h-[50px] shadow-sm">
                            <Icon name="search" size={18} color="#9ca3af" />
                            <input type="text" placeholder="Search my journal" className="ml-3 outline-none w-full text-sm bg-transparent placeholder-gray-400 text-gray-700" onClick={() => setOpenMenu('search')} />
                        </div>
                    </div>

                    {/* 1-2 通知＆帳號 */}
                    <div className="flex gap-4">
                        {/* 通知＆下拉選單 */}
                        <div className="relative">
                            <button onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-moOlive rounded-full bg-white border border-moBlack shadow-sm transition-colors relative">
                            <Icon name="bell" size={18} color="currentColor"/>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 border border-white rounded-full"></span>
                            </button>

                            {openMenu === 'notif' && (
                              <div className="absolute top-[50px] right-0 w-80 bg-white border border-moBlack rounded-2xl shadow-lg py-4 px-4 z-50 animate-fade-in origin-top-right">
                                
                                {/* 標題與全部已讀按鈕 */}
                                <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                                  <span className="font-bold text-moBrown font-serif text-lg">Recent</span>
                                  <button className="text-xs text-gray-400 hover:text-moOlive font-bold transition-colors">
                                    Read all
                                  </button>
                                </div>

                                {/* 內部通知列表：預設為空畫面 */}
                                <div className="flex flex-col items-center justify-center py-8">
                                  {/* 這裡可以用妳的 Icon 元件，放個淡淡的鈴鐺或星星 */}
                                  <div className="text-gray-200 mb-2">
                                    <Icon name="bell" size={40} color="currentColor" />
                                  </div>
                                  <p className="text-sm font-bold text-gray-400">目前沒有新通知</p>
                                  <p className="text-xs text-gray-400 mt-1">去主星系添加今日星球吧！</p>
                                </div>
                                
                                {/* 如果未來有資料，就會用 .map() 產生下面這樣的卡片 (先註解) */}
                                {/*
                                <div className="flex flex-col gap-2 mt-2">
                                  <div className="bg-[#D4E2A5]/30 border border-moBlack rounded-xl p-3 flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-moOlive"></span>
                                    <span className="text-sm font-bold text-moBrown">Max likes your post!</span>
                                  </div>
                                </div> 
                                 */}
                              </div>
                            )}
                        </div>

                        {/* 帳號＆下拉選單 */}
                        <div className="relative">
                            <button onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-moOlive rounded-full bg-white border border-moBlack shadow-sm transition-colors">
                            <Icon name="user" size={18} color="currentColor"/>
                            </button>
                            {openMenu === 'profile' && (
                            <div className="absolute top-[50px] right-0 w-48 bg-white border border-moBlack rounded-xl shadow-lg py-2 z-50">
                                <Link to="/profile" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">帳戶</Link>
                                <Link to="/profile" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">系統設定</Link>

                                {/* <Link to="/profile/personal" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">個人檔案</Link> */}
                                <div className="border-t border-gray-200 my-1"></div>
                                    <button 
                                      onClick={handleLogout} 
                                      className="w-full text-left block px-6 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                      登出
                                    </button>                            
                                </div>
                            )}
                        </div>
                    </div> 
                </header>

                {/* ===== 2. 頁面主要內容區塊 ===== */}
                <div className="flex-1 flex gap-4 px-8 pb-8 overflow-hidden">
                    
                    {/* 2-1 垂直導覽列 (SideNav) */}
                    <nav className="flex flex-col items-center pb-2 flex-shrink-0">
                        <div className="w-16 bg-moCream rounded-[2rem] flex flex-col items-center py-6 gap-6 shadow-sm border border-moBlack">
                            {/* NavLinks 自動處理 Active 狀態 */}
                            <NavLink to="/home" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="home" size={20} color="currentColor" /></NavLink>
                            <NavLink to="/diary" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="diary" size={20} color="currentColor" /></NavLink>
                            <NavLink to="/habit" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="sparkle" size={20} color="currentColor" /></NavLink>
                            <NavLink to="/calendar" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="calendar" size={20} color="currentColor" /></NavLink>
                            <NavLink to="/analyze" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="gauge" size={20} color="currentColor" /></NavLink>
                            <NavLink to="/chat" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="chat" size={20} color="currentColor" /></NavLink>
                        </div>
                    
                        {/* 主題切換按鈕 (先拔掉) */}
                        {/* <button onClick={toggleTheme} className="group mt-auto w-16 h-16 bg-moBrown hover:bg-white/60 text-white hover:text-moBrown transition flex flex-col items-center justify-center rounded-[2rem] shadow-sm border border-moBlack gap-1">
                            <LayoutIcon name="toggle" size={24} color="currentColor"/>
                        </button> */}

                        {/* 2-2 禮物牆 */}
                        <NavLink to="/giftwall" className={({ isActive }) => `group mt-auto w-16 h-16 bg-moBrown text-white border border-moBlack rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moCream border border-moBlack text-[#3d5a10] shadow-sm" : "hover:bg-[#FFFFFF] hover:scale-110 hover:-translate-y-1 text-gray-400 hover:text-moBrown"}`}><Icon name="star" size={24} color="currentColor" /></NavLink>

                    </nav>

                    {/* 各個頁面的專屬內容自動塞進 children */}
                    {children}

                </div>
        </div>
    </ClickSpark>
  );
};

export default MainLayout;