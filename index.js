var gulp = require('gulp');
var opine = require('gulp-opine');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var sourcemaps = require('gulp-sourcemaps');
var module = opine.module('styles');
var sources = module.getSources();
var dest = module.getDest();
var includes = module.getConfig('includes', []);

var debug = module.getConfig('debug', true);

module.addBuild();
module.addWatch(sources);

module.task(function() {

    var sasspipe = sass({
            outputStyle: 'expanded',
            precision: 6,
            includePaths: includes
        })
        .on('error', sass.logError);

    var b = gulp.src(sources)

    if(debug) {
        b = b.pipe(sourcemaps.init());
    }

    b = b.pipe(sasspipe)
        .pipe(postcss([
            autoprefixer({ browsers: ['last 3 versions', '> 5%', 'IE >= 0']}),
            mqpacker()
        ]));

    if(!debug) {
        b = b.pipe(cleanCSS({ compatibility: 'ie8' }))
    } else {
        b = b.pipe(sourcemaps.write());
    }

    return b
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});
