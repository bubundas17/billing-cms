module.exports = {
  content: ['./src/views/**/*.{html,hbs,js}', './src/helpers/**/*.js'],
  jit: true,
  theme: {
    extend: {
      colors: {
        bluesh: '#F5F6FA',
      },
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
        162.5: '40.625rem',
      },
      width: {
        15: '3.75rem',
        125: '31.25rem',
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
