module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["aqua"],
  },
};
