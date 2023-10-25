/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: {
            DEFAULT: '#282A33',
          },
          secondary: {
            DEFAULT: '#131313',
          },
          DEFAULT: {
            DEFAULT: '#000000',
          },
        },
        text: {
          primary: {
            DEFAULT: '#80FF50',
          },
          secondary: {
            DEFAULT: '#ADADB5',
          },
          tertiary: {
            DEFAULT: '#4A4B63',
          },
          DEFAULT: {
            DEFAULT: '#FFFFFF',
          },
        },
        border: {
          DEFAULT: {
            DEFAULT: '#526B4E',
          },
        },
        error: {
          DEFAULT: {
            DEFAULT: '#FF0000',
          },
        },
      },
    },
  },
  plugins: [],
}
