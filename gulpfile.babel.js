import { src, dest } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';

function buildStyles() {
  const sass = gulpSass(dartSass);
  return (
    src('./src/assets/scss/**/*.scss')
      .pipe(
        postcss([
          require('tailwindcss'),
          require('autoprefixer'),
          // require('@tailwindcss/forms'),
          // require('@tailwindcss/line-clamp'),
          // require('@tailwindcss/typography')
        ]),
      )
      .pipe(sass().on('error', sass.logError))
      // .pipe(postcss())
      .pipe(dest('./src/assets/css'))
  );
}

export { buildStyles };
