var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', () =>
  gulp
    .src('src/*.js')
    .pipe(
      babel({
        presets: ['env'],
      })
    )
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['watch']);
