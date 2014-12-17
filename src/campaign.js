'use strict';

module.exports = function (ConvexModel, live) {
  var Campaign = ConvexModel.extend({
    $name: 'campaign',
    $firebase: {
      path: function (withId) {
        return this.$path(withId) + '/' + (live.enabled() ? 'live' : 'test');
      }
    },
    $$aggregates: {
      total: 0,
      count: 0
    },
    $$options: {
      starting_value: 0
    }
  })
  .hasMany('Pledge', 'pledges');

  Object.defineProperties(Campaign.prototype, {
    total: {
      get: function () {
        return this.$$aggregates.total + this.$$options.starting_value;
      }
    },
    count: {
      get: function () {
        return this.$$aggregates.count;
      }
    },
    options: {
      get: function () {
        return this.$$options;
      }
    }
  });

  return Campaign;
};

module.exports.$inject = ['ConvexModel', 'live'];
