var opine = require('gulp-opine');

var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var module = opine.module('serve');

var port = module.getConfig('port', 8000);
var dir = module.getConfig('root', opine.getDest(''));

module.addAltWatch();

module.task(function(done) {
    var serve = serveStatic(dir);
    console.log('Serving', dir, 'on port', port, '...');
    http.createServer(function(req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    }).listen(port);
});

