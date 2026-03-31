/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--color-primary)",
                "primary-foreground": "var(--primary-foreground)",
                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-outfit)', 'sans-serif'],
            }
        },
	},
	plugins: [
        require('@tailwindcss/typography'),
    ],
}
