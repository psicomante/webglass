const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('build', ['clean','compile']);

gulp.task('compile', function () {
  console.log("Compilation Time");
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      "npm run-script build",
    ]));
});

gulp.task("serve", ['compile'], function(){
  gulp.watch('src/**/*.ts', ['compile']).on('change', function(file) {
  });

  return gulp.src('*.js', {read: false})
    .pipe(shell([
      "npm run-script lite -- --baseDir './' --files '/dist/**/*.js' 'assets/**/*.glsl'",
    ]));
});
