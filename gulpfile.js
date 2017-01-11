var gulp = require('gulp'),
sass = require('gulp-sass'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),
browserSync = require('browser-sync'),
autoprefixer = require('gulp-autoprefixer'),
sourcemaps = require('gulp-sourcemaps'),
spritesmith = require('gulp.spritesmith'),
gulpIf = require('gulp-if');

function customPlumber(errTitle) {
  return plumber({
      errorHandler: notify.onError({
      // Customizing Error Title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass"
    })
  });
}

gulp.task('sass', function() {
  // Add styles.scss into gulp.src
  return gulp.src('app/scss/**/*.scss')
  // Check for errors in all plugins
  .pipe(customPlumber('Error Running SASS'))
  // Initialize sourcemaps
  .pipe(sourcemaps.init())
  .pipe(sass({
      outputStyle: 'expanded',
      precision: 2
    }))
  .pipe(autoprefixer())
  // Writing sourcemaps
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('app/css'))
  // Reload file after file tasks are done
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('sprites', function() {
  gulp.src('app/images/sprites/**/*')
  .pipe(spritesmith({
    cssName: '_sprites.scss',
    imgName: 'sprites.png',
    imgPath: '../images/sprites.png',
    retinaSrcFilter: 'app/images/sprites/*@2x.png',
    retinaImgName: 'sprites@2x.png',
    retinaImgPath: '../images/sprites@2x.png'
  }))
  // Destination
  .pipe(gulpIf('*.png', gulp.dest('app/images')))
  .pipe(gulpIf('*.scss', gulp.dest('app/scss')))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Reloads the browser when a JS file is saved
  gulp.watch('app/js/**/*.js', browserSync.reload);
  // Reloads the browser when an HTML file is saved
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: 'app'
    },
  })
});
