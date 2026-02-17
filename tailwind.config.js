/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#19c3e6",
        "background-light": "#f6f8f8",
        "background-dark": "#111e21",
        "card-dark": "#111e21",
        "surface-dark": "#18282c",
        "neutral-dark": "#23363b",
      },
      fontFamily: {
        "display": ["Outfit", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
        "manrope": ["Manrope", "sans-serif"],
        "lora": ["Lora", "serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1.25rem",
        "full": "9999px",
      },
      boxShadow: {
        "glow": "0 0 20px -5px rgba(25, 195, 230, 0.5)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
