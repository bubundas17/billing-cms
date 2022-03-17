'use strict';

const { src, watch, dest } = require('gulp');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');

function buildStyles() {
  return src(path.join(__dirname, './assets/**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./public/css'));
}

function buildScripts() {
  return src(path.join(__dirname, './assets/**/*.js'))
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest('./public'));
}

exports.buildStyles = buildStyles;

exports.default = function () {
  buildStyles();
  buildScripts();
  watch(path.join(__dirname, './assets/**/*.scss'), buildStyles);
  watch(path.join(__dirname, './assets/**/*.js'), buildScripts);
};
