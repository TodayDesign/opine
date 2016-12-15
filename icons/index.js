var gulp = require('gulp');
var opine = require('gulp-opine');
var svgSprite = require('gulp-svg-sprite');

var module = opine.module('icons');

var sources = module.getSources();
var dest = module.getDest();

module.addBuild();
module.addWatch(sources);

module.task(function() {

    var iconConfig = {
        shape: {
            id: {                       // SVG shape ID related options
                generator:  "icon-%s",  // prefix id with 'icon-'
                whitespace: '_'         // Whitespace replacement for shape IDs
            },
            dimension: {                // Set maximum dimensions
                maxWidth:   64,
                maxHeight:  64
            }
        },
        svg: {
            namespaceClassnames : false
        },
        mode: {
            css: false,
            symbol: {
                dest:   '.',
                sprite: "icon-sprite.svg",
                prefix: "icon-",
                inline: false // true if using as an inline partial
            }
        }
    };

    return gulp.src(sources)
        .pipe(svgSprite(iconConfig))
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});

