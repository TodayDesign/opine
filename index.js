var gulp = require('gulp');
var opine = require('gulp-opine');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
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
            precision: 7,
            includePaths: includes
        })
        .on('error', sass.logError);

    var b = gulp.src(sources)

    b = b.pipe(sasspipe)
        .pipe(postcss([
            autoprefixer({ browsers: ['last 3 versions', '> 5%', 'IE >= 0']})
        ]));

    if(!debug) {
        b = b.pipe(cleanCSS({ compatibility: 'ie8' }))
    }

    return b
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});
