var opine = require('gulp-opine');
var gulp = require('gulp');

var rsync = require('gulp-rsync');

var module = opine.module('rsync');
module.dependencyOf('deploy');
module.depends('build');

var host = module.getConfig('host');
var user = module.getConfig('user', 'deploy');
var exclude = module.getConfig('exclude', [
        '.git',
        'node_modules'
        ]);
var dest = module.getConfig('dest', '/var/www/html');
var source = module.getConfig('source', '.');
var root = module.getConfig('root', '.');
var links = module.getConfig('links', false);

module.task(function() {
    return gulp.src(source)
        .pipe(rsync({
            recursive: true,
            exclude: exclude,
            root: root,
            hostname: host,
            username: user,
            destination: dest,
            links: links
        }));
});
