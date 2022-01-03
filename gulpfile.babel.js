import '@babel/register';
import { src, dest, watch } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';

function buildStyles() {
  const sass = gulpSass(dartSass);
  return src('./src/assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss())
    .pipe(dest('./src/assets/css'));
}

export default function () {
  watch('src/assets/scss/**/*.scss', buildStyles);
}

export { buildStyles };
