/*global -$ */
'use strict';

var json__pkg = require('./package.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var dir__public = 'public';
var dir__src_html = 'views';
var dir__src_css = 'css';
var dir__dist = 'dist';
var dir__www = 'www';

var cli_argv = require('minimist')(process.argv.slice(2));
var minify = typeof cli_argv.minify != 'undefined';

var server;

console.log(dir__src_html+'/**/*.html')
console.log(dir__src_css+'/**/*')


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
  gulp.watch(dir__src_html+'/**/*.html', ['www']);
  gulp.watch(dir__src_css+'/**/*', ['css']);
  gulp.watch(dir__public+'/**/*', ['public']);
});

gulp.task('www', ['css','public'], function () {
  return gulp.src(dir__src_html+'/**/*.html')
    .pipe(gulp.dest(dir__www))
    .pipe(reload());
});

gulp.task('css', function () {
  return gulp.src(dir__src_css+'/*.scss')
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
    console.log(dir__src_css)
});

// process static files
gulp.task('public', function() {
  return gulp.src(dir__public+'/**/*')
	  .pipe(gulp.dest(dir__www));
});

gulp.task('default', function () {
  gulp.start('serve');
  console.log('minify = ' + minify)
});

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return $.util.noop();
}