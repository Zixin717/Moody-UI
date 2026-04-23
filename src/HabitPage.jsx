/* ===== 功能元件 ===== */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

/* ===== 設計組件 ===== */
import InteractiveGalaxy from './InteractiveGalaxy'; // 銀河系
import { mockEntries } from './mockEntries';         // 假資料
import MainLayout from './MainLayout';               // 佈局
import Icon from './Icon';                           // 全域 Icon

// 注意：
//      1. 功能元件 -> 如果頁面需要導入功能組件，請在「功能元件」導入。
//      2. 設計元件 -> 基本上不用動，幫各位設計好了。

const HabitPage = () => {
  /* ===== 跳頁實現 ===== */
  const navigate = useNavigate();

return (

  <MainLayout>
    

      {/* 從這裡開始寫自己的內容，記得要放在 <MainLayout> 裡面喔！ */}
      <main className="flex-1 flex justify-center items-center py-4 overflow-y-auto">
          <div className="text-2xl font-bold font-serif text-moBrown/50 border-2 border-dashed border-moBrown/30 rounded-[2rem] p-20">
            炯宇的 Habit Page 準備中...
          </div>
      </main>
    


  </MainLayout>

);
};

export default HabitPage;