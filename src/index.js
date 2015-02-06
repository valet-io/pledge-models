'use strict';

require('angular')
  .module('valet-io-pledge-models', [
    'convex',
    'convex-firebase',
    require('angular-ziptastic')
  ])
  .factory('Campaign', require('./campaign'))
  .factory('Domain', require('./domain'))
  .factory('Donor', require('./donor'))
  .factory('Payment', require('./payment'))
  .factory('Pledge', require('./pledge'));

module.exports = 'valet-io-pledge-models';
