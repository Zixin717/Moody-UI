import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MainLayout from './MainLayout'; // 全域 佈局
import Icon from './Icon';             // 全域 Icon


const ProfilePage = () => {
  // 選單與收折狀態
  const [openMenu, setOpenMenu] = useState(null);
  const [openSections, setOpenSections] = useState({ account: true, setting: false, delete: false });
  
  // 生日資料狀態
  const [birthday, setBirthday] = useState('2000-01-01');

  // 收折功能
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 格式化生日顯示方法
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "YYYY / MM / DD";
    return dateStr.replace(/-/g, " / ");
  };

  return (
    <MainLayout>

      <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    
        {/* 帳戶設定主內容 */}
        <main className="flex-1 flex justify-center py-4 overflow-y-auto">
          <div className="w-full max-w-3xl flex flex-col gap-4">
            
            {/* ── 1. Account 區塊 ── */}
            <div className="bg-moCream/80 border border-moBlack rounded-[2rem] p-8 shadow-sm transition-all duration-300">
              {/* 收折標題 */}
              <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => toggleSection('account')}>
                <h2 className="text-xl font-bold font-serif text-moBrown">Account</h2>
                <button className="text-moBrown/60 hover:text-moOlive transition-colors">
                  <Icon name={openSections.account ? "chevronUp" : "chevronDown"} size={24} color="currentColor" />
                </button>
              </div>

              {/* 展開後的內容 */}
              {openSections.account && (
                <div className="flex flex-col gap-5">                  
                  {/* E-mail */}
                  <label className="block group cursor-text">
                    <span className="block text-sm font-bold text-moBrown/80 mb-2">E-mail</span>
                    <div className="flex items-center justify-between bg-white border border-moBlack rounded-xl px-4 py-3 transition-colors focus-within:border-moAzure hover:border-moAzure group cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="text-moOlive"><Icon name="mail" size={20} color="currentColor" /></div>
                        <input type="email" defaultValue="Test_@gmail.com" className="w-full outline-none text-gray-700 font-medium bg-transparent" />
                      </div>
                      <span className="text-sm font-bold text-gray-400 group-focus-within:text-moAzure transition-colors">Edit</span>
                    </div>
                  </label>

                  {/* Password (點擊跳轉身份驗證頁) */}
                  <div>
                    <span className="block text-sm font-bold text-moBrown/80 mb-2">Password</span>
                    <Link to="/verify" className="flex items-center justify-between bg-white border border-moBlack rounded-xl px-4 py-3 hover:border-moAzure transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-moOlive"><Icon name="sparkle" size={20} color="currentColor" /></div>
                        <span className="text-gray-700 tracking-widest mt-1">********</span>
                      </div>
                      <span className="text-sm font-bold text-gray-400 group-hover:text-moAzure transition-colors">Edit</span>
                    </Link>
                  </div>

                  {/* Birthday */}
                  <label className="block group cursor-pointer">
                    <span className="block text-sm font-bold text-moBrown/80 mb-2">Birthday</span>
                    <div className="relative flex items-center justify-between bg-white border border-moBlack rounded-xl px-4 py-3 transition-colors focus-within:border-moAzure hover:border-moAzure group cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className="text-moOlive"><Icon name="calendar" size={20} color="currentColor" /></div>
                        {/* 核心：原生 date input，並透過 CSS 隱藏原生圖示 */}
                        <input 
                          type="date" 
                          value={birthday} 
                          onChange={(e) => setBirthday(e.target.value)}
                          className="w-full outline-none text-gray-700 font-medium bg-transparent cursor-pointer" 
                        />
                      </div>
                      {/* 灰底日曆 Icon 提醒，Hover 後會變藍 */}
                      <div className="text-moBrown/60 group-focus-within:text-moAzure group-hover:text-moAzure transition-colors">
                        <Icon name="calendar" size={20} color="currentColor" />
                      </div>
                    </div>
                  </label>

                  {/* 儲存按鈕追加 (依照草圖樣式與 Reset 放在一起) */}
                  <div className="flex justify-center gap-4 mt-6">
                    <button className="px-8 py-2 rounded-full border border-moBlack bg-white text-moBrown font-bold hover:bg-gray-50 transition-colors shadow-sm">
                      Reset
                    </button>
                    <button className="px-8 py-2 rounded-full border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] transition-colors shadow-sm">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. Setting 區塊 ── */}
            <div className="bg-moCream/80 border border-moBlack rounded-[2rem] p-8 shadow-sm transition-all duration-300">
              <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => toggleSection('setting')}>
                <h2 className="text-xl font-bold font-serif text-moBrown">Setting</h2>
                <button className="text-moBrown/60 hover:text-moOlive transition-colors">
                  <Icon name={openSections.setting ? "chevronUp" : "chevronDown"} size={24} color="currentColor" />
                </button>
              </div>

              {openSections.setting && (
                <div className="flex flex-col gap-6 pt-4">                  
                 {/* 通知切換 (切換按鈕) */}
                  <div className="relative flex items-center justify-between bg-white border border-moBlack rounded-xl px-5 py-4 cursor-pointer hover:border-moAzure transition-colors">
                    <div className="flex items-center gap-4">
                      <Icon name="globe" size={20} color="#786C56" />
                      <span className="text-sm font-bold text-moBrown/80">Notifications</span>
                      <span className="text-xs text-gray-400 font-bold ml-2">On</span>
                    </div>
                    {/* 極簡開關示意圖 (之後可以做開關狀態) */}
                    <div className="w-12 h-6 rounded-full bg-moOlive p-1 flex items-center justify-end border border-moBlack shadow-inner">
                      <div className="w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>

                  {/* 主題切換 (切換按鈕) */}
                  <div className="relative flex items-center justify-between bg-white border border-moBlack rounded-xl px-5 py-4 cursor-pointer hover:border-moAzure transition-colors">
                    <div className="flex items-center gap-4">
                      <Icon name="moon" size={20} color="#786C56" />
                      <span className="text-sm font-bold text-moBrown/80">Theme</span>
                      <span className="text-xs text-gray-400 font-bold ml-2">Beige</span>
                    </div>
                    {/* 極簡開關示意圖 (之後可以做開關狀態) */}
                    <div className="w-12 h-6 rounded-full bg-moOlive p-1 flex items-center justify-end border border-moBlack shadow-inner">
                      <div className="w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>

                  

                   
                </div>
              )}
            </div>

            {/* ── 3. Delete Account ── */}
            <div className="bg-moCream/80 border border-moBlack rounded-[2rem] p-8 shadow-sm transition-all duration-300">
              {/* 收折標題 (Delete Account 顏色改為警告紅) */}
              <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => toggleSection('delete')}>
                <h2 className="text-xl font-bold font-serif text-red-500">Delete Account</h2>
                <button className="text-red-500/60 hover:text-red-700">
                  <Icon name={openSections.delete ? "chevronUp" : "chevronDown"} size={24} color="currentColor" />
                </button>
              </div>

              {openSections.delete && (
                <div className="flex flex-col gap-6 pt-4 items-center">
                  
                  {/* 嚴重警告圖示與文字 */}
                  <div className="flex flex-col items-center text-center gap-4 border-l-4 border-red-400 pl-6 bg-red-50 py-4 rounded-r-xl w-full">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-lg font-bold text-red-600">Danger Zone</h4>
                      <p className="text-sm text-red-500 max-w-md">刪除帳號將永久移除您所有的 Moody 日記、習慣追蹤、個人資料與設定。此動作<b>無法還原</b>。請謹慎操作。</p>
                    </div>
                  </div>

                   {/* 確認 Checkbox (極簡日系開關樣式示意) */}
                  <label className="flex items-center gap-3 cursor-pointer group mt-4">
                    <div className="w-5 h-5 border-2 border-red-300 rounded-md flex items-center justify-center group-hover:border-red-500 transition-colors">
                      {/* 如果選中，這裡可以加一個Icon check */}
                      <div className="w-3 h-3 bg-red-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-sm font-medium text-red-500 group-hover:text-red-700">我已閱讀警告，並確認要刪除帳號。</span>
                  </label>

                  {/* 下方 Delete 按鈕 */}
                  <div className="flex justify-center gap-4 mt-8 w-full">
                    <button className="px-8 py-2 rounded-full border border-moBlack bg-red-500 text-white font-bold hover:bg-red-700 transition-colors shadow-sm">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      
      </>

    </MainLayout>
  );
};

export default ProfilePage;