var gulp = require('gulp'),
  rimraf   = require('rimraf'),
  clean = require('gulp-clean'),
  gpconcat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  flatten = require('gulp-flatten'),
  jshint = require('gulp-jshint'),
  sequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  uglify = require('gulp-uglify');

var PATHS = {
  pages: [
    'src/*.html',
    'src/**/*.html'
  ],
  scripts: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-validation/dist/jquery.validate.js',
    'bower_components/jquery-validation/dist/additional-methods.js',
    'bower_components/foundation-sites/dist/foundation.js',
    'src/scripts/script.js'
  ],
  css: [
    'bower_components/foundation-sites/dist/foundation.css',
    'bower_components/foundation-icon-fonts/foundation-icons.css',
    'src/css/style.css'
  ],
  fonts: [
    'bower_components/**/dist/*.{eot,ttf,woff}',
    'bower_components/**/*.{eot,ttf,woff}'
  ],
  images: [
    'src/img/*.{jpg,png,gif,svg}'
  ]
};

// Reload the page
gulp.task('reload',function(cb) {
  reload();
  cb();
});

// clean dist folder
gulp.task('clean',function(done) {
  rimraf('dist', done);
});

// Create html pages in dist folder
gulp.task('pages',function() {
  gulp.src(PATHS.pages)
    .pipe(gulp.dest('dist'));
});


// concatenate and uglify all CSS of the page, both external and internal, in dist folder
gulp.task('styles',function () {
  gulp.src(PATHS.css)
    .pipe(cssnano())
    .pipe(gpconcat('styles.css'))
    .pipe(gulp.dest('dist'));
});

// concatenate and uglify all JavaScript of the page, both external and internal, in dist folder
gulp.task('scripts',function() {
  gulp.src(PATHS.scripts)
    .pipe(gpconcat('app.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Transfer all fonts to dist
gulp.task('fonts',function() {
  gulp.src(PATHS.fonts)
    .pipe(flatten())
    .pipe(gulp.dest('dist/'));
});

// Transfer all images to dist folder.
gulp.task('images', function() {
  gulp.src(PATHS.images)
    .pipe(gulp.dest('dist/img'));
});

// build before serving dist folder
gulp.task('build',function(done) {
  sequence('clean',['pages','styles','scripts','fonts','images'],done);
});

// serve all files inside dist folder.
gulp.task('serve',['build'],function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
});

// Watch all HTML, CSS, and JavaScript files.
gulp.task('watch',function() {
  var reset = ['pages','styles','scripts','fonts','images','reload'];
  gulp.watch(PATHS.pages, reset);
  gulp.watch(PATHS.css, reset);
  gulp.watch(PATHS.scripts, reset);
});

// use jshint after building the files
gulp.task('lint',function() {
  gulp.src(PATHS.pages)
    .pipe(jshint.extract('auto'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  gulp.src(PATHS.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default',['build','serve','watch']); // 'lint',