'use strict';

var angular = require('angular');

module.exports = function () {

  var Payment, payment, stripe, ziptastic, $q, $timeout;
  beforeEach(angular.mock.inject(function ($injector) {
    Payment  = $injector.get('Payment');
    payment  = new Payment({
      address: {},
      pledge: {
        donor: {}
      }
    });
    $q        = $injector.get('$q');
    stripe    = $injector.get('stripe');
    ziptastic = $injector.get('ziptastic');
    $timeout  = $injector.get('$timeout');

    stripe.card.createToken.returns($q.when({
      id: 'theTokenId'
    }));
  }));

  describe('#toStripe', function () {

    it('copies the card', function () {
      payment.card = {
        number: '4242424242424242'
      };
      expect(payment.toStripe())
        .to.deep.equal(payment.card)
    });

    it('includes the donor name', function () {
      payment.pledge.donor.name = 'Ben'
      expect(payment.toStripe())
        .to.deep.equal({
          name: 'Ben'
        });
    });

    it('includes the address', function () {
      payment.address = {
        street1: '190 Bowery',
        street2: 'Floor 1',
        zip: '10012',
        city: 'New York',
        state: 'NY'
      };
      expect(payment.toStripe())
        .to.deep.equal({
          address_line1: '190 Bowery',
          address_line2: 'Floor 1',
          address_zip: '10012',
          address_city: 'New York',
          address_state: 'NY'
        });
    });

    it('excludes undefined values', function () {
      payment.address = {
        street1: '190 Bowery',
        street2: undefined,
        zip: '10012'
      };
      expect(payment.toStripe().hasOwnProperty('street2')).to.be.false;
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

  describe('#zipLookup', function () {

    it('can look up the city and state', function () {
      sinon.stub(ziptastic, 'lookup').returns($q.when({
        city: 'New York City',
        state_short: 'NY'
      }));
      payment.address = {
        zip: '10009'
      };
      payment.zipLookup()
        .then(function (_payment_) {
          expect(payment).to.equal(_payment_);
          expect(payment.address.city).to.equal('New York City');
          expect(payment.address.state).to.equal('NY');
        });
      $timeout.flush();
    });

    it('can pass options for $http', function () {
      sinon.stub(ziptastic, 'lookup').returns({then: sinon.stub()});
      var options = {};
      payment.address = {};
      payment.zipLookup(options);
      expect(ziptastic.lookup).to.have.been.calledWithMatch({
        $http: options
      });
    });

  });

  describe('#toJSON', function () {

    it('removes the card', function () {
      payment.card = {};
      expect(payment.toJSON()).to.not.have.property('card');
    });

    it('removes a falsy street2', function () {
      // validate that it doesn't throw w/out payment.address
      payment.toJSON();
      payment.address = {
        street2: ''
      };
      expect(payment.toJSON().address.street2).to.be.undefined;
      payment.address.street2 = 'Apt 11B';
      expect(payment.toJSON()).to.have.deep.property('address.street2', 'Apt 11B');

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
