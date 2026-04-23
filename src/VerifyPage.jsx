import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VerifyPage = () => {
  const navigate = useNavigate();

  // 核心變數 -> 用 step 來控制現在顯示哪一個畫面
  // 1: 輸入舊密碼確定為本人操作
  // 2: 新密碼更動畫面
  const [step, setStep] = useState(1);

  // 模擬各個步驟的點擊動作
  const handleVerifyOldPassword = () => setStep(2);
  
  // 修正：把函數名稱改為 handleSavePassword 讓底下按鈕找得到！
  const handleSavePassword = () => {
    alert("密碼修改成功！請重新登入。");
    navigate('/login');
  };

  return (
    <>
      {/* 淡入動畫 */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      <div className="min-h-screen bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col items-center justify-center font-sans">
        
        {/* 左上角 Logo 回首頁 */}
        <div className="absolute top-6 left-8">
          <Link to="/home" className="text-[30px] text-moBlack font-bold font-serif hover:text-moAzure transition-colors">Moody</Link>
        </div>

        {/* 修改密碼共用卡片 start */}
        <div className="bg-white border border-moBlack rounded-[2.5rem] p-12 flex flex-col items-center shadow-md w-[450px] min-h-[450px] transition-all duration-300">

          {/* =========================================
              Step 1：輸入舊密碼驗證身份
          ========================================= */}
          {step === 1 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Verify Identity</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter Your Old Password<br/>To Verify Your Identity</p>

              {/* 信封圖示 */}
              <div className="w-16 h-12 flex items-center justify-center mb-10">
                 <svg width="60" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 14 22 6" /></svg>
              </div>

              {/* Password 輸入框 */}
              <div className="w-full flex flex-col gap-2 mb-4">
                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input type="password" placeholder="Old Password" className="w-full bg-transparent outline-none text-sm text-gray-700" />
                </div>
                <div className="text-right">
                  {/* 修正：改成用 Link 導回設定頁，體驗更好 */}
                  <Link to="/profile" className="text-xs font-bold text-gray-500 hover:text-moOlive transition-colors">取消並返回</Link>
                </div>
              </div>

              <button onClick={handleVerifyOldPassword} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Verify
              </button>
            </div>
          )}

          {/* =========================================
              Step 2：設定新密碼
          ========================================= */}
          {step === 2 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Create New Password</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter New Password<br/>To Reset Account</p>

              <div className="w-16 h-12 flex items-center justify-center mb-6">
                 {/* 鎖頭圖示 */}
                 <svg width="50" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>

              <div className="w-full flex flex-col gap-4 mb-4">
                {/* 密碼輸入框 1 */}
                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input type="password" placeholder="Enter Password" className="w-full bg-transparent outline-none text-sm text-gray-700" />
                </div>

                {/* 密碼輸入框 2 */}
                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input type="password" placeholder="Confirm Password" className="w-full bg-transparent outline-none text-sm text-gray-700" />
                </div>
              </div>

              <button onClick={handleSavePassword} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Save
              </button>
            </div>
          )}

        </div> {/* 修改密碼共用卡片 end */}
      </div>
    </>
  );
};

export default VerifyPage;