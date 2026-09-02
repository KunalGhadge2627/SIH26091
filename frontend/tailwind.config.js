/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a'
        },
        success: {
          50: '#f0fdf4',
          500: '#16a34a',
          600: '#15803d'
        },
        amber: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706'
        }
      }
    },
  },
  plugins: [],
}
