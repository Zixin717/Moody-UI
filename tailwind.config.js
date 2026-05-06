/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '.theme-dark'], // 告訴 Tailwind，看到 body 有這個 class 就啟動深色模式。
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 全局色票：Tailwind 會動態讀取 CSS 變數
      colors: {
        moCream: 'var(--mo-cream)',      // 卡片底色
        moCream80: 'var(--mo-cream-80)',


        moTeal: 'var(--mo-teal)',   // 淺灰藍 -> 裝飾、小星球
        moOlive: 'var(--mo-olive)', // 橄欖綠 -> 主要按鈕、進度條

        moBrown: 'var(--mo-brown)', // 深褐咖 -> 主要文字、標題 -> 增加量感
        moBrown80: 'var(--mo-brown-80)', // 80% 淺色字色

        moBlack: 'var(--mo-black)', // 純黑   -> 強調邊框      -> 增加對比
        moAzure: 'var(--mo-azure)', // 天空藍 -> 系統選取用色   -> 功能明確
        moCitron: 'var(--mo-citron)', // 淺綠   -> Moody 綠 -> Logo、按鈕 Hover -> 品牌識別

        moTopbar: 'var(--color-topbar)', // 頂部工具列背景色
      }
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       // 全局色票
//       colors: {
//         moCream: '#FBF9EA',  // 奶油白 -> 卡片底色
//         moTeal: '#AAD0C6',   // 淺灰藍 -> 裝飾、小星球
//         moOlive: '#A1A34E',  // 橄欖綠 -> 主要按鈕、進度條
//         moBrown: '#786C56',  // 深褐咖 -> 主要文字、標題 -> 增加量感
//         moBlack: '#000000',  // 純黑   -> 強調邊框      -> 增加對比
//         moAzure: '#007FFF',  // 天空藍 -> 系統選取用色   -> 功能明確
//         moCitron: '#D4E2A5', // 淺綠   -> Moody 綠 -> Logo、按鈕 Hover -> 品牌識別
//       }
//     },
//   },
//   plugins: [],
// }