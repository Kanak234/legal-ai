/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bccadc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0b1b2b',
        },
        gold: {
          400: '#f6ad55',
          500: '#dd6b20',
          600: '#c05621',
        }
      },
    },
  },
  plugins: [],
};
