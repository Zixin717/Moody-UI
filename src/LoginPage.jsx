import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();
  const loginSuccess = () => {
    // 這裡未來寫驗證密碼的邏輯 -> 目前先顯示登入成功的訊息
    alert("登入成功！準備前往大廳！");
    
    // Result -> 帶用戶帶去 /home 頁面
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col items-center justify-center font-sans">
      
      {/* 左上角 Logo 回首頁 */}
      <div className="absolute top-6 left-8">
        <Link to="/" className="text-[30px] text-moBlack font-bold font-serif hover:text-moCitron transition">Moody</Link>
      </div>

      {/* 登入卡片 */}
      <div className="bg-white border border-moBlack rounded-[2.5rem] p-12 flex flex-col items-center shadow-md w-[400px]">
        <h2 className="text-2xl font-serif text-moBrown mb-2">Login</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Please enter your credentials to login</p>
        
        {/* 信封圖示 */}
        <div className="w-16 h-12 flex items-center justify-center mb-10">
           {/* 用 SVG 畫一個簡單信封線條 */}
           <svg width="120" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 14 22 6" /></svg>
        </div>

        {/* E-mail 輸入框 */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-[#007FFF] transition-colors">
            <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
            <input type="email" placeholder="E-mail" className="w-full bg-transparent outline-none text-sm text-gray-700" />
          </div>
        </div>

        {/* 密碼輸入框 */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-[#007FFF] transition-colors">
            <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
            <input type="password" placeholder="Password" className="w-full bg-transparent outline-none text-sm text-gray-700" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-bold text-gray-500 hover:text-moOlive">Forgot Password?</Link>
          </div>
        </div>

        {/* Next 按鈕 */}
        <button onClick={loginSuccess} className="mt-8 px-10 py-2 rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
            Login
        </button>
      </div>
    </div>
  );
};
export default LoginPage;