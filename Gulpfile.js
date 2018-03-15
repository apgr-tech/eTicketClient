var gulp = require('gulp');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');

gulp.task('styles',function(){
    gulp.src('sass/**/*.scss').
    pipe(sourceMaps.init()).
    pipe(sass().on('error', sass.logError)).
    pipe(sourceMaps.write()).
    pipe(gulp.dest('./assets/css/'))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});