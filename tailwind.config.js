// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} \*/
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      poppins: ['var(--font-poppins)', ...fontFamily.sans],
    },
    extend: {
      extend: {
        screens: {
          mobile: { max: '639px' },
        },
      },
      spacing: {
        header: '100px',
      },
      width: {
        sidebar: '250px',
      },
      borderRadius: {
        modal: '20px',
        'link-card': '15px',
        button: '10px',
        tag: '5px',
      },
      colors: {
        black: '#1B1C2C',
        white: '#FFFFFF',
        primary: '#CBEFB6',
        secondary: '#5B5F97',
        discord: '#5865f2',
        google: '#DB4437',
        github: '#333333',
        gray: {
          100: '#F3F4F6',
          400: '#9CA3AF',
          900: '#343654',
        },
        success: {
          100: '#98C6AC',
          400: '#58BA82',
          900: '#40875F',
        },
        danger: {
          100: '#F07C7A',
          400: '#A22522',
          900: '#701918',
        },
        warning: {
          100: '#FFB24D',
          400: '#FE9000',
          900: '#CC7400',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            strong: {
              fontFamily: theme('fontFamily.poppins-bold'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('prettier-plugin-tailwindcss')],
};
