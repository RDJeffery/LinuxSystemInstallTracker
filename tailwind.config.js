/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neo-bg': '#1a1b26',
        'neo-bg-dark': '#16161e',
        'neo-bg-highlight': '#292e42',
        'neo-red': '#f7768e',
        'neo-red-dark': '#db4b4b',
        'neo-text': '#a9b1d6',
        'neo-text-dark': '#787c99',
        'neo-border': '#15161e',
        'neo-selection': '#28292f',
        'neo-highlight': '#2d2f3a',
      },
      boxShadow: {
        'neo': '0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};