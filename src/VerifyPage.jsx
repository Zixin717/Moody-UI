import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VerifyPage = () => {
  const navigate = useNavigate();

  // 1. 畫面狀態控制
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState(""); // 顯示錯誤訊息用

  // 2. 表單輸入狀態
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 測試：假設目前的登入使用者 ID，實務上通常從 localStorage 或 Context 取出)
  const currentUserId = 1; 

  // ==========================================
  // Step 1: 驗證舊密碼 (打給 C# 後端)
  // ==========================================
  const handleVerifyOldPassword = async () => {
    setErrorMsg("");
    if (!oldPassword) {
      setErrorMsg("請輸入舊密碼");
      return;
    }

    try {
      // 向 C# 後端發送驗證請求
      // 注意：這裡的 URL 取決於組員 C# API 的路由設計
      const response = await fetch('https://localhost:7247/api/Auth/VerifyPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, 
          password: oldPassword 
        })
      });

      if (response.ok) {
        // 驗證成功，進入第二步
        setStep(2);
      } else {
        setErrorMsg("舊密碼錯誤，請重新輸入。");
      }
    } catch (error) {
      console.error("驗證失敗:", error);
      setErrorMsg("伺服器連線異常。");
    }
  };

  // ==========================================
  // Step 2: 儲存新密碼 (打給 C# 後端)
  // ==========================================
  const handleSavePassword = async () => {
    setErrorMsg("");
    if (!newPassword || !confirmPassword) {
      setErrorMsg("密碼欄位不能為空");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("兩次輸入的新密碼不一致");
      return;
    }

    try {
      // 向 C# 後端發送變更密碼請求
      const response = await fetch('https://localhost:7247/api/Auth/ChangePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, 
          oldPassword: oldPassword, // 通常需要再傳一次舊密碼確保安全
          newPassword: newPassword 
        })
      });

      if (response.ok) {
        alert("密碼修改成功！請重新登入。");
        navigate('/login');
      } else {
        setErrorMsg("密碼修改失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("修改失敗:", error);
      setErrorMsg("伺服器連線異常。");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      <div className="min-h-screen bg-[#FDFBF7] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col items-center justify-center font-sans">
        
        <div className="absolute top-6 left-8">
          <Link to="/home" className="text-[30px] text-moBlack font-bold font-serif hover:text-moAzure transition-colors">Moody</Link>
        </div>

        <div className="bg-white border border-moBlack rounded-[2.5rem] p-12 flex flex-col items-center shadow-md w-[450px] min-h-[450px] transition-all duration-300">

          {/* =========================================
              Step 1 畫面
          ========================================= */}
          {step === 1 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Verify Identity</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter Your Old Password<br/>To Verify Your Identity</p>

              <div className="w-16 h-12 flex items-center justify-center mb-10">
                 <svg width="60" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 14 22 6" /></svg>
              </div>

              {/* 錯誤提示訊息區塊 */}
              {errorMsg && <div className="text-red-500 text-sm font-bold mb-2">{errorMsg}</div>}

              <div className="w-full flex flex-col gap-2 mb-4">
                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input 
                    type="password" 
                    placeholder="Old Password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700" 
                  />
                </div>
                <div className="text-right">
                  <Link to="/profile" className="text-xs font-bold text-gray-500 hover:text-moOlive transition-colors">取消並返回</Link>
                </div>
              </div>

              <button onClick={handleVerifyOldPassword} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Verify
              </button>
            </div>
          )}

          {/* =========================================
              Step 2 畫面
          ========================================= */}
          {step === 2 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Create New Password</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter New Password<br/>To Reset Account</p>

              <div className="w-16 h-12 flex items-center justify-center mb-6">
                 <svg width="50" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>

              {/* 錯誤提示訊息區塊 */}
              {errorMsg && <div className="text-red-500 text-sm font-bold mb-2">{errorMsg}</div>}

              <div className="w-full flex flex-col gap-4 mb-4">
                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700" 
                  />
                </div>

                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700" 
                  />
                </div>
              </div>

              <button onClick={handleSavePassword} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Save
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default VerifyPage;