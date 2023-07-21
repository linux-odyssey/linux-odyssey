/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#282A33',
          secondary: '#131313',
          DEFAULT: '#010103',
        },
        text: {
          primary: '#39FF14',
          secondary: '#ADADB5',
          line: '#4A4B63',
          DEFAULT: '#FFFFFF',
        },
        disabled: {
          background: '#454552',
          text: '#6A6B8C',
        },
        border: {
          DEFAULT: '#526B4E',
        },
      },
    },
  },
  plugins: [],
}
