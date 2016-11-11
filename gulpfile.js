var opine = require('./');

var test = opine.module('test');
test.dependencyOf(['build']);
test.task(function() {
    console.log('Executing test task');
});

opine();
