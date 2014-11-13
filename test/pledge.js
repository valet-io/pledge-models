'use strict';

var angular = require('angular');

module.exports = function () {

  var campaign;
  beforeEach(angular.mock.inject(function ($injector) {
    var Campaign   = $injector.get('Campaign');
    campaign   = new Campaign();
  }));

  it('can generate a Firebasew reference to all pledges for a campaign', function () {
    expect(campaign.pledges.$ref().currentPath)
      .to.equal('Mock://campaigns/' + campaign.id + '/pledges');
  });

  it('can generate a Firebase reference to a single pledge', function () {
    var pledge = campaign.pledges.$new();
    expect(pledge.$ref().currentPath)
      .to.equal('Mock://campaigns/' + campaign.id + '/pledges/' + pledge.id);
  });

};
