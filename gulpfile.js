/*global -$ */
'use strict';
var json__pkg = require('./package.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
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
  gulp.watch('src/*.html', ['www']);
});



gulp.task('www', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest(dir__www))
    .pipe(reload());
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