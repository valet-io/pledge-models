'use strict';

module.exports = function (ConvexModel) {
  return ConvexModel.extend({
    $name: 'domain'
  });
};

module.exports.$inject = ['ConvexModel'];
