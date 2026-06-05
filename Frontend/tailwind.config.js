/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        titanes: {
          red: '#E50914',
          'red-glow': '#FF2E3B',
          dark: '#080808',
          'dark-card': 'rgba(20, 20, 20, 0.75)',
          'dark-border': 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(229, 9, 20, 0.35)',
        'red-glow-lg': '0 0 35px rgba(255, 46, 59, 0.55)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
