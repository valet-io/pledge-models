'use strict';

var angular = require('angular');

module.exports = function () {

  var Payment, payment, stripe, $q, $timeout;
  beforeEach(angular.mock.inject(function ($injector) {
    Payment  = $injector.get('Payment');
    payment  = new Payment({
      address: {},
      pledge: {
        donor: {}
      }
    });
    $q       = $injector.get('$q');
    stripe   = $injector.get('stripe');
    $timeout = $injector.get('$timeout');

    stripe.card.createToken.returns($q.when({
      id: 'theTokenId'
    }));
  }));

  describe('#toStripe', function () {

    function jsonify (object) {
      return JSON.parse(JSON.stringify(object));
    }

    it('copies the card', function () {
      payment.card = {
        number: '4242424242424242'
      };
      expect(jsonify(payment.toStripe()))
        .to.deep.equal(payment.card)
    });

    it('includes the donor name', function () {
      payment.pledge.donor.name = 'Ben'
      expect(jsonify(payment.toStripe()))
        .to.deep.equal({
          name: 'Ben'
        });
    });

    it('includes the address', function () {
      payment.address = {
        street1: '190 Bowery',
        street2: 'Floor 1',
        zip: '10012'
      };
      expect(jsonify(payment.toStripe()))
        .to.deep.equal({
          address_line1: '190 Bowery',
          address_line2: 'Floor 1',
          address_zip: '10012'
        });
    });

  });

  describe('#tokenize', function () {

    it('tokenizes the card', function () {
      payment.card = {};
      payment.tokenize();
      expect(stripe.card.createToken).to.have.been.calledWithMatch(payment.card);
    });

    it('uses a custom publishable key if set', function () {
      payment.card = {};
      payment.$key = 'customPk';
      payment.tokenize();
      expect(stripe.card.createToken).to.have.been.calledWithMatch(payment.card, sinon.match({
        key: 'customPk'
      }));
    });

    it('sets the token id as token', function () {
      payment.tokenize();
      $timeout.flush();
      expect(payment.token).to.equal('theTokenId');
    });

  });

  describe('#toJSON', function () {

    it('removes the card', function () {
      payment.card = {};
      expect(payment.toJSON()).to.not.have.property('card');
    });

    it('removes a falsy street2', function () {
      payment.street2 = '';
      expect(payment.toJSON()).to.not.have.property('street2');
      payment.street2 = 'Apt 11B';
      expect(payment.toJSON()).to.have.property('street2');

    });

  });

  describe('amount', function () {

    it('is a getter for the pledge amount', function () {
      payment.pledge.amount = 100;
      expect(payment.amount).to.equal(100);
    });

    it('it is a noop for set', function () {
      payment.pledge.amount = 100;
      payment.amount = 10;
      expect(payment.amount).to.equal(100);
    });

  });

};
