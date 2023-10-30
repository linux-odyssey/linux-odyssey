/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#282A33',
          secondary: '#131313',
          DEFAULT: '#000000',
        },
        text: {
          primary: '#00FF00',
          secondary: '#ADADB5',
          tertiary: '#4A4B63',
          DEFAULT: '#FFFFFF',
        },
        disabled: {
          background: '#454552',
          text: '#6A6B8C',
        },
        border: {
          DEFAULT: '#526B4E',
        },
        error: {
          DEFAULT: '#FF0000',
        },
      },
    },
  },
  plugins: [],
}
