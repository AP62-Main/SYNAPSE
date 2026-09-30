/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chatgpt: {
          dark: '#0d0d0d',
          darkSurface: '#171717',
          darkSurfaceHover: '#212121',
          darkBorder: '#2f2f2f',
          darkText: '#ececec',
          darkMuted: '#9e9e9e',
          light: '#ffffff',
          lightSurface: '#f9f9f9',
          lightSurfaceHover: '#f0f0f0',
          lightBorder: '#e5e5e5',
          lightText: '#0d0d0d',
          lightMuted: '#666666',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
