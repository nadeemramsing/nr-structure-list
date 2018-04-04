var
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    css2js = require('gulp-css2js'),
    del = require('del'),
    embedlr = require('gulp-embedlr'),
    gls = require('gulp-live-server'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    injectSvg = require('gulp-inject-svg'),
    ngAnnotate = require('gulp-ng-annotate'),
    path = require('path'),
    runSequence = require('run-sequence'),
    templateCache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    versionAppend = require('gulp-version-append'),

    dist = util.env.dist;

/* INIT */
if (!dist) {
    var server = gls.static('dev', 7500);
    server.start();
}

gulp.task('default', function () {
    if (dist) {
        return runSequence('build', function () {
            process.exit();
        });
    } else {
        return runSequence('build', 'watch', function () {
            reload(server, {
                path: path.join(__dirname, 'src'),
                type: "changed"
            });
        });
    }
});

gulp.task('watch', function () {
    gulp.watch('src/**/*', function (file) {
        runSequence('build', function () {
            reload(server, file);
        });
    });
});

gulp.task('build', ['index', 'cleanup', 'vendor-js', 'vendor-css'], function (done) {
    done();
});

gulp.task('index', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src('src/demo/index.html')
        .pipe(htmlmin({
            removeComments: true
        }))
        .pipe(versionAppend(['html', 'js', 'css']))
        .pipe(embedlr())
        .pipe(gulp.dest('dev'));
});

gulp.task('concat-js-html-css', ['js', 'html', 'css'], function () {
    return gulp
        .src(dist ? 'dist/**/*.temp.js' : 'dev/**/*.temp.js')
        .pipe(concat(dist ? 'nr-structure-list.min.js' : 'all.js'))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('js', ['demo-js'], function () {
    return gulp
        .src('src/nr-structure-list.js')
        .pipe(concat('1_js.temp.js'))
        .pipe(ngAnnotate())
        .pipe(gulpif(dist, uglify()))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('html', function () {
    return gulp
        .src('src/nr-structure-list.html')
        .pipe(injectSvg({
            base: 'src/'
        }))
        .pipe(gulpif(dist, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(templateCache('2_html.temp.js', {
            module: 'NrAngularPagination',
            root: 'tpl'
        }))
        .pipe(gulpif(dist, uglify()))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('css', function () {
    return gulp
        .src('src/nr-structure-list.css')
        .pipe(css2js())
        .pipe(gulpif(dist, uglify()))
        .pipe(concat('3_css.temp.js'))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('demo-js', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src('src/demo/index.js')
        .pipe(concat('4_js.temp.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dev'));
});

gulp.task('cleanup', ['concat-js-html-css'], function () {
    return del([dist ? 'dist/*.temp.js' : 'dev/*.temp.js'])
        .catch(err => { throw err })
});

gulp.task('vendor-js', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src([
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-messages/angular-messages.min.js',
            'bower_components/angular-material/angular-material.min.js',
            'bower_components/nr-angular-pagination/dist/nr-angular-pagination.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dev'));
});

gulp.task('vendor-css', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src([
            'bower_components/angular-material/angular-material.min.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dev'));
});

/* HELPER FUNCTIONS */
function reload(server, fileObj) {
    var extension = path.extname(fileObj.path);

    if (extension === '.css')
        fileObj.path = path.join(__dirname, 'src');

    server.start.bind(server)();
    server.notify.bind(server)(fileObj);
}