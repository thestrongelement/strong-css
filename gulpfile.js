/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var minifyHTML = require('gulp-minify-html');
var del = require('del');

var json__pkg = require('./package.json');
var cli_argv = require('minimist')(process.argv.slice(2));
var minify = typeof cli_argv.minify != 'undefined';

var dir__public = 'public';
var dir__src_html = 'views';
var dir__src_css = 'css';
var dir__dist = 'dist';
var dir__www = 'www';
var dir__build = dir__www; //default

var server;

gulp.task('serve', ['www'], function () {
  server = browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [dir__www],
      index: 'index.html',
      routes: {
        '/bower_components': 'bower_components',
        '/css': 'css'
      }
    }
  });
  gulp.watch(dir__src_html+'/**/*.html', ['html']);
  gulp.watch(dir__src_css+'/**/*', ['css']);
  gulp.watch(dir__public+'/**/*', ['public']);
});


gulp.task('html', function () {
  return gulp.src([dir__src_html+'/**/*.html','!'+dir__src_html+'/**/_*'])
    .pipe($.ejs({
      app: json__pkg
    }).on('error', $.util.log))
    .pipe(minifyHTML({
      conditionals: true
    }))
    .pipe(gulp.dest(dir__www))
    .pipe(reload());
});


// process SASS
gulp.task('css', function () {
  return gulp.src([dir__src_css+'/*.scss', '!'+dir__src_css+'/_debug.scss'])
    .pipe($.sass({
      outputStyle: (minify?'compressed':'expanded'),
      precision: 10,
      includePaths: ['.'],
      errLogToConsole: true
    })
    .on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version', 'ie >= 10', 'and_chr >= 2.3']})
    ]))
    .pipe($.if(minify, $.cssnano()))
    .pipe(gulp.dest(dir__build + '/css'))
});

// process static files
gulp.task('public', function() {
  return gulp.src(dir__public+'/**/*')
	  .pipe(gulp.dest(dir__www));
});

//build
gulp.task('www', $.sequence('clean',['css','public'],'html','dist'));

gulp.task('dist', function () {
  return gulp.src([dir__src_css+'/*.scss', '!'+dir__src_css+'/_debug.scss'])
    .pipe($.sass({
      outputStyle: ('compressed'),
      precision: 10,
      includePaths: ['.'],
      errLogToConsole: true
    })
    .on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version', 'ie >= 10', 'and_chr >= 2.3']})
    ]))
    .pipe($.cssnano())
    .pipe(gulp.dest(dir__dist + '/css'))
});

gulp.task('default', function () {
  gulp.start('serve');
});

gulp.task('clean', del.bind(null, ['.tmp', dir__www, dir__dist]));

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return $.util.noop();
}
