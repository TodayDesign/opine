var gulp = require('gulp');
var opine = require('gulp-opine');
var modernizr = require('gulp-modernizr');
var uglify = require('gulp-uglify');

var module = opine.module('modernizr');

var dest = opine.getDest('scripts');

// we need to be a tiny bit tricky here as 
// the sources might be strings or arrays
var default_sources = [opine.getSources('scripts'), opine.getSources('styles')];
var default_sources_flattened = [].concat.apply([], default_sources);
var sources = module.getConfig('source', default_sources_flattened);

var options = module.getConfig('options', [
    			"setClasses",
    			"addTest",
    			"html5printshiv",
    			"testProp"
    		]);

module.addBuild();
module.addWatch(sources);

module.task(function() {
    console.log(sources);
	return gulp.src(sources)
    	.pipe(modernizr({
    		options: options
    	}))
        .pipe(uglify())
    	.pipe(gulp.dest(dest))
    	.pipe(module.size());
});

