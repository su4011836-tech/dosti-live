/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a78bfa', // violet-400
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#6d28d9', // violet-700
        },
        secondary: {
          light: '#f472b6', // pink-400
          DEFAULT: '#ec4899', // pink-500
          dark: '#be185d', // pink-700
        },
        dark: {
          light: '#334155', // slate-700
          DEFAULT: '#1e293b', // slate-800
          darker: '#0f172a', // slate-900
        }
      }
    },
  },
  plugins: [],
}
