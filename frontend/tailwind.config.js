/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        DEFAULT: {
          '::-webkit-scrollbar': {
            width: '4px',
          },
          '::-webkit-scrollbar-thumb': {
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-track': {
          },
        },
      },
    },
  },
  plugins: [],
}