var gulp = require('gulp'),
  clean = require('gulp-clean'),
  gpconcat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  lintspaces = require("gulp-lintspaces"),
  uglify = require('gulp-uglify');

var PATH = {
  scripts: [
    'node_modules/jquery/dist/jquery.js',
    'bower_components/jquery-validation/dist/jquery.validate.js',
    'bower_components/jquery-validation/dist/additional-methods.js',
    'bower_components/foundation-sites/dist/foundation.js',
    'scripts/script.js'
  ],
  css: [
    'bower_components/foundation-sites/dist/foundation.css',
    'bower_components/foundation-icon-fonts/foundation-icons.css',
    'css/style.css'
  ],
  fonts: [
    'bower_components/foundation-icon-fonts/foundation-icons.eot',
    'bower_components/foundation-icon-fonts/foundation-icons.svg',
    'bower_components/foundation-icon-fonts/foundation-icons.ttf',
    'bower_components/foundation-icon-fonts/foundation-icons.woff'
  ]
};

gulp.task('clean-scripts',function() {
  return gulp.src(["app.js","styles.css"],
    {read : false})
    .pipe(clean());
});

// use jshint
gulp.task('lint',function() {
  gulp.src('*.html')
    .pipe(jshint.extract('auto'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  gulp.src(PATH.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// move fonts
gulp.task('fonts', function() {
    return gulp.src(PATH.fonts)
      .pipe(gulp.dest(''));
});

// concatenate and uglify all CSS of the page, except internal CSS
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
gulp.task('default',['lint','fonts','styles','scripts']);

