'use strict';

module.exports = function (ConvexModel) {
  return ConvexModel.extend({
    $name: 'pledge',
    anonymous: false,
    $firebase: {
      path: function (withId, collection) {
        var campaign = collection ? collection.$related('campaign') : this.campaign;
        return campaign.$firebase.path.call(campaign, true) + '/' + this.$path(withId);
      }
    } 
  })
  .belongsTo('Donor', 'donor')
  .belongsTo('Campaign', 'campaign')
  .hasMany('Payment', 'payments');
};

module.exports.$inject = ['ConvexModel', 'live'];
