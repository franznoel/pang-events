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
    'scripts/script.js'
  ],
  css: [
    'bower_components/foundation-sites/dist/foundation.css',
    'bower_components/foundation-icon-fonts/foundation-icons.css',
    'css/style.css'
  ]
}

gulp.task('clean-scripts',function() {
  return gulp.src(["app.js","styles.css"],
    {read : false})
    .pipe(clean());
});

// concatenate and uglify all CSS of the page, except internal
gulp.task('styles', ['clean-scripts'], function () {
  gulp.src(PATH.css)
    .pipe(cssnano())
    .pipe(gpconcat('styles.css'))
    .pipe(gulp.dest(''));
});

// concatenate and uglify all JavaScript of the page, except internal
gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(PATH.scripts)
    .pipe(gpconcat('app.js'))
    .pipe(gulp.dest(''))
    .pipe(uglify())
    .pipe(gulp.dest(''));
});

// gulp.task('default',['styles','scripts']);
gulp.task('default',['styles','scripts']);



