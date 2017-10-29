const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () =>
  gulp.src('src/index.js')
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.js', ['build']);
})

gulp.task('default', ['watch']);
