var size = require('gulp-size');

module.exports = function(opine) {

    function Module(name) {
        this.name = name;

        this.execute = null;
        this.prereqs = [];
        this.postreqs = [];
    };

    Module.prototype.task = function(arg0, arg1) {
        // check parameters -- this function mirrors gulp.task
        var execute = null;
        if(arguments.length == 1) {
            execute = arg0;
        } else if(arguments.length == 2) {
            this.prereqs = this.prereqs.concat(arg0);
            execute = arg1;
        }

        if(execute) {
            if(this.execute) {
                console.warn('WARNING: Execute function for task "' + this.name + '" already exists. Overwriting...');
            }
            this.execute = execute;
        }

        return this;
    };

    Module.prototype.depends = function(prereqs) {
        if(typeof prereqs == 'string') { 
            prereqs = [prereqs];
        }
        this.prereqs = this.prereqs.concat(prereqs);
        return this;
    };

    Module.prototype.dependencyOf = function(postreqs) {
        if(typeof postreqs == 'string') { 
            postreqs = [postreqs];
        }
        this.postreqs = this.postreqs.concat(postreqs);
        return this;
    };

    Module.prototype.getSources = function(extensions) {
        return opine.getSources(this.name, extensions);
    };

    Module.prototype.getDest = function() {
        return opine.getDest(this.name);
    };

    Module.prototype.getConfig = function(id, fallback) {
        return opine.getConfig(this.name + '.' + id, fallback);
    };

    Module.prototype.addWatch = function(path) {
        opine.addWatch(path, this.name);
        return this;
    };

    Module.prototype.addBuild = function() {
        opine.addBuild(this.name);
        return this;
    };

    Module.prototype.addAltWatch = function() {
        opine.addAltWatch(this.name);
        return this;
    };

    Module.prototype.size = function() {
        return size({ title: this.name });
    };

    return Module;

};
