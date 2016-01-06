const gulp = require('gulp');
const typescript = require('gulp-typescript');
const tscConfig = require('../tsconfig.json');
const shell = require('gulp-shell');
const package = require("../package.json");

gulp.task('default', ['build']);

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('deploy', function(cb){
  var ghpages = require('gh-pages');
  var path = require('path');
  ghpages.publish(path.join(__dirname, '../dist'), {
    repo: 'https://github.com/psicomante/webglass.git',
    branch: 'public',
  }, cb);
});
