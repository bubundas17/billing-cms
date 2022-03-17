'use strict';

const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
  return gulp
    .src(path.join(__dirname, './assets/scss/**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
}

exports.buildStyles = buildStyles;

exports.default = function () {
  gulp.watch(path.join(__dirname, './assets/scss/**/*.scss'), buildStyles);
};
