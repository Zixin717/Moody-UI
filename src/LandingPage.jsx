import React from 'react';
// 1. 引入 useNavigate
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // 2. 呼叫 useNavigate 來取得導航功能
  const navigate = useNavigate();

  // 3. 點擊 Login 按鈕後會執行的動作
  const handleLogin = () => {
    // Result -> 帶用戶帶去 /login 頁面
    navigate('/login');
  };

  // 4. 點擊 Join us 按鈕後會執行的動作
  const handleJoin = () => {
    // Result -> 帶用戶帶去 /register 頁面
    navigate('/register');
  };


  return (
    // 1. 最外層背景：使用深色星空背景，加上慢速放大的動畫 (animate-pulse 模擬星光閃爍)
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      
      {/* 背景裝飾：兩顆巨型發光圓體，模擬銀河星雲。 */}
      <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>

      {/* 2. 主視覺卡片 */}
      {/* relative z-10 確保卡片在背景之上 */}
      <div className="relative z-10 w-full max-w-5xl h-[600px] flex items-center">
        
        {/* === 邊框星星軌道特效 === */}
        {/* 用一層稍微大一點的 absolute 容器來包住卡片，做出星星沿著邊界的效果 */}
        <div className="absolute inset-0 rounded-3xl border border-white/20">
            {/* 裝飾星星 1：左上角 */}
            <div className="absolute w-64 h-64 
								border border-white/10 
								rounded-full animate-spin [animation-duration:10s]">
                    <div className="absolute -bottom-1 -left-1
                            w-3 h-3 
                            bg-white rounded-full 
                            border-4 border-white 
                            flex items-center justify-center 
                            shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-bounce"></div>
            </div>

            {/* 裝飾星星 2：右上角 */}
            <div className="absolute -top-8 right-32 
                            w-16 h-16 bg-[#D4E2A5] rounded-full 
                            border border-white/10 
                            shadow-[0_0_30px_rgba(212,226,165,0.8)]
                            animate-pulse"></div>

            {/* 裝飾星星 3：左上角 */}
            <div className="absolute w-64 h-64 
								border border-white/10 
								rounded-full animate-spin [animation-duration:10s]">
                    <div className="absolute top-0 left-1/2 
								                    w-4 h-4 bg-white rounded-full 
								                    shadow-[0_0_15px_white]"></div>
            </div>
        </div>

        {/* === 真正的卡片內容區 === */}
        <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-3xl p-12 flex relative overflow-hidden shadow-2xl">
            
            {/* 左半邊：文字介紹區 */}
            <div className="w-1/2 flex flex-col justify-center pr-12 relative z-10">
                <h2 className="text-white text-xl font-bold tracking-widest mb-2">Moody</h2>
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                    擁抱情緒<br/>記錄真實的自己
                </h1>
                <p className="text-slate-300 mb-10 leading-relaxed">
                    在 Moody，我們相信情緒是人類最真實的語言。<br/>
                    每一天的心情都值得被記錄。<br/>用 Moody 追蹤情緒、養成好習慣。
                </p>
                <button onClick={handleJoin} className="w-40 px-6 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-slate-900 transition-all duration-300">
                    Join us →
                </button>
            </div>

            {/* 右半邊：卡片內部的小銀河系 */}
            <div className="w-1/2 h-full relative flex items-center justify-center">
                {/* 先畫一個小型的發光體代表內部銀河 */}
                <div className="absolute w-64 h-64 border border-white/10 rounded-full animate-spin [animation-duration:10s]">
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"></div>
                </div>
                <div className="absolute w-40 h-40 border border-white/20 rounded-full animate-spin [animation-duration:6s] direction-reverse">
                    <div className="absolute bottom-0 left-1/4 w-3 h-3 bg-[#D4E2A5] rounded-full shadow-[0_0_15px_#D4E2A5]"></div>
                </div>
                <div className="text-white/50 text-sm z-10">這裡可以放入 SolarSystemRoom</div>
            </div>

            {/* 右上角的 Login 按鈕 (這是一個浮動在卡片右上角的按鈕) */}
            <button onClick={handleLogin} className="absolute top-8 right-8 px-8 py-2 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                Login ↗
            </button>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;