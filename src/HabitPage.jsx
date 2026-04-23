import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';

/* ===== 點擊火花元件 start ====== */
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

/* ===== SVG 圖示元件 ===== */
const Icon = ({ name, size = 20, color = "currentColor" }) => {
const icons = {
 /* － 頂邊導覽欄 icon － */ 
 search: <><circle cx="11" cy="11" r="8" fill="none" stroke={color} strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
 bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
 user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,

 /* － 左邊導覽欄 icon － */ 
 home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
 diary: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
 calendar: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/></>,
 sparkle: <><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5Z" fill={color}/></>,
 gauge: <><path d="M3 15a9 9 0 0 1 18 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15V8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="15" r="2" fill={color}/></>,
 chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
 star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,

 /* － 左邊習慣欄位 icon － */
 plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
 check: <polyline points="20 6 9 17 4 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
 square: <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke={color} strokeWidth="1.5"/>,

 /* 以下 icon 保留備用 */
 heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke={color} strokeWidth="1.5"/>,
 moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke={color} strokeWidth="1.5"/>,
 toggle: <><rect x="3" y="8" width="18" height="8" rx="4" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="8" cy="12" r="2.5" fill={color}/></>,
 mail: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="3 7 12 13 21 7" fill="none" stroke={color} strokeWidth="1.5"/></>,
 chevronDown: <polyline points="6 9 12 15 18 9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
 chevronUp: <polyline points="18 15 12 9 6 15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
 globe: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><line x1="2" y1="12" x2="22" y2="12" fill="none" stroke={color} strokeWidth="1.5"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke={color} strokeWidth="1.5"/></>,
 circle: <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/>,
};
return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icons[name] ?? null}</svg>;
};

const HabitPage = () => {
// 選單狀態管理
const [openMenu, setOpenMenu] = useState(null);

// 假資料
const recentSearches = [
 { id: 1, text: "Rain on me", date: "2027 / 7 / 1", type: "moon" },
 { id: 2, text: "Flower", date: "2027 / 7 / 2", type: "sparkle" },
];

const notifications = [
 { id: 1, text: "Max likes your post!", unread: true },
 { id: 2, text: "New Update!", unread: false },
];

return (
 <ClickSpark sparkColor="#786C56" sparkSize={12} sparkRadius={20} sparkCount={6}>
 <div className="h-screen flex flex-col overflow-hidden text-gray-800 font-sans bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]">
   
   {openMenu && <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />}

   {/* ===== Top_Bar ===== */}
   <header className="relative z-50 bg-moOlive border-b border-moBlack text-white flex items-center justify-between px-8 py-4 mb-3 flex-shrink-0">
     
     <Link to="/home" className="text-[30px] text-moBlack font-bold font-serif cursor-pointer hover:text-moCitron transition-colors">
       Moody
     </Link>

     {/* 搜尋列 */}
     <div className="relative">
       <div className="flex items-center bg-white border border-moBlack focus-within:border-moAzure focus-within:ring-4 focus-within:ring-moAzure/20 transition-all rounded-full px-5 py-2 w-[700px] h-[50px] shadow-sm">
         <Icon name="search" size={18} color="#9ca3af" />
         <input type="text" placeholder="Search my journal" className="ml-3 outline-none w-full text-sm bg-transparent placeholder-gray-400 text-gray-700" onClick={() => setOpenMenu('search')} />
       </div>
       
       {openMenu === 'search' && (
         <div className="absolute top-[60px] left-0 w-full bg-[#FDFBF7] border border-moBlack rounded-xl shadow-lg p-2 z-50">
           <p className="text-xs text-gray-400 font-bold px-4 py-2">Recent</p>
           <ul className="flex flex-col gap-1">
             {recentSearches.map(item => (
               <li key={item.id}>
                 <Link to="/" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-moCream hover:border-moOlive border border-transparent transition-all group cursor-pointer text-gray-600">
                   <div className="flex items-center gap-3">
                     <Icon name={item.type} size={16} color="#A1A34E" />
                     <span className="text-sm font-medium">{item.text} <span className="text-gray-400 font-normal ml-2">| {item.date}</span></span>
                   </div>
                   <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                 </Link>
               </li>
             ))}
           </ul>
         </div>
       )}
     </div>

     {/* 通知 + 頭貼 */}
     <div className="flex gap-4">
       <div className="relative">
         <button onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-moOlive rounded-full bg-white border border-moBlack shadow-sm transition-colors relative">
           <Icon name="bell" size={18} color="currentColor"/>
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 border border-white rounded-full"></span>
         </button>
         {openMenu === 'notif' && (
           <div className="absolute top-[50px] right-0 w-64 bg-[#FDFBF7] border border-moBlack rounded-xl shadow-lg p-2 z-50">
             <p className="text-xs text-gray-400 font-bold px-4 py-2">Recent</p>
             <ul className="flex flex-col gap-1">
               {notifications.map(notif => (
                 <li key={notif.id}>
                   <Link to="/" className={`block px-4 py-3 rounded-lg text-sm border transition-all ${notif.unread ? 'bg-[#D4E2A5]/30 border-[#A1A34E]/50 font-bold text-gray-800' : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-100'}`}>
                     {notif.unread ? '● ' : '○ '}{notif.text}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
         )}
       </div>

       <div className="relative">
         <button onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-moOlive rounded-full bg-white border border-moBlack shadow-sm transition-colors">
           <Icon name="user" size={18} color="currentColor"/>
         </button>
         {/* 統一好的個人選單 */}
         {openMenu === 'profile' && (
           <div className="absolute top-[50px] right-0 w-48 bg-[#FDFBF7] border border-moBlack rounded-xl shadow-lg py-2 z-50">
             <Link to="/profile" className="block px-6 py-3 text-sm text-gray-700 hover:bg-[#D4E2A5]/40 hover:text-[#3d5a10] font-bold transition-colors">帳戶</Link>
             <Link to="/profile/personal" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">個人檔案</Link>
             <Link to="/settings" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">設定</Link>
             <div className="border-t border-gray-200 my-1"></div>
             <Link to="/" className="block px-6 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">登出</Link>
           </div>
         )}
       </div>
     </div> 
   </header>

   {/* ===== 主要內容區 ===== */}
   <div className="flex-1 flex gap-4 px-8 pb-8 overflow-hidden">
     
     {/* 左側導覽列 */}
     <nav className="flex flex-col items-center pb-2">
       <div className="w-16 bg-moCream/80 rounded-[2rem] flex flex-col items-center py-6 gap-6 shadow-sm border border-moBlack">
         {/* 修復了所有 NavLink 裡面的註解斷層 */}
         <NavLink to="/home" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive border-2 border-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-[#6b7280] hover:text-moBrown"}`}><Icon name="home" size={20} color="currentColor" /></NavLink>
         <NavLink to="/diary" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive border-2 border-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-[#6b7280] hover:text-moBrown"}`}><Icon name="diary" size={20} color="currentColor" /></NavLink>
         <NavLink to="/habit" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive border-2 border-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-[#6b7280] hover:text-moBrown"}`}><Icon name="sparkle" size={20} color="currentColor" /></NavLink>
         <NavLink to="/calendar" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive border-2 border-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-[#6b7280] hover:text-moBrown"}`}><Icon name="calendar" size={20} color="currentColor" /></NavLink>
         <NavLink to="/analyze" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive border-2 border-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-[#6b7280] hover:text-moBrown"}`}><Icon name="gauge" size={20} color="currentColor" /></NavLink>
         <NavLink to="/chat" className={({ isActive }) => `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-moOlive border-2 border-moOlive text-[#3d5a10] shadow-sm" : "hover:bg-moOlive hover:scale-110 hover:-translate-y-1 text-[#6b7280] hover:text-moBrown"}`}><Icon name="chat" size={20} color="currentColor" /></NavLink>
       </div>
       
       <NavLink to="/giftwall" className="group mt-auto w-16 h-16 bg-moBrown hover:bg-white/60 text-white hover:text-moBrown transition flex items-center justify-center rounded-[2rem] shadow-sm border border-moBlack">
         <Icon name="star" size={24} color="currentColor"/>
       </NavLink>
     </nav>

     {/* 右側：Habit 頁面內容 */}
     <main className="flex-1 flex justify-center items-center py-4 overflow-y-auto">
         <div className="text-2xl font-bold font-serif text-moBrown/50 border-2 border-dashed border-moBrown/30 rounded-[2rem] p-20">
           炯宇的 Habit Page 準備中...
         </div>
     </main>
   </div>
 </div>
 </ClickSpark>
);
};

export default HabitPage;