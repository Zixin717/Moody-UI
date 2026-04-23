/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 全局色票
      colors: {
        moCream: '#FBF9EA',  // 奶油白 -> 卡片底色
        moTeal: '#AAD0C6',   // 淺灰藍 -> 裝飾、小星球
        moOlive: '#A1A34E',  // 橄欖綠 -> 主要按鈕、進度條
        moBrown: '#786C56',  // 深褐咖 -> 主要文字、標題 -> 增加量感
        moBlack: '#000000',  // 純黑   -> 強調邊框      -> 增加對比
        moAzure: '#007FFF',  // 天空藍 -> 系統選取用色   -> 功能明確
        moCitron: '#D4E2A5', // 淺綠   -> Moody 綠 -> Logo、按鈕 Hover -> 品牌識別
        // moLemon: '#FAFFB8',  // 暖黃色 -> 搜尋下拉 Hover

      }
    },
  },
  plugins: [],
}