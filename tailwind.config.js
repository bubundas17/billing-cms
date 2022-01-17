module.exports = {
  content: ['**/*.hbs'],
  // content: [],
  theme: {
    extend: {
      fontSize: {
        tiny: ['.9375rem', '1.33rem'],
        '1.75xl': '1.75rem',
        xsm: ['.75rem', '1rem'],
        xxsm: ['.625rem', '.8125rem'],
      },
      height: {
        15: '3.75rem',
        25: '6.25rem',
        57: '14.375rem',
      },
      width: {
        15: '3.75rem',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
