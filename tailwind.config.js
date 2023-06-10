/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      white: "#fafafa",
      black: "#222",
      primary: "#69996f",
      "primary-99": "#69996f99",
      secondary: "#10353e",
      error: "rgb(248, 60, 60)",
    },
    minWidth: {
      10: "40px",
    },
    minHeight: {
      10: "40px",
    },
  },
  plugins: [],
};
