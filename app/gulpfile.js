var gulp = require('gulp'),
  clean = require('gulp-clean'),
  gpconcat = require('gulp-concat'),
  gprename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify');

var PATH = {
  scripts: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-validation/dist/jquery.validate.js',
    'bower_components/jquery-validation/dist/additional-methods.js',
    'bower_components/foundation-sites/dist/foundation.js',
    'script.js'
  ],
  css: [
    'bower_components/foundation-sites/dist/foundation.css',
    'bower_components/foundation-icon-fonts/foundation-icons.css',
    'style.css'
  ]
}

gulp.task('clean-scripts',function() {
  return gulp.src(["scripts/app.js","css/style.css"],
    {read : false})
    .pipe(clean());
});

// concatenate and uglify all CSS of the page, except internal
gulp.task('styles', ['clean-scripts'], function () {
  gulp.src(PATH.css)
    .pipe(cssnano())
    .pipe(gpconcat('style.css'))
    .pipe(gulp.dest('css'));
});

// concatenate and uglify all JavaScript of the page, except internal
gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(PATH.scripts)
    .pipe(gpconcat('app.js'))
    .pipe(gulp.dest('scripts'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts'));
});

// gulp.task('default',['styles','scripts']);
gulp.task('default',['styles','scripts']);



