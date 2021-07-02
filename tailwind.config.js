module.exports = {
  mode: 'jit',
  purge: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // 'media' or 'class'
  theme: {
    fontFamily: {
      poppins: ['poppins'],
      'poppins-bold': ['poppins-bold'],
    },
    extend: {
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
