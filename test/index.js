'use strict';

require('convex');
require('convex-firebase');


describe('Pledge Models', function () {
  beforeEach(angular.mock.module(require('../')));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('stripe', {
      card: {
        createToken: sinon.stub()
      }
    });
  }));
  describe('Campaign', require('./campaign'));
  describe('Payment', require('./payment'));
});
