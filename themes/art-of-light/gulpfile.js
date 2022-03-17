'use strict';

const { src, watch, dest } = require('gulp');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

function buildStyles() {
  return src([path.join(__dirname, './assets/scss/**/*.scss'), '!**/_*/**'])
    // .pipe(sass().on('error', sass.logError))
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(dest(path.join(__dirname, './public/assets/css')));
}

function buildScripts() {
  return src(path.join(__dirname, './assets/**/*.js'))
    // .pipe(babel({
    //   presets: ['@babel/env', { targets: 'last 2 versions, ie >= 10' }],
    //   plugins: [
    //     '@babel/plugin-transform-destructuring',
    //     '@babel/plugin-proposal-object-rest-spread',
    //     '@babel/plugin-transform-template-literals'
    //   ],
    // }))
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(dest(path.join(__dirname, './public/assets/js')));
}

exports.buildStyles = buildStyles;

exports.default = function () {
  buildScripts();
  buildStyles();
  // watch(path.join(__dirname, './assets/**/*.scss'), buildStyles);
  // watch(path.join(__dirname, './assets/**/*.js'), buildScripts);
};
