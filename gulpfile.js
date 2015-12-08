/**
 * Created by jeremy on 26/11/2015.
 */
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gutil   = require('gulp-util'),
    plugins = require('gulp-load-plugins')();

gulp.task('connect', function () {
    connect.server({
        root: './',
        port: process.env.PORT || 5000
    })
});

gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./src/js/mrt.js')
    // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./dist/js/'));
});

// Less to CSS: Run manually with: "gulp build-css"
gulp.task('build-css', function() {
    return gulp.src('src/less/*.less')
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(plugins.autoprefixer(
            {
                browsers: [
                    '> 1%',
                    'last 2 versions',
                    'firefox >= 4',
                    'safari 7',
                    'safari 8',
                    'IE 8',
                    'IE 9',
                    'IE 10',
                    'IE 11'
                ],
                cascade: false
            }
        ))
        .pipe(plugins.cssmin())
        .pipe(gulp.dest('dist/css')).on('error', gutil.log);
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['browserify']);
    gulp.watch('src/**/*.less', ['build-css']);
});

gulp.task('default', ['build-css', 'browserify', 'connect', 'watch']);