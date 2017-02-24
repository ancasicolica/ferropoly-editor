/**
 * Just a little test as a template
 */
const expect = require('expect.js');

describe('Integration demo Tests', function () {
  before(function (done) {
    console.log('BEFORE');
    done();
  });

  // Close DB afterwards
  after(function (done) {
    console.log('AFTER');
    done();
  });

  describe('Logging in', function () {
    it('should work', done => {
      require('../sequences/run')(done);
    });
  });
});