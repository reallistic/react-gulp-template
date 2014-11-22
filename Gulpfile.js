"use strict";
var gulp = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    stylish = require('jshint-stylish'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    react = require('gulp-react'),
    jshint = require('gulp-jshint'),
    cache = require('gulp-cache');
var DIR = __dirname,
    LESS_INDEX = './styles/index.less',
    scripts = './src/',
    build = './build/';
var paths = {
    css: ['./styles/**/*.less'],
    index_js: ['./src/main.jsx'],
    js: ['./src/**/*.jsx','./src/**/*.js'],
    img: ['./images/**/*'],
    b_css: build + 'css',
    b_js: build + 'js',
    b_img: build + 'images',
};

// Compiles LESS > CSS 
gulp.task('less', function(){
    return gulp.src(LESS_INDEX)
        .pipe(less())
        .on('error', gutil.log)
        .pipe(gulp.dest(paths.b_css))
        .pipe(connect.reload())
        ;
});

gulp.task('images', function() {
  return gulp.src(paths.img)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.b_img))
    .pipe(connect.reload())
    ;
});

gulp.task('compile', function(){
    return gulp.src(paths.js)
        .pipe(react({harmony:true}))
        .on('error', gutil.log)
        .pipe(gulp.dest(paths.b_js + '/src'));
});

gulp.task('lint', ['compile'], function() {
  return gulp.src(paths.b_js+'/src/**/*.js')
    .pipe(jshint({
      esnext:true, //ecmascript 6 support
      eqeqeq:true, //prefer === and !== over == and !=
      predef:[ "document", "require", "module", "window", "console", "setTimeout", "clearTimeout"], 
      globalstrict:true, //supress global strict warnings
      newcap: false //constructors need capitalized names
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('js', function() {
    // Browserify/bundle the JS.
    browserify(paths.index_js)
        .transform(reactify)
        .bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.b_js))
        .pipe(connect.reload())
        ;
});

// Rerun the task when a file changes
gulp.task('watch',function() {
    gulp.watch(paths.css, ['less']);
    gulp.watch(paths.js, ['compile', 'js']);
    gulp.watch(paths.img, ['images']);
});

gulp.task('webserver', ['watch'], function() {
  connect.server({
    port: 8000,
    host: "0.0.0.0",
    livereload: true
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['webserver', 'less', "js", 'images']);