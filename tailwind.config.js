/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: c("paper"),
        surface: c("surface"),
        side: c("side"),
        line: c("line"),
        ink: c("ink"),
        muted: c("muted"),
        strong: c("strong"),
        accent: c("accent"),
        accentDark: c("accent-dark"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};