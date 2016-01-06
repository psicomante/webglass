const gulp = require('gulp');
const shell = require('gulp-shell');
const package = require("../package.json");
const typedoc = require("gulp-typedoc");

// typedoc
gulp.task("docs:generate", function() {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "amd",
            target: "es5",
            out: "dist/docs/",
            mode: 'file',
            name: package.name
        }))
    ;
});

gulp.task("docs", ['docs:generate'], function(){
  gulp.watch('../src/**/*.ts', ['docs:generate']);

  return gulp.src('*.js', {read: false})
    .pipe(shell([
      "npm run-script lite -- --baseDir './dist/docs'",
    ]));
});
