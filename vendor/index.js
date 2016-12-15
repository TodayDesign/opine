var gulp = require('gulp');
var opine = require('gulp-opine');

var concat = require('gulp-concat');

var module = opine.module('vendor');


var includes = module.getConfig('includes', []);
var target = module.getConfig('target', 'vendor.js');
var dest = opine.getDest('scripts');

module.addBuild();
module.addWatch(includes);

module.task(function() {
    return gulp.src(includes)
        .pipe(concat(target))
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});
