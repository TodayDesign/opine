
var opine = require('gulp-opine');
var livereload = require('livereload');

var module = opine.module('livereload');

var dest = opine.getConfig('base.dest', 'public');
var directories = module.getConfig('directories', [dest]);

if(typeof(directories) === 'string') {
    directories = [directories];
}

module.addAltWatch();

module.task(function(done) {
    var server = livereload.createServer();
    console.log("LiveReload watching: " + directories.join(', '));
    server.watch(directories);
});
