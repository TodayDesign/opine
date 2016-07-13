var gulp = require('gulp');
var opine = require('gulp-opine');

var size = require('gulp-size');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');

var module = opine.module('images');

var sources = module.getSources();
var dest = module.getDest();

module.addBuild();
module.addWatch(sources);

module.task(function() {
    return gulp.src(sources)
        .pipe(cache(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ cleanupIDs: false }]
        })))
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});

