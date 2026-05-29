// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: { extend: {} },
  plugins: [],
  success: {
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          500: "#22c55e",
          700: "#15803d",
  },
};
