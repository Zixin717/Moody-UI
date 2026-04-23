import React from 'react';

// Solo Chunk -> 太陽系 -> 作用：展示房間內成員的互動關係
const SolarSystemRoom = () => {
  return (
    // 1. 最外層太空背景 -> 設定攝影機的透視距離 (perspective)
    <div className="w-full h-full
                    rounded-3xl 
                    bg-[#FDFBF7] flex items-center justify-center overflow-hidden [perspective:1000px]">
      
      {/* 2. 太陽系轉盤 -> 整個往後倒 60 度，產生 3D 橢圓感 */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center [transform:rotateX(45deg)] [transform-style:preserve-3d]">
        
        {/* 主星 (房間本體) */}
        {/* 主星加上反向旋轉 rotateX(-60deg)，讓它像立牌一樣站直面向使用者 */}
        <div className="absolute w-28 h-28 bg-gradient-to-br from-mist-700 to-olive-500 rounded-full shadow-[0_0_80px_rgba(234,179,8,0.5)] flex items-center justify-center z-20 [transform:rotateX(-60deg)]">
          <span className="text-white font-bold tracking-wider drop-shadow-md">主星房間</span>
        </div>

        {/* 第一條軌道與成員 (小行星 A) */}
        <div className="absolute w-[240px] h-[240px] border border-slate-700 rounded-full animate-spin [animation-duration:8s]">
          <div className="absolute -top-3 left-1/2 w-6 h-6 bg-olive-700 rounded-full shadow-[0_0_20px_rgba(96,165,250,0.8)]"></div>
        </div>

        {/* 第二條軌道與成員 (小行星 B) */}
        <div className="absolute w-[360px] h-[360px] border border-slate-700/60 rounded-full animate-spin [animation-duration:14s]">
          <div className="absolute top-12 left-12 w-8 h-8 bg-olive-500 rounded-full shadow-[0_0_20px_rgba(244,114,182,0.8)]"></div>
        </div>

        {/* 第三條軌道與成員 (小行星 C) */}
        <div className="absolute w-[480px] h-[480px] border border-slate-700/30 rounded-full animate-spin [animation-duration:20s] direction-reverse">
          <div className="absolute bottom-16 right-16 w-5 h-5 bg-olive-300 rounded-full shadow-[0_0_20px_rgba(96,165,250,0.8)]"></div>
        </div>

        {/* 第四條軌道與成員 (小行星 D) */}
        <div className="absolute w-[1000px] h-[1000px] border border-slate-700/30 rounded-full animate-spin [animation-duration:20s] direction-reverse">
          <div className="absolute bottom-16 right-16 w-5 h-5 bg-olive-400 rounded-full shadow-[0_0_20px_rgba(96,165,250,0.8)]"></div>
        </div>

        {/* 第N條軌道與成員 (小行星 N) */}
        <div className="absolute w-[1500px] h-[1480px] border border-slate-700/30 rounded-full animate-spin [animation-duration:20s] direction-reverse">
          <div className="absolute bottom-16 right-16 w-5 h-5 bg-olive-400 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.8)]"></div>
        </div>

      </div>
    </div>
  );
};

export default SolarSystemRoom;