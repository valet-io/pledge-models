'use strict';

require('angular')
  .module('valet-io-pledge-models', [
    'convex',
    'convex-firebase'
  ])
  .factory('Campaign', require('./campaign'))
  .factory('Donor', require('./donor'))
  .factory('Payment', require('./payment'))
  .factory('Pledge', require('./pledge'));

module.exports = 'valet-io-pledge-models';
