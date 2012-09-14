var requirejs = require('requirejs');
var jasmine = require('jasmine-node');
var soma = require('./src/soma-events');

for (key in jasmine) {
	if (jasmine[key] instanceof Function) {
		global[key] = jasmine[key];
	}
}

requirejs(['tests/suites/dispatcher_spec'], function () {

	// tell Jasmine to use the boring console reporter:
    //jasmine.getEnv().addReporter(new jasmine.TeamcityReporter());
	jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());

	// execute all specs
    jasmine.getEnv().execute();
});

//var util = require('util');

//
//for(var key in jasmine) {
//  global[key] = jasmine[key];
//}
//
//var isVerbose = true;
//var showColors = true;
//
//process.argv.forEach(function(arg){
//    switch(arg) {
//          case '--color': showColors = true; break;
//          case '--noColor': showColors = false; break;
//          case '--verbose': isVerbose = true; break;
//      }
//});
//
//jasmine.executeSpecsInFolder(__dirname + '/tests/suites', function(runner, log){
//  if (runner.results().failedCount == 0) {
//    process.exit(0);
//  }
//  else {
//    process.exit(1);
//  }
//}, isVerbose, showColors);