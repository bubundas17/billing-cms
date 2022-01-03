const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: ['./**/*.hbs'],
    }),
    require('autoprefixer'),
    require('postcss-nested'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
