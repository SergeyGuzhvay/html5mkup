const gulp = require('gulp');
const sass = require('gulp-ruby-sass');

gulp.task('sass', () =>
    sass('./src/**/*.{scss,sass}')
        .on('error', sass.logError)
        .pipe(gulp.dest('src/css/'))
);

gulp.task('watch', ['sass'], function () {
  gulp.watch(['./src/**/*.{scss,sass}'], ['sass']);
});

gulp.task('default', ['sass', 'watch'], function () {

});