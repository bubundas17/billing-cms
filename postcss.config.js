import purgecss from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
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
