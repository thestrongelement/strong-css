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
      index: 'grid.html',
      routes: {
        '/bower_components': 'bower_components',
        '/css': 'css'
      }
    }
  });
  gulp.watch(dir__src_html+'/**/*.html', ['html']);
  gulp.watch(dir__src_css+'/**/*.scss', ['css']);
  gulp.watch(dir__src_css+'/**/*.gss', ['gss']);
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

gulp.task('css', function () {
  return gulp.src(dir__src_css+'/*.scss')
    .pipe(minify?$.util.noop():$.sourcemaps.init())
    .pipe($.sass({
      outputStyle: (minify?'compressed':'nested'), // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      //onError: console.error.bind(console, 'Sass error:'),
      errLogToConsole: true
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(minify?$.util.noop():$.sourcemaps.write())
    .pipe(gulp.dest(dir__build + '/css'))
    .pipe(reload());
});

// process gss files
gulp.task('gss', function() {
  return gulp.src(dir__src_css+'/*.gss')
	  .pipe(gulp.dest(dir__www))
    .pipe(reload());
});

// process static files
gulp.task('public', function() {
  return gulp.src(dir__public+'/**/*')
	  .pipe(gulp.dest(dir__www));
});

//build
gulp.task('www', $.sequence('clean',['css','gss','public'],'html','dist'));

gulp.task('dist', function () {
  return gulp.src(dir__src_css+'/*.scss')
    .pipe($.sass({
      outputStyle: ('compressed'), // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(gulp.dest(dir__dist + '/css'))
});

gulp.task('default', function () {
  gulp.start('serve');
});

gulp.task('clean', del.bind(null, ['.tmp', dir__www]));

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return $.util.noop();
}
