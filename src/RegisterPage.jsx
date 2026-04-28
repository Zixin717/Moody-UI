import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon'; // Icon 元件

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. 統一管理所有表單資料的狀態
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    nickname: '',
    birthday: '2000-01-01'
  });

  // 2. 處理輸入框改變的通用函式
  const handleChange = (e) => {
    // 根據 input 的 name 屬性，動態更新對應的資料
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. 處理表單送出的函式 (準備與後端串接)
  const handleRegister = async (e) => {
    e.preventDefault(); // 防止表單預設的重新整理
    
    try {
      // 向 C# API 發送 POST 請求
      // ※ 注意：要換成我自己後端終端機顯示的 Port 號 -> 目前維持 7247
      const response = await fetch('https://localhost:7247/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 將 formData 轉成 JSON 字串送過去
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("註冊成功！請重新登入！");
        navigate('/login');
      } else {
        const errorData = await response.text();
        alert("註冊失敗：" + errorData);
      }
    } catch (error) {
      console.error("API 連線錯誤:", error);
      alert("無法連接到伺服器，請確認後端是否已啟動！");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer;
        }
      `}</style>
  
      <div className="min-h-screen bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col items-center justify-center font-sans relative">
        
        {/* 左上角 Logo 回首頁 */}
        <div className="absolute top-6 left-8">
          <Link to="/" className="text-[30px] text-moBlack font-bold font-serif hover:text-moOlive transition">Moody</Link>
        </div>

        {/* 註冊卡片 */}
        <div className="bg-white border border-moBlack rounded-[2.5rem] p-12 flex flex-col items-center shadow-md w-[450px] animate-fade-in">
          <h2 className="text-2xl font-serif text-moBrown mb-2">Register</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Please enter your details to create an account</p>

          {/* onSubmit 處理表單送出 */}
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            
            {/* E-mail */}
            <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive focus-within:bg-white transition-colors">
              <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="E-mail" className="w-full bg-transparent outline-none text-sm text-gray-700" />
            </div>

            {/* Password */}
            <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive focus-within:bg-white transition-colors">
              <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full bg-transparent outline-none text-sm text-gray-700" />
            </div>

            {/* Nickname */}
            <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive focus-within:bg-white transition-colors">
              <span className="text-moBrown/50 mr-3"><Icon name="user" size={16} color="currentColor" /></span>
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required placeholder="Nickname" className="w-full bg-transparent outline-none text-sm text-gray-700" />
            </div>

            
            {/* Phone */}
            <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive focus-within:bg-white transition-colors">
              <span className="text-moBrown/50 mr-3"><Icon name="chat" size={16} color="currentColor" /></span>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone (Optional)" className="w-full bg-transparent outline-none text-sm text-gray-700" />
            </div>

            {/* Birthday */}
            <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moOlive focus-within:bg-white transition-colors relative overflow-hidden">
              <span className="text-moBrown/50 mr-3"><Icon name="calendar" size={16} color="currentColor" /></span>
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required className="w-full bg-transparent outline-none text-sm text-gray-700" />
            </div>
            
            

            {/* 註冊按鈕 */}
            <button type="submit" className="mt-4 w-full bg-moOlive text-white font-bold py-3 rounded-full hover:bg-[#8e9043] transition-colors shadow-sm">
              Create Account
            </button>
          </form>

          {/* 登入切換 */}
          <p className="mt-6 text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-moOlive font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;