module.exports = {
  content: ['./src/views/**/*.{html,hbs,js}'],
  jit: true,
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
      padding: {
        0.5: '2px',
      },
      transitionProperty: { 'backdrop-filter': 'backdrop-filter' },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
  },
};
