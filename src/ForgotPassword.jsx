import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // 1. 畫面與錯誤訊息狀態
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // 2. 表單資料狀態
  const [email, setEmail] = useState("");
  const [codeArray, setCodeArray] = useState(['', '', '', '']); // 存放 4 個數字
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 用來控制 4 格輸入框的焦點 (自動跳下一格用)
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // =========================================
  // Step 1：寄送驗證信
  // =========================================
  const handleSendEmail = async () => {
    setErrorMsg("");
    if (!email) {
      setErrorMsg("請輸入電子郵件");
      return;
    }

    try {
      const response = await fetch('https://localhost:7247/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        setStep(2); // 成功！進入輸入驗證碼畫面
      } else {
        const errorData = await response.text();
        setErrorMsg(errorData || "找不到此信箱或發送失敗");
      }
    } catch (error) {
      setErrorMsg("伺服器連線異常");
    }
  };

  // =========================================
  // Step 2：驗證 4 位數代碼
  // =========================================
  const handleCodeChange = (index, value) => {
    // 只允許輸入數字
    if (value && !/^[0-9]+$/.test(value)) return;

    const newCodeArray = [...codeArray];
    newCodeArray[index] = value;
    setCodeArray(newCodeArray);

    // 如果輸入了數字，自動跳到下一格
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerifyCode = async () => {
    setErrorMsg("");
    const fullCode = codeArray.join(''); // 把陣列 ['1','2','3','4'] 變成 "1234"
    if (fullCode.length !== 4) {
      setErrorMsg("請輸入完整的 4 位數驗證碼");
      return;
    }

    try {
      const response = await fetch('https://localhost:7247/api/user/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, code: fullCode })
      });

      if (response.ok) {
        setStep(3); // 驗證成功 -> 進入設定新密碼畫面
      } else {
        setErrorMsg("驗證碼錯誤或已過期");
      }
    } catch (error) {
      setErrorMsg("伺服器連線異常");
    }
  };

  // =========================================
  // Step 3：設定新密碼
  // =========================================
  const handleSavePassword = async () => {
    setErrorMsg("");
    if (!newPassword || newPassword !== confirmPassword) {
      setErrorMsg("密碼欄位空白或兩次輸入不一致");
      return;
    }

    const fullCode = codeArray.join('');

    try {
      const response = await fetch('https://localhost:7247/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          code: fullCode, 
          newPassword: newPassword 
        })
      });

      if (response.ok) {
        alert("密碼修改成功！請使用新密碼重新登入。");
        navigate('/login');
      } else {
        setErrorMsg("重設失敗，可能驗證已超時，請重新操作。");
      }
    } catch (error) {
      setErrorMsg("伺服器連線異常");
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
          <Link to="/" className="text-[30px] text-moBlack font-bold font-serif hover:text-moAzure transition-colors">Moody</Link>
        </div>

        <div className="bg-white border border-moBlack rounded-[2.5rem] p-12 flex flex-col items-center shadow-md w-[450px] min-h-[450px] transition-all duration-300">
          
          {/* 錯誤訊息共用顯示區塊 */}
          {errorMsg && <div className="text-red-500 text-sm font-bold mb-4 w-full text-center animate-fade-in">{errorMsg}</div>}

          {/* ===== Step 1：輸入 E-mail ===== */}
          {step === 1 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter Your E-mail Address<br/>To Receive Verification code</p>

              <div className="w-16 h-12 flex items-center justify-center mb-10">
                 <svg width="60" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 14 22 6" /></svg>
              </div>

              <div className="w-full flex flex-col gap-2 mb-4">
                <div className="flex items-center bg-moCream/30 border border-moBlack rounded-full px-4 py-3 focus-within:border-moAzure focus-within:ring-2 focus-within:ring-moAzure/20 transition-all">
                  <span className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3"></span>
                  <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700" 
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-xs font-bold text-gray-500 hover:text-moOlive transition-colors">其他方式？</a>
                </div>
              </div>

              <button onClick={handleSendEmail} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Send
              </button>
            </div>
          )}

          {/* ===== Step 2：輸入 4 位數驗證碼 ===== */}
          {step === 2 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Verify Your E-mail</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter The 4 Digital Code Sent to<br/><span className="font-bold text-moBrown">{email}</span></p>

              <div className="w-16 h-12 flex items-center justify-center mb-10">
                 <svg width="60" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 14 22 6" /></svg>
              </div>

              {/* 4 個驗證碼輸入框 */}
              <div className="flex gap-4 mb-4">
                {codeArray.map((digit, index) => (
                  <input 
                    key={index}
                    ref={inputRefs[index]}
                    type="text" 
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    // 如果按 Backspace 且當前為空，則退回上一格
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        inputRefs[index - 1].current.focus();
                      }
                    }}
                    className="w-12 h-14 border border-moBlack rounded-xl bg-[#D4E2A5]/30 text-center text-xl font-bold text-moBrown outline-none focus:border-moAzure focus:bg-white transition-colors"
                  />
                ))}
              </div>

              <button onClick={handleVerifyCode} className="mt-8 px-10 py-2 w-full max-w-[200px] rounded-lg border border-moBlack bg-[#D4E2A5] text-moBrown font-bold hover:bg-[#c2d38d] shadow-sm transition-colors">
                Verify
              </button>
            </div>
          )}

          {/* ===== Step 3：設定新密碼 ===== */}
          {step === 3 && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <h2 className="text-2xl font-serif text-moBrown mb-2">Create New Password</h2>
              <p className="text-sm text-gray-500 text-center mb-8">Please Enter New Password<br/>To Reset Account</p>

              <div className="w-16 h-12 flex items-center justify-center mb-6">
                 <svg width="50" viewBox="0 0 24 24" fill="none" stroke="#786C56" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>

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

export default ForgotPassword;