/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      backgroundColor: {
        light: '#fde047',
        dark: '#000',
      },
      colors: {
        light: '#fde047',
        dark: '#000',
      },
    },
  },
  plugins: [],
};
