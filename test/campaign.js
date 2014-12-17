'use strict';

var angular = require('angular');

module.exports = function () { 

  var Campaign, campaign, $rootScope, live;
  beforeEach(angular.mock.inject(function ($injector) {
    Campaign   = $injector.get('Campaign');
    campaign   = new Campaign();
    $rootScope = $injector.get('$rootScope');
    live       = $injector.get('live');
    var ref    = campaign.$ref();
    sinon.stub(campaign, '$ref').returns(ref);
    ref.set({
      aggregates: {
        total: 0,
        count: 0
      },
      options: {
        starting_value: 0
      }
    });
    campaign.$subscribe(['aggregates', 'options'], true);
  }));

  function flush () {
    campaign.$ref().flush();
    $rootScope.$digest();
  }

  it('can generate a Firebase reference for live mode', function () {
    expect(campaign.$ref().currentPath)
      .to.equal('Mock://campaigns/' + campaign.id + '/live');
  });

  it('can generate a Firebase reference for test mode', function () {
    live.enabled.returns(false);
    campaign = new Campaign();
    expect(campaign.$ref().currentPath)
      .to.equal('Mock://campaigns/' + campaign.id + '/test');
  });

  describe('total', function () {

    it('defaults to 0', function () {
      expect(campaign.total).to.equal(0);
    });

    it('can subscribe to remote updates', function () {
      campaign.$ref().child('aggregates/total').set(100);
      flush();
      expect(campaign.total).to.equal(100);
      campaign.$ref().child('options/starting_value').set(100);
      flush();
      expect(campaign.total).to.equal(200);
    });

  });

  describe('count', function () {

    it('defaults to 0', function () {
      expect(campaign.total).to.equal(0);
    });

    it('can subscribe to remote updates', function () {
      campaign.$ref().child('aggregates/count').set(10);
      flush();
      expect(campaign.count).to.equal(10);
    });

  });

  describe('options', function () {

    it('gets the options', function () {
      expect(campaign.options).to.deep.equal({
        starting_value: 0
      });
    });

  });

};
