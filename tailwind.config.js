/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        alfa: ['AlfaSlabOne', 'sans-serif'],
        elsie: ['Elsie', 'sans-serif'],
        instrument: ['InstrumentSerif', 'serif'],
      },
      colors: {
        light: '#fde047',
        dark: '#000',
      },
    },
  },
  plugins: [],
};
