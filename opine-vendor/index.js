var gulp = require('gulp');
var opine = require('gulp-opine');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var module = opine.module('vendor');

var includes = module.getConfig('includes', []);
var target = module.getConfig('target', 'vendor.js');
var dest = opine.getDest('scripts');
var debug = module.getConfig('debug', opine.getConfig('base.debug', true));

module.addBuild();
module.addWatch(includes);

module.task(function() {
    // concatenate all provided scripts and (optionally) minify them
    
    var p = gulp.src(includes)
        .pipe(concat(target));

    if(!debug) {
        p = p.pipe(uglify());
    }

    p = p.pipe(gulp.dest(dest))
         .pipe(module.size());

    return p;
});
