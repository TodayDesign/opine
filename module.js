var size = require('gulp-size');

module.exports = function(opine) {

    function Module(name) {
        this.name = name;

        this.execute = null;
        this.prereqs = [];
        this.postreqs = [];
    };

    Module.prototype.task = function(arg0, arg1) {
        if(arguments.length == 1) {
            this.execute = arg0;
        } else if(arguments.length == 2) {
            this.execute = arg1;
            this.prereqs = this.prereqs.concat(arg0);
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
        return opine.getSources(name, extensions);
    };

    Module.prototype.getDest = function() {
        return opine.getDest(name);
    };

    Module.prototype.getConfig = function(id, fallback) {
        return opine.getConfig(name + '.' + id, fallback);
    };

    Module.prototype.addWatch = function(path) {
        opine.addWatch(path, name);
        return this;
    };

    Module.prototype.addBuild = function() {
        opine.addBuild(name);
        return this;
    };

    Module.prototype.addAltWatch = function() {
        opine.addAltWatch(name);
        return this;
    };

    Module.prototype.size = function() {
        return size({ title: name });
    };

    return Module;

};
