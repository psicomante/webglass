const gulp = require('gulp');
const typescript = require('gulp-typescript');
const tscConfig = require('../tsconfig.json');
const shell = require('gulp-shell');
const package = require("../package.json");

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('src/**/*.ts')
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('build', ['compile']);
gulp.task('default', ['build']);

gulp.task('deploy', function(cb){
  var ghpages = require('gh-pages');
  var path = require('path');
  ghpages.publish(path.join(__dirname, '../dist'), {
    repo: 'https://github.com/psicomante/webglass.git',
    branch: 'public',
  }, cb);
});
