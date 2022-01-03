const purgecss = require('@fullhuman/postcss-purgecss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const plugins = {
  plugins: [
    purgecss({
      content: ['./src/**/*.{html,hbs,js}'],
    }),
    autoprefixer(),
    cssnano({
      preset: [
        'cssnano-preset-advanced',
        { discardComments: { removeAll: true } },
      ],
    }),
  ],
};

export default plugins;
