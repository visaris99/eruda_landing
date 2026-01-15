/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 밝은 연두색 메인 컬러 (네이버 그린보다 조금 더 형광 느낌)
        'brand-main': '#8FD900', 
        // 그라데이션 및 호버(Hover) 효과를 위한 진한 녹색
        'brand-dark': '#62A600', 
        // 강조 포인트 (노란색)
        'brand-accent': '#FFD600',
      }
    },
  },
  plugins: [],
}
