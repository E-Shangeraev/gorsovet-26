let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  csso = require('gulp-csso'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  autoprefixer = require('gulp-autoprefixer'),
  nodemon = require('gulp-nodemon');

gulp.task('scss', function () {
  return gulp
    .src('public/scss/**/style.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 8 versions'],
      }),
    )
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function () {
  return gulp
    .src([
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/magnific-popup/dist/magnific-popup.css',
      'public/css/libs/bvi.min.css',
      'public/css/libs/eventCalendar.css',
      'public/css/libs/eventCalendar_theme_responsive.css',
    ])
    .pipe(concat('libs.css'))
    .pipe(csso())
    .pipe(gulp.dest('public/css/libs'));
});

gulp.task('images', function () {
  return gulp
    .src('public/img/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('public/img/'));
});

gulp.task('uploads', function () {
  return gulp
    .src('public/uploads/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('public/uploads/'));
});

gulp.task('libs', function () {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/slick-carousel/slick/slick.min.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
      'node_modules/inputmask/dist/inputmask.min.js',
      'public/js/libs/js.cookie.min.js',
      'public/js/libs/bvi-init.min.js',
      'public/js/libs/bvi.min.js',
      'public/js/libs/moment.js',
    ])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/libs'));
});

gulp.task('watch', function () {
  gulp.watch('public/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('views/**/*.hbs', browserSync.reload({ stream: true }));
  gulp.watch('public/js/*.js', browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function (cb) {
  browserSync.init({
    proxy: 'http://localhost:8089',
    open: true,
    port: 8090,
  });

  let started = false;

  return nodemon({
    script: 'index.js',
    ext: '.js .hbs',
    ignore: ['node_modules/**/*.js'],
    env: {
      NODE_ENV: 'development',
      PORT: 8089,
    },
  })
    .on('start', function () {
      if (!started) {
        started = true;
        cb();
      }
    })
    .on('restart', function () {
      browserSync.reload({ stream: true });
      console.log('Nodemon restarted!');
    });
});

gulp.task('default', gulp.parallel('scss', 'browser-sync', 'watch'));
