/*global -$ */
'use strict';
var json__pkg = require('./package.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var dir__src = 'src';
var dir__dist = 'dist';
var dir__www = 'www';

var server;


gulp.task('serve', ['www'], function () {
  server = browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [dir__www],
      routes: {
        '/bower_components': 'bower_components',
        '/css': 'css'
      }
    }
  });
  gulp.watch(dir__src+'/**/*.html', ['www']);
});

gulp.task('www', function () {
  return gulp.src(dir__src+'/**/*.html')
    .pipe(gulp.dest(dir__www))
    .pipe(reload());
});

gulp.task('css', function () {
  return gulp.src('src/css/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(dir__www + '/css'))
    .pipe(reload());
});

// process static files
gulp.task('public', function() {
  return gulp.src('public/**/*')
	  .pipe(gulp.dest(dir__www));
});

gulp.task('default', function () {
  gulp.start('serve');
});

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return $.util.noop();
}