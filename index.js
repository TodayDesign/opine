var gulp = require('gulp');
var opine = require('gulp-opine');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');

var module = opine.module('styles');
var sources = module.getSources();
var dest = module.getDest();
var includes = module.getConfig('includes', []);

module.addBuild();
module.addWatch(sources);

module.task(function() {
    var sasspipe = sass({
            outputStyle: 'expanded',
            precision: 6,
            includePaths: includes
        })
        .on('error', sass.logError);

    return gulp.src(sources)
        .pipe(sasspipe)
        .pipe(postcss([
            autoprefixer({ browsers: ['last 3 versions', '> 5%', 'IE >= 0']})
        ]))
        .pipe(cssnano())
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});

