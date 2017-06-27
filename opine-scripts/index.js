var gulp = require('gulp');
var opine = require('gulp-opine');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var duration = require('gulp-duration');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var module = opine.module('scripts');

var sources = module.getSources();
var dest = module.getDest();

var destfile = module.getConfig('target', 'main.js');

var basedir = sources[0].replace(/\*\*\/\*.*/g, '');
var entry = module.getConfig('entry', basedir + 'main.js');
var debug = module.getConfig('debug', opine.getConfig('base.debug', true));
var multibundle = module.getConfig('multibundle', null);

module.addBuild();
module.addWatch(sources);

function rebundle(bundler, entry, target) {
    var hasError = false;

    var t = new Date().toTimeString();
    var b = bundler.bundle()
        .on('error', function(e) {
            gutil.log(gutil.colors.yellow(e.message));
            module.fire('error', { e });
            this.emit('end');
            hasError = true;
        })
        .pipe(duration(t + ' Building ' + entry))
        .pipe(source(target))
        .pipe(buffer());

    if(!debug) {
        b = b.pipe(uglify());       
    }

    return b
        .pipe(gulp.dest(dest))
        .pipe(module.size())
        .on('finish', e => {
            if(!hasError) {
                module.fire('success', { e });
            }
        });
}

var bundlers = {};
function bundle(entry, target) {
    var bundler = bundlers[entry];
    if(!bundler) {
        bundler = browserify(entry, { debug: debug });
        bundlers[entry] = bundler;
    }
    return rebundle(bundler, entry, target);
}


module.task(function() {
    if(multibundle) {
        return multibundle.map(mb => bundle(mb.entry, mb.target));
    } else {
        return bundle(entry, destfile);
    }
});

