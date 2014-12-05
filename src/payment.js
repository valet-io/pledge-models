'use strict';

var angular = require('angular');

module.exports = function (ConvexModel, stripe) {
  var Payment = ConvexModel.extend({
    $name: 'payment',
    toStripe: function () {
      return angular.extend({}, this.card, {
        name: this.pledge.donor.name,
        address_line1: this.address.street1,
        address_line2: this.address.street2,
        address_zip: this.address.zip
      });
    },
    tokenize: function () {
      var self = this;
      return stripe.card.createToken(this.toStripe(), {
        key: this.$key  
      })
      .then(function (token) {
        self.token = token.id;
        return self;
      });
    },
    toJSON: function () {
      var json = ConvexModel.prototype.toJSON.call(this);
      json.card = void 0;
      if (json.address && !json.address.street2) {
        json.address.street2 = void 0;
      }
      return json;
    }
  })
  .belongsTo('Pledge', 'pledge');

  Object.defineProperty(Payment.prototype, 'amount', {
    enumerable: true,
    get: function () {
      return this.pledge.amount;
    },
    set: angular.noop
  });

  return Payment;
};
module.exports.$inject = ['ConvexModel', 'stripe'];
