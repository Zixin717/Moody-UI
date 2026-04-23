import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

//  Icon -> 確保裡面有 user 跟 pencil
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
    pencil: <><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    // 這裡可以加上 Topbar 需要的其他 icon (moon, star 等)，如果要放 Topbar 的話
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icons[name] ?? null}</svg>;
};

const PersonalProfilePage = () => {
  return (
    // 外層網格背景 + 基本排版
    <div className="min-h-screen bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col font-sans">
      
      {/* 臨時的返回首頁按鈕，方便我測試跳轉 */}
      <div className="absolute top-6 left-8">
        <Link to="/home" className="text-[30px] text-moBlack font-bold font-serif hover:text-moAzure transition-colors">Moody</Link>
      </div>

      <main className="flex-1 flex justify-center py-4 overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col items-center pt-20">
          
          {/* 核心：頭貼區塊 (Hover 特效) */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-moBlack group cursor-pointer shadow-md">
            {/* 示意大頭貼 */}
            <div className="w-full h-full bg-moCream flex items-center justify-center">
              <Icon name="user" size={48} color="#786C56" />
            </div>
            
            {/* 半透明遮罩與鉛筆 */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Icon name="pencil" size={32} color="#ffffff" />
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-serif font-bold text-moBrown">My Profile</h1>
          <p className="text-gray-500 mt-2">Here is your personal space.</p>
          
        </div>
      </main>
    </div>
  );
};

export default PersonalProfilePage;