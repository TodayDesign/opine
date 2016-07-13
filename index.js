var gulp = require('gulp');
var opine = require('gulp-opine');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var duration = require('gulp-duration');
var uglify = require('gulp-uglify');

var module = opine.module('scripts');

var sources = module.getSources();
var dest = module.getDest();

var destfile = module.getConfig('target', 'main.js');

var basedir = sources[0].replace(/\*\*\/\*.*/g, '');
var entry = module.getConfig('entry', basedir + 'main.js');
var debug = module.getConfig('debug', true);

module.addBuild();
opine.addAltWatch('watch-scripts');

function printerr(e) {
    console.log(e);
}

function rebundle(bundler) {
    var t = new Date().toTimeString();
    var b = bundler.bundle()
        .on('error', printerr)
        .pipe(duration(t + ' Building'))
        .pipe(source(destfile))
        .pipe(buffer());

    if(!debug) {
        b = b.pipe(uglify());       
    }

    return b
        .pipe(gulp.dest(dest))
        .pipe(module.size());
}

module.task(function() {
    var bundler = browserify(entry, { debug: debug });
    return rebundle(bundler);
});

gulp.task('watch-scripts', [], function(done) {
    var bundler = browserify(entry, { debug: debug });
    var watcher = watchify(bundler);
    rebundle(watcher);
    watcher.on('update', function() {
        rebundle(watcher);
    });
});

