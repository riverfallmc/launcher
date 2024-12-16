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
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        tertiary: 'hsl(var(--tertiary))',
        accent: 'hsl(var(--accent))',
      },
    },
  },
  plugins: [textshadow],
};