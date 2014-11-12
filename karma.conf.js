'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai-sinon'],
    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './test/*.js'
    ],
    browserify: {
      debug: true,
      transform: ['browserify-istanbul', 'browserify-shim']
    },
    preprocessors: {
      './test/*.js': ['browserify']
    },
    reporters: ['progress', 'coverage'],
    browsers: ['PhantomJS']
  });
};
