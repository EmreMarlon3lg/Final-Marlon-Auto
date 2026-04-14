// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette (Marlon Auto)
        // (Keeping the "bmw-*" keys because components already use them.)
        'bmw-dark': '#0b1220',
        'bmw-blue': '#1c69d4',
        'bmw-blue-dark': '#0a4a9e',
        'bmw-gray': '#f5f7fb',
        'bmw-gray-dark': '#64748b',
        'bmw-light': '#ffffff',

        // Semantic aliases used in some components
        'brand-dark': '#0b1220',
        'brand-blue': '#1c69d4',
        'brand-blue-dark': '#0a4a9e',
        'brand-gray': '#e2e8f0',
      },
      fontFamily: {
        // BMW използва шрифт близък до 'BMWTypeNext', но ще използваме стандартни
        'sans': ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'bmw-title': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }], // Главно заглавие
        'bmw-subtitle': ['2rem', { lineHeight: '1.3', fontWeight: '600' }], // Подзаглавие
      }
    },
  },
  plugins: [],
}