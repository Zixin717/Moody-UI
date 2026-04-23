// src/Icon.jsx
import React from 'react';

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    // 頂邊與側邊導覽
    search: <><circle cx="11" cy="11" r="8" fill="none" stroke={color} strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    diary: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/></>,
    sparkle: <><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5Z" fill={color}/></>,
    gauge: <><path d="M3 15a9 9 0 0 1 18 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15V8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="15" r="2" fill={color}/></>,
    chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    toggle: <><rect x="3" y="8" width="18" height="8" rx="4" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="8" cy="12" r="2.5" fill={color}/></>,
    
    // 星系與卡片
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke={color} strokeWidth="1.5"/>,
    chevronDown: <polyline points="6 9 12 15 18 9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    arrowUpRight: <><line x1="7" y1="17" x2="17" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><polyline points="7 7 17 7 17 17" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,

    // Habit 與其他
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    check: <polyline points="20 6 9 17 4 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    square: <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke={color} strokeWidth="1.5"/>,
    circleOutline: <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,

    // 音樂播放器
    play: <polygon points="5 3 19 12 5 21 5 3" fill={color} />,
    pause: <><rect x="6" y="4" width="4" height="16" fill={color}/><rect x="14" y="4" width="4" height="16" fill={color}/></>,
    skipBack: <><polygon points="19 20 9 12 19 4 19 20" fill={color}/><line x1="5" y1="19" x2="5" y2="5" stroke={color} strokeWidth="2"/></>,
    skipForward: <><polygon points="5 4 15 12 5 20 5 4" fill={color}/><line x1="19" y1="5" x2="19" y2="19" stroke={color} strokeWidth="2"/></>,
    musicNote: <><path d="M9 18V5l12-2v13" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="18" cy="16" r="3" fill="none" stroke={color} strokeWidth="1.5"/></>,

    // Page 2 個人檔案圖示
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="3 7 12 13 21 7" fill="none" stroke={color} strokeWidth="1.5"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/></>,
    globe: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><line x1="2" y1="12" x2="22" y2="12" fill="none" stroke={color} strokeWidth="1.5"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke={color} strokeWidth="1.5"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke={color} strokeWidth="1.5"/>,
    triangle: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>,
    chevronDown: <polyline points="6 9 12 15 18 9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronUp: <polyline points="18 15 12 9 6 15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,



  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {icons[name] ?? null}
    </svg>
  );
};

export default Icon;