const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const shell = require('gulp-shell');
const typedoc = require("gulp-typedoc");

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('src/**/*.ts')
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('build', ['compile']);
gulp.task('default', ['build']);

// typedoc
gulp.task("docs:generate", function() {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "amd",
            target: "es5",
            out: "docs/",
            name: "WebGlass, a tiny WebGL library for shaders demos"
        }))
    ;
});

gulp.task("docs:serve", shell.task([
  "npm run-script lite -- --baseDir './docs'",
]));

gulp.task("docs", ['docs:generate', 'docs:serve']);
