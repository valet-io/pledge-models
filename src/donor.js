'use strict';

module.exports = function (ConvexModel) {
  return ConvexModel.extend({
    $name: 'donor'
  });
};

module.exports.$inject = ['ConvexModel'];
