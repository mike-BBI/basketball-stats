// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
  "bg-green-700", "bg-green-500", "bg-green-100",
  "bg-red-700", "bg-red-500", "bg-red-100",
  "bg-gray-100",
  "text-white", "text-gray-700", "text-gray-500", "text-green-800", "text-red-800"
],
  theme: {
    extend: {},
  },
  plugins: [],
}
