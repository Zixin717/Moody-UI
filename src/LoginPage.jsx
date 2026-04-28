import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();

  // 1. 收集信箱與密碼
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. 登入邏輯
  const handleLogin = async (e) => {
    e.preventDefault(); // 防止表單重整

    try {
      // 記得換成後端的 port -> 目前 7247
      const response = await fetch('https://localhost:7247/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("登入成功！歡迎回來，" + data.user.nickname);
        
        // 注意：把用戶資料存進瀏覽器的 localStorage  
        // 這樣別的頁面 (Home, Profile) 就能拿到這個人的資料了
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        navigate('/home');
      } else {
        alert("信箱或密碼錯誤！請再試一次。");
      }
    } catch (error) {
      console.error("API 連線錯誤:", error);
      alert("無法連接到伺服器！");
    }
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

        {/* Form 表單送出 */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive transition-colors">
            <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="E-mail" className="w-full bg-transparent outline-none text-sm text-gray-700" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive transition-colors">
              <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full bg-transparent outline-none text-sm text-gray-700" />
            </div>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-xs font-bold text-gray-500 hover:text-moOlive">Forgot Password?</Link>
            </div>
          </div>

          <button type="submit" className="mt-6 w-full py-3 rounded-full border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
              Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;