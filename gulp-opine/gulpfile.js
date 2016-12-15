var opine = require('./');

var test = opine.module('test');
test.dependencyOf(['build']);
test.task(function() {
    console.log('Executing test task');
});
test.task(function() { 
    console.log('Executing second test task');
});

opine();
