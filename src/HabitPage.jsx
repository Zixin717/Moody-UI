/* ===== 功能元件 ===== */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

/* ===== 設計組件 ===== */
import InteractiveGalaxy from './InteractiveGalaxy'; // 銀河系
import { mockEntries } from './mockEntries';         // 假資料
import MainLayout from './MainLayout';               // 佈局
import Icon from './Icon';                           // 全域 Icon
import './HabitPage.css';                            // 引入炯宇的樣式

// 注意：
//      1. 功能元件 -> 如果頁面需要導入功能組件，請在「功能元件」導入。
//      2. 設計元件 -> 基本上不用動，幫各位設計好了。


/* ============================================================
   1. 靜態資料區 (放在 Component 外面，才不會每次渲染都重新建立)
   ============================================================ */
const moodMeta={"開心":["☀","happy"],"平靜":["~","calm"],"低落":["·","low"],"焦慮":["!","anx"]};
const thumbs=["linear-gradient(135deg,#84bfae,#f4c6a5)","linear-gradient(135deg,#92b6d5,#f0d48d)","linear-gradient(135deg,#8fc5ba,#e8a0a7)","linear-gradient(135deg,#b6c58b,#efb092)","linear-gradient(135deg,#7fb0a4,#c7b3df)","linear-gradient(135deg,#a8c1d6,#f2b7a0)","linear-gradient(135deg,#87b996,#e6c169)","linear-gradient(135deg,#97b8a9,#e79a8d)"];
const titles=["慢慢整理房間","事情擠在一起","和朋友吃飯","效率不高的一天","睡前讀了幾頁書","陽光很好","把進度重新排好","雨後散步"];
const summaries=["把桌面清出來後，心裡也安靜了一點。","早上醒來就覺得進度壓著，只能先拆成小段。","把擔心說出口後，很多事好像變小了。","白天有點卡，晚上只完成一個最小任務。","沒有大起伏，但睡前讀書讓心情沉下來。","出門走走拍了幾張照片，晚上還有力氣整理下週。","做完版本整理後，心裡比較知道下一步。","空氣變乾淨，走路時腦袋也比較清楚。"];
const fullTexts=["今天沒有特別趕的事，先把桌面整理乾淨。下午泡茶、補一點作業，晚上散步回來時覺得步調比較穩。","專題和待辦同時靠近，整天腦袋都很滿。下午把任務拆小後，至少完成最急的一項。","和朋友吃飯後心情變亮，也被提醒不要只看還沒完成的部分。","今天很容易分心。後來把目標改小，完成一個很小的任務，讓今天至少有收尾。","睡前把手機放遠一點，讀了幾頁書。這種平靜很值得留下來。","陽光很好，路邊植物看起來都很精神。回家後心情還在，所以整理了下週安排。","整理專題頁面與分工後，焦慮感有下降一點。","下過雨後走了一圈。這不是大事，但讓今天有一個舒服的段落。"];
const highlightOrder=["最近一次放鬆片段","一段平靜時光","完成感片段","值得再看一次","上個月的今天","去年的今天"];

function dateShift(days){let d=new Date(2026,3,13-days);return d.toISOString().slice(0,10)}
function weekday(date){return"日一二三四五六"[new Date(date+"T00:00:00").getDay()]}
function buildDataset(prefix,count,moods,stress,photoRule){
  return Array.from({length:count},(_,i)=>{
    let date=i===count-2?"2026-03-13":i===count-1?"2025-04-13":dateShift(i);
    let highlightType=i===count-1?"去年的今天":i===count-2?"上個月的今天":i<4?highlightOrder[i]:"";
    let photoCount=photoRule(i),mood=moods[i%moods.length],stressLevel=stress[i%stress.length];
    return {id:`${prefix}${String(i+1).padStart(2,"0")}`,date,weekday:weekday(date),mood,stressLevel,sleepHours:Number((5.4+(i%5)*.5).toFixed(1)),energyLevel:42+(i%7)*7,diaryTitle:titles[i%titles.length],diarySummary:summaries[i%summaries.length],diaryFullText:fullTexts[i%fullTexts.length],tags:[["整理","散步","穩定","專題","閱讀","照片"][i%6]],photoList:Array.from({length:photoCount},(_,p)=>({id:`${prefix}${i+1}-p${p+1}`,gradient:thumbs[(i+p)%thumbs.length],caption:`${titles[i%titles.length]} ${p+1}`})),taskCompleted:i%5,taskTotal:4+(i%3),isHighlighted:!!highlightType,isHighStress:stressLevel==="高",hasPhoto:photoCount>0,highlightType};
  });
}

const datasets={
  normal:buildDataset("n",14,["平靜","焦慮","開心","低落","平靜"],["低","高","中","中","低"],i=>[2,0,1,0,1,3,0,1][i%8]),
  starter:buildDataset("s",4,["平靜","焦慮","開心","低落"],["低","中","低","中"],i=>i%2===0?1:0),
  stable:buildDataset("t",12,["平靜","開心","平靜","平靜"],["低","低","低","中"],i=>[2,1,0,1,2,1,0,3][i%8]),
  rich:buildDataset("r",24,["平靜","開心","焦慮","平靜","低落"],["中","低","高","低","中"],i=>i%3===0?3:i%4===0?0:1)
};


const HabitPage = () => {
  /* ===== 跳頁實現 ===== */
  const navigate = useNavigate();

  // 取代原本原生 JS 的 state 物件，全部改成 React 的 useState。
  const [tab, setTab] = useState("time");
  const [datasetKey, setDatasetKey] = useState("normal");
  
  // 之後會用到的狀態，先宣告起來放著
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedPhotoId, setSelectedPhotoId] = useState("");

  // 取得當前選擇的資料陣列
  const currentEntries = datasets[datasetKey];

return (

  <MainLayout>
    

      {/* 從這裡開始寫自己的內容，記得要放在 <MainLayout> 裡面喔！ */}
      <main className="flex-1 flex flex-col justify-center items-center py-4 overflow-y-auto">
        
          {/* 組員設計的容器範圍 */}
        <div className="app">
          
          {/* 頂部控制區 */}
          <header className="top">
            <div>
              <span className="eyebrow">情緒日記 + 任務系統｜回顧模組</span>
              <h1>先瀏覽，再深入回到那一天。</h1>
              <p>時間回顧用來找日期，照片回顧用畫面喚起記憶；詳情與精選都後置，讓主頁保持輕盈。</p>
            </div>
      
            <div>
              <label htmlFor="datasetSelect">資料量切換</label>
              {/* 轉換：用 onChange 與 value 來控制狀態，取代 addEventListener */}
              <select 
                id="datasetSelect" 
                value={datasetKey}
                onChange={(e) => {
                  setDatasetKey(e.target.value);
                  setSelectedDayId(""); // 切換資料時清空選擇
                }}
              >
                <option value="normal">一般資料版</option>
                <option value="starter">少資料 / 新手版</option>
                <option value="stable">穩定型使用者版</option>
                <option value="rich">多資料版</option>
              </select>
            </div>
          </header>

          {/* 分頁 Tab 區 */}
          <nav className="tabs" aria-label="回顧分頁">
            {/* 核心轉換：用 onClick 切換狀態，用 className 動態判斷 active */}
            <button 
              className={`tab ${tab === "time" ? "active" : ""}`} 
              onClick={() => setTab("time")}
            >
              時間回顧
            </button>
            <button 
              className={`tab ${tab === "photo" ? "active" : ""}`} 
              onClick={() => setTab("photo")}
            >
              照片回顧
            </button>
          </nav>

          {/* 內容渲染區：根據 Tab 狀態決定要畫什麼 */}
          <section id="pageRoot">
            {tab === "time" ? (
              <div className="text-center p-10 border-2 border-dashed border-moOlive text-moBrown/50 rounded-2xl">
                <h3>這裡是時間回顧的畫面</h3>
                <p>目前資料筆數：{currentEntries.length}</p>
                {/* 之後我們要把時間回顧的 HTML 轉換成 JSX 放這裡 */}
              </div>
            ) : (
              <div className="text-center p-10 border-2 border-dashed border-moAzure text-moBrown/50 rounded-2xl">
                <h3>這裡是照片回顧的畫面</h3>
                <p>目前資料筆數：{currentEntries.length}</p>
                {/* 之後要把照片牆的 HTML 轉換成 JSX 放這裡 */}
              </div>
            )}
          </section>

        </div>





      </main>
  </MainLayout>

);
};

export default HabitPage;