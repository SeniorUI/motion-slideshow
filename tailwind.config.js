import defaultConfig from "tailwindcss/defaultConfig";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,html}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        text: ["Syne", defaultConfig.theme.fontFamily],
      },
      spacing: {
        150: '37.5rem',
        200: "50rem",
      },
    },
  },
  plugins: [],
};
