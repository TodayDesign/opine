
var config = require('config');
var gulp = require('gulp');
var path = require('path');
var findup = require('findup').sync;
var gulpLoadPlugins = require('gulp-load-plugins');
var size = require('gulp-size');

var task_watches = [];
var task_develops = [];
var task_builds = [];

//----------------------------------------------------------
// Main opine function.
// This is designed to be called from within a gulpfile.
// It will add all discovered opine tasks and populate a 'watch'
// task.
function opine() {
    // import all modules named "opine-*"
    var parentDir = path.dirname(module.parent.filename);
    var options = {
        DEBUG: false,
        pattern: ['gulp-opine-*', '!gulp-opine'],
        lazy: false,
        config: findup(parentDir, 'package.json') + '/package.json'
    };
    var modules = gulpLoadPlugins(options);

    if(requiredConfig) {
        console.log('Required config missing:');
        console.log(JSON.stringify(requiredConfig, null, 4));
        throw new Error('The missing configuration values must be defined.');
    }

    // create default gulptask
    gulp.task('build', task_builds);
    gulp.task('default', ['build']);

    // create watches on all files that need them
    gulp.task('watch', function(done) {
        for(var i = 0; i < task_watches.length; ++i) {
            var w = task_watches[i];
            console.log('Watching', w.path, 'for', w.task);
            if(typeof(w.task) === 'string') {
                gulp.watch(w.path, [w.task]);
            } else {
                gulp.watch(w.path, w.task);
            }
        }
    });

    // create develop task, to build everything and then watch
    gulp.task('develop', ['build'], function() {
        for(var i = 0; i < task_develops; ++i) {
            gulp.start(task_develops[i]);
        }
        gulp.start('watch');
    });

    gulp.task('config-defaults', function() {
        console.log(JSON.stringify(missingConfig, null, 4));
    });
}

//----------------------------------------------------------
// Exported extra functions and objects.
// These are designed to be used by opine-* modules

function index(obj,is, value) {
    if (typeof is == 'string') {
        return index(obj,is.split('.'), value);
    } else if (is.length==1 && value!==undefined) {
        return obj[is[0]] = value;
    } else if (is.length==0) {
        return obj;
    } else {
        var subobj = obj[is[0]];
        if(!subobj) {
            subobj = {};
            obj[is[0]] = subobj;
        }
        return index(obj[is[0]],is.slice(1), value);
    }
}

var missingConfig = {};
var requiredConfig = null;

opine.getSources = function(id, extensions) {
    var base = opine.getConfig('base.source', 'frontend');
    var dir = opine.getConfig(id + '.source', base + '/' + id);
    extensions = opine.getConfig(id + '.extensions', extensions || '');
    if(typeof(extensions) == 'string') {
        extensions = [extensions];
    }
    return (extensions || []).map(function(e) {
        if(e[0] === '!') {
            return '!' + dir + '/**/*' + e.slice(1);
        } else {
            return dir + '/**/*' + e; 
        }
    });
}

opine.getDest = function(id) {
    var base = opine.getConfig('base.dest', 'public');
    return opine.getConfig(id + '.dest', base + '/' + id);
}

opine.getConfig = function(id, fallback) {
    var tid = 'opine.' + id;
    if(config.has(tid)) {
        return config.get(tid);
    } else if(typeof(fallback) === 'undefined') {
        index(missingConfig, id, 'REQUIRED');
        if(!requiredConfig) {
            requiredConfig = {};
        }
        index(requiredConfig, id, 'REQUIRED');
        return 'REQUIRED';
    } else {
        index(missingConfig, id, fallback);
        return fallback;
    }
};

opine.addBuild = function(task) {
    task_builds.push(task);
};

opine.addDevelop = function(task) {
    task_develops.push(task);
};

// opine-* modules should use this to indicate that the
// task that they define has a watch component
opine.addWatch = function(path, task) {
    task_watches.push({
        path: path,
        task: task
    });
};

opine.module = function(name) {
    return {
        name: name,
        
        task: function(arg0, arg1) {
            if(arguments.length == 1) {
                return gulp.task(name, [], arg0);
            } else if(arguments.length == 2) {
                return gulp.task(name, arg0, arg1);
            }
        },

        getSource: function(extensions) {
            return opine.getSource(name, extensions);
        },
        getDest: function() {
            return opine.getDest(name);
        },
        getConfig: function(id, fallback) {
            return opine.getConfig(name + '.' + id, fallback);
        },
        addWatch: function(path) {
            return opine.addWatch(path, name);
        },
        addBuild: function() {
            return opine.addBuild(name);
        },
        addDevelop: function() {
            return opine.addDevelop(name);
        },
        size: function() {
            return size({ title: name });
        }
    };
};

module.exports = opine;

