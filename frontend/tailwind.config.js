/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turf: {
          bg: '#FFFFFF',
          surface: '#F0FAF1',
          'surface-hover': '#E4F5E6',
          primary: '#16A34A',
          'primary-light': '#86EFAC',
          border: '#DCEEDD',
          text: '#111827',
          'text-muted': '#6B7280',
          'text-on-primary': '#FFFFFF',
        },
        primary: {
          50: '#F0FAF1',
          100: '#DCEEDD',
          200: '#86EFAC',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534'
        }
      },
      fontFamily: {
        sans: ['Inter', 'General Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
