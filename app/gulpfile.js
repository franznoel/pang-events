var gulp = require('gulp'),
  clean = require('gulp-clean'),
  gpconcat = require('gulp-concat'),
  gprename = require('gulp-rename'),
  uglify = require('gulp-uglify');


gulp.task('clean-scripts',function() {
  return gulp.src("app.js",{read : false})
    .pipe(clean());
});

gulp.task('scripts', ['clean-scripts'], function () {
  var sources = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-validation/dist/jquery.validate.js',
    'bower_components/jquery-validation/dist/additional-methods.js',
    './bower_components/foundation-sites/dist/foundation.js',
    'script.js'
  ];

  gulp.src(sources) //,{read:false}
    .pipe(gpconcat('app.js'))
    .pipe(gulp.dest('scripts'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts'));
});

gulp.task('default',['scripts']);



