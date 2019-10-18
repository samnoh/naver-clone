import del from 'del';
import gulp from 'gulp';
import gulpHtml from 'gulp-htmlmin'; // minify HTML
import gulpSass from 'gulp-sass';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpCsso from 'gulp-csso'; // minify CSS
import gulpImage from 'gulp-image';
import gulpWebserver from 'gulp-webserver';

gulpSass.compiler = require('node-sass');

// Routes
const routes = {
    build: {
        dest: 'build'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'build',
        watch: 'src/**/*.html'
    },
    sass: {
        src: 'src/scss/main.scss',
        dest: 'build/css',
        watch: 'src/scss/**/*.scss'
    },
    assets: {
        src: 'assets/*',
        dest: 'build/assets'
    }
};

// Prepare
const clean = () => del([routes.build.dest]);

// Plugins
const html = () =>
    gulp
        .src(routes.html.src)
        .pipe(gulpHtml({ collapseWhitespace: true }))
        .pipe(gulp.dest(routes.html.dest));

const sass = () =>
    gulp
        .src(routes.sass.src)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
        .pipe(gulpCsso())
        .pipe(gulp.dest(routes.sass.dest));

const assets = () =>
    gulp
        .src(routes.assets.src)
        .pipe(gulpImage())
        .pipe(gulp.dest(routes.assets.dest));

// Live
const webserver = () =>
    gulp.src('build').pipe(gulpWebserver({ livereload: true, open: true, port: 3000 }));

// Watch
const watch = () => {
    gulp.watch(routes.html.watch, html);
    gulp.watch(routes.sass.watch, sass);
    gulp.watch(routes.assets.src, assets);
};

// Run
const prepare = gulp.series([clean, assets]);
const src = gulp.series([html, sass]);
const live = gulp.parallel([webserver, watch]);

// Scripts
export const build = gulp.series([prepare, src]);
export const dev = gulp.series([build, live]);
