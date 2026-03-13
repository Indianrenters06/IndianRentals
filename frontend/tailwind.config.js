/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "var(--font-manrope)",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif"
                ],
                manrope: ["var(--font-manrope)"],
                apple: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "San Francisco",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif"
                ],
                poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
            },
            colors: {
                'grey-white': 'hsla(0, 0%, 100%, 1)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '3rem',
            },
        },
    },
    plugins: [],
}
