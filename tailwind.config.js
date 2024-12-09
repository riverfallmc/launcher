import textshadow from "tailwindcss-textshadow";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "montserrat-alternates": ["Montserrat Alternates", "sans-serif"]
      },
      boxShadow: {
        "black-extended": "0 4px 4px 0 rgba(0, 0, 0, 0.25);"
      },
      backgroundImage: {
        'text-gradient': 'linear-gradient(to bottom, #FF6A00, #FFAE00)',
      },
      backgroundClip: {
        text: 'text',
      },
      textFillColor: {
        transparent: 'transparent',
      }
    },
  },
  plugins: [textshadow],
};