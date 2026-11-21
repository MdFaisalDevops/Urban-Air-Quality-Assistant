/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10B981',       // 0-50
          satisfactory: '#84CC16', // 51-100
          moderate: '#F59E0B',   // 101-200
          poor: '#F97316',       // 201-300
          veryPoor: '#EF4444',   // 301-400
          severe: '#7F1D1D',     // 401-500
          hazardous: '#4A044E'   // 500+
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

