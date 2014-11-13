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
  describe('Pledge', require('./pledge'));
  describe('Payment', require('./payment'));
  // for coverage
  describe('Donor', function () {
    it('exists', angular.mock.inject(function (Donor) {
      expect(new Donor().$name).to.equal('donor');
    }));
  });
});
