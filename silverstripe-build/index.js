var opine = require('gulp-opine');
var gulp = require('gulp');

var spawn = require('child_process').spawn;

var module = opine.module('silverstripe-build');
module.dependencyOf('deploy');
module.depends('rsync');

var host = opine.getConfig('rsync.host');
var user = opine.getConfig('rsync.user', 'deploy');
var cwd = opine.getConfig('rsync.dest', '/var/www/html');

module.task(function(done) {
    var conn;
    if(user) {
        conn = user + '@' + host;
    } else {
        conn = host;
    }

    var args = [conn,
        'cd', cwd, ';',
        'php', 'framework/cli-script.php', '/dev/build'
        ];
    console.log(args);
    var ssh = spawn('ssh', args);

    ssh.stdout.on('data', function(data) {
        console.log(''+data);
    });

    ssh.stderr.on('data', function(data) {
        console.error(''+data);
    });

    ssh.on('close', function(code) {
        console.log('SSH complete.');
        done();
    });
});
