import React from 'react';
// 1. 引入 Router 需要的工具
import { Routes, Route } from 'react-router-dom';

// 2. 引入做好的各個頁面
import LandingPage from './LandingPage';        // 登入預備頁
import RegisterPage from './RegisterPage';      // 註冊頁
import LoginPage from './LoginPage';            // 登入頁
import ForgotPassword from './ForgotPassword';  // 忘記密碼頁
import VerifyPage from './VerifyPage';          // 修改密碼的驗證頁
import HomePage from './HomePage';              // 首頁
import ProfilePage from './ProfilePage';        // 系統資料頁

function App() {
  return (
    <Routes>
      {/* LandingPage (登入預備頁) */}
      <Route path="/" element={<LandingPage />} />

      {/* RegisterPage (註冊頁 / MVC 架構版) */}
      <Route path="/Entry/Register" element={<RegisterPage />} />

      {/* LoginPage (登入頁 / MVC 架構版) */}
      <Route path="/Entry/Login" element={<LoginPage />} />

      {/* ForgotPassword (忘記密碼頁 / MVC 架構版) */}
      <Route path="/Entry/ForgotPassword" element={<ForgotPassword />} />

      {/* VerifyPage (修改密碼的驗證頁 / MVC 架構版) */}
      <Route path="/Entry/Verify" element={<VerifyPage />} />
      
      {/* HomePage (首頁 / MVC 架構版) */}
      <Route path="/FrontPage/Index" element={<HomePage />} />
      
      {/* ProfilePage (個人資料頁) */}
      <Route path="/profile" element={<ProfilePage />} />


      {/* 防呆：404 找不到網頁時的預設路由 */}
      {/* 只要網址亂打，或是忘記註冊，就會跑到這裡。 */}
      <Route path="*" element={
        <div className="h-screen flex flex-col items-center justify-center bg-moCream text-moBrown">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-4">哎呀！總機找不到這個頁面哦！</p>
          <a href="/FrontPage/Index" className="px-6 py-2 bg-moOlive text-white rounded-full">帶我回大廳</a>
        </div>
      } />

      
    </Routes>
  );
}

export default App;