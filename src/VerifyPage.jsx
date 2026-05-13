import React, { useState } from 'react';

const VerifyPage = () => {
  // 1. 畫面狀態控制
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // 2. 表單輸入狀態
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // localStorage 取出 UserId（登入時存的）
  const currentUserId = localStorage.getItem('currentUserId');

  // ==========================================
  // Step 1: 驗證舊密碼
  // ==========================================
  const handleVerifyOldPassword = async () => {
    setErrorMsg("");
    if (!oldPassword) {
      setErrorMsg("請輸入舊密碼");
      return;
    }

    try {
      const response = await fetch('/api/User/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // ← 帶上 session cookie
        body: JSON.stringify({
          userId: currentUserId,
          password: oldPassword
        })
      });

      if (response.ok) {
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
  // Step 2: 儲存新密碼
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
      const response = await fetch('/api/User/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: currentUserId,
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      if (response.ok) {
        alert("密碼修改成功！請重新登入。");
        //  改用 window.location 跳到組員的登入頁
        window.location.href = '/Entry/Welcome';
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
          {/* 用普通 <a> 連到首頁 */}
          <a href="/FrontPage/Index" className="text-[30px] text-var(--mo-black) font-bold font-serif hover:text-[var(--mo-azure)] transition">Moody</a>
        </div>

        <div className="bg-white border border-moBlack rounded-[2.5rem] p-12 flex flex-col items-center shadow-md w-[450px] min-h-[450px] transition-all duration-300">

          {step === 1 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Verify Identity</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter Your Old Password<br/>To Verify Your Identity</p>

              <div className="w-16 h-12 flex items-center justify-center mb-10">
                 <svg width="60" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 14 22 6" /></svg>
              </div>

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
                  {/* 用普通 <a> 連到個人檔案頁 */}
                  <a href="/FrontPage/Profile" className="text-xs font-bold text-gray-500 hover:text-moOlive transition-colors">取消並返回</a>
                </div>
              </div>

              <button onClick={handleVerifyOldPassword} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Verify
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Create New Password</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter New Password<br/>To Reset Account</p>

              <div className="w-16 h-12 flex items-center justify-center mb-6">
                 <svg width="50" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>

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