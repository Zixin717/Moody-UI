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
import PersonalProfilePage from './PersonalProfilePage'; // 個人資料頁 (細部)

import HabitPage from './HabitPage';     // 習慣頁 -> 把炯宇的心血 import 進來
import DiaryPage from './DiaryPage';     // 日記頁 -> 把弈婷的心血 import 進來
import AnalyzePage from './AnalyzePage'; // 分析頁 -> 把朝弼的心血 import 進來



function App() {
  return (
    // Routes 像電梯的按鈕面板，裡面裝滿了 Route (按鈕)
    <Routes>
      {/* LandingPage (登入預備頁) */}
      <Route path="/" element={<LandingPage />} />

      {/* RegisterPage (註冊頁) */}
      <Route path="/register" element={<RegisterPage />} />

      {/* LoginPage (登入頁) */}
      <Route path="/login" element={<LoginPage />} />

      {/* ForgotPassword (忘記密碼頁) */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* VerifyPage (修改密碼的驗證頁) */}
      <Route path="/verify" element={<VerifyPage />} />
      
      {/* HomePage (首頁) */}
      <Route path="/home" element={<HomePage />} />
      
      {/* ProfilePage (個人資料頁) */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* PersonalProfilePage (個人資料頁細部) */}
      <Route path="/profile/personal" element={<PersonalProfilePage />} />

      {/* 炯宇的心血 -> HabitPage (習慣頁) */}
      <Route path="/habit" element={<HabitPage />} />
      {/* 弈婷的心血 -> DiaryPage (日記頁) */}
      <Route path="/diary" element={<DiaryPage />} />
      {/* 朝弼的心血 -> AnalyzePage (分析頁) */}
      <Route path="/analyze" element={<AnalyzePage />} />

      {/* 升級 2：對於還沒建檔案的頁面 (例如月曆、聊天)，我們先隨便導向一個現有的頁面，或者寫一個行內假畫面，防止白畫面死機！ */}
      <Route path="/calendar" element={
        <div className="h-screen flex items-center justify-center text-2xl font-serif text-moBrown bg-moCream">
          月曆頁面施工中...
        </div>
      } />
      <Route path="/chat" element={
        <div className="h-screen flex items-center justify-center text-2xl font-serif text-moBrown bg-moCream">
          匿名分享施工中...
        </div>
      } />
      <Route path="/giftwall" element={
        <div className="h-screen flex items-center justify-center text-2xl font-serif text-moBrown bg-moCream">
          獎勵牆施工中...
        </div>
      } />

      {/* 防呆：404 找不到網頁時的預設路由 */}
      {/* 只要網址亂打，或是忘記註冊，就會跑到這裡。 */}
      <Route path="*" element={
        <div className="h-screen flex flex-col items-center justify-center bg-moCream text-moBrown">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-4">哎呀！總機找不到這個頁面哦！</p>
          <a href="/home" className="px-6 py-2 bg-moOlive text-white rounded-full">帶我回大廳</a>
        </div>
      } />

      
    </Routes>
  );
}

export default App;