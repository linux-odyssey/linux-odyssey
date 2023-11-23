/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#282A33',
          secondary: '#131313',
          disabled: '#454552',
          DEFAULT: '#000000',
        },
        text: {
          primary: '#00FF00',
          secondary: '#ADADB5',
          tertiary: '#4A4B63',
          disabled: '#6A6B8C',
          DEFAULT: '#FFFFFF',
        },
        border: {
          DEFAULT: '#4A4B63',
        },
        error: {
          DEFAULT: '#FF0000',
        },
      },
    },
  },
  plugins: [],
}
