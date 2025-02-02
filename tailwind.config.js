import textshadow from "tailwindcss-textshadow";
import tailwindanimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["selector", '[data-theme="dark"]'],
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
				accent: 'hsl(var(--accent))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [textshadow, tailwindanimate],
};