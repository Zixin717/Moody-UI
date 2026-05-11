/* ===== 功能元件 ===== */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';

/* ===== 設計組件 ===== */
import InteractiveGalaxy from './InteractiveGalaxy'; // 銀河系
import { mockEntries } from './mockEntries';         // 假資料
import MainLayout from './MainLayout';               // 佈局
import Icon from './Icon';                           // 全域 Icon

// 注意：
//      1. 功能元件 -> 如果頁面需要導入功能組件，請在「功能元件」導入。
//      2. 設計元件 -> 基本上不用動，幫各位設計好了。

const DiaryPage = () => {
  /* ===== 跳頁實現 ===== */
  const navigate = useNavigate();

  const { date } = useParams(); // 從網址抓 -> 格式範例: 2026-05-09
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從 localStorage 拿 userId
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.id;

    // 打 API 問這天有沒有日記
    fetch(`https://localhost:7247/api/diary/by-date?userId=${userId}&date=${date}`)
      .then(res => {
        if (res.status === 404) return null; // 這天沒有日記
        return res.json();
      })
      .then(data => {
        setDiary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date]); // date 變了就重新打 API

  if (loading) return <div>載入中...</div>;

return (
  <MainLayout>
    
     <main className="flex-1 flex justify-center items-center py-4 overflow-y-auto">
         <div className="text-2xl font-bold font-serif text-moBrown/50 border-2 border-dashed border-moBrown/30 rounded-[2rem] p-20">
            <div>
              <p>{date}</p>          {/* 顯示日期 */}
              <p>這天還沒有日記</p>
            </div>
         </div>

       
     </main>



  </MainLayout>

);
};

export default DiaryPage;