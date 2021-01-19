const sass = require('gulp-sass');
const sassGlobImporter = require('node-sass-glob-importer');

var pkg = require('./package.json'),
  gulp = require('gulp'),
  glob = require('glob'),
  minifyCSS = require('gulp-clean-css'),
  plugins = require('gulp-load-plugins')();


var config = {
  sass: './sass/**/*.{scss,sass}',
  sassSrc: './sass/uw_news.scss',
  sassIe: './sass/ie.scss',
  sassPrint: './sass/print.scss',
  css: './css',
  js:'./scripts',
  jsSrc:'./js/uw_news.js'
};

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp.src(config.jsSrc)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.js));
}

// Compile styles.
function styles() {
  return gulp.src(config.sassSrc)
    .pipe(plugins.plumber())
    .pipe(
      sass({
        includePaths: ['./node_modules/breakpoint-sass/stylesheets'],
        precision: 10,
        importer: sassGlobImporter()
      })
    )
    .pipe(plugins.sass({
      includePaths: require('node-bourbon').includePaths,
      outputStyle: 'collapsed'
    }))
    .pipe(minifyCSS())
    .pipe(plugins.concat('uw_news.css'))
    .pipe(gulp.dest(config.css))
    .pipe(plugins.size({title:'css'}));
}

// Watch files.
function watchFiles() {
  gulp.watch(config.sass, styles);
  gulp.watch(config.jsSrc, scripts);
}

const build = gulp.series(styles, scripts, watchFiles);
const watch = gulp.series(watchFiles);

exports.watch = watch;
exports.default = build;
