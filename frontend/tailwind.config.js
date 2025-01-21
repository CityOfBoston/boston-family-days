/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Lora', 'serif'],
      heading: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        charles_blue: '#091F2F',
        optimistic_blue: "#1871BD",
        background_grey: "#F2F2F2",
        text_grey: "#757575",
        error_red: "#AA241D",
        required_red: "#AA241D"
      },

      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      fontSize: {
        base: '16px',
        lg: '18px',
        xl: '24px',
      },
    },
  },
  plugins: [],
}