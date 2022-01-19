import purgecss from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    // purgecss({
    //   content: ['./src/views/**/*.{html,hbs,js}'],
    // }),
    require('tailwindcss'),
    // autoprefixer(),
    // cssnano({
    //   preset: [
    //     'cssnano-preset-advanced',
    //     { discardComments: { removeAll: true } },
    //   ],
    // }),
  ],
};
