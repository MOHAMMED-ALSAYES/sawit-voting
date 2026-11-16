/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cdc: {
          cyan: '#0284C7',
          'cyan-hover': '#0369A1',
          'cyan-light': '#E0F2FE',
          orange: '#EA580C',
          'orange-hover': '#C2410C',
          'orange-light': '#FFEDD5',
        },
        ust: {
          navy: '#0F172A',
          'navy-light': '#1E293B',
          blue: '#1E3A8A',
          green: '#15803D',
          gold: '#D97706',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

