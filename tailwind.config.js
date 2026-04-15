/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#1e1e1e',
          panel: '#2d2d2d',
          accent: '#3b82f6',
          border: '#3f3f3f',
        }
      }
    },
  },
  plugins: [],
}
