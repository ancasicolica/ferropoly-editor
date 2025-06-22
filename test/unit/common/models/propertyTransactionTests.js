/**
 * Testing property Transactions
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.04.23
 **/

const expect   = require('expect.js');
const db       = require('./../../../../common/lib/ferropolyDb');
const pt       = require('./../../../../common/models/accounting/propertyTransaction');
const settings = require('./../../../../editor/settings');

const gameId     = 'unit-test';
const propertyId = 'prop-id-test';
describe('Chancellery Transaction Tests', function () {
  before(async function () {
    await db.init(settings);
    await pt.dumpAccounts(gameId);
  });

  // Close DB afterwards
  after(async function () {
    await pt.dumpAccounts(gameId);
    await db.close();
  });

  describe('Booking some transactions', () => {
    it('should book a new transaction 1', done => {
      const entry                       = new pt.Model();
      entry.gameId                      = gameId;
      entry.propertyId                  = propertyId;
      entry.transaction.origin.uuid     = '123'
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 1000;
      entry.transaction.info            = 'hello';
      pt.book(entry).then(res => {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('123');
        expect(res.transaction.amount).to.be(1000);
        done();
      });
    });
    it('should book a new transaction 2', done => {
      const entry                       = new pt.Model();
      entry.gameId                      = gameId;
      entry.propertyId                  = propertyId;
      entry.transaction.origin.uuid     = 'eerr'
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 1000;
      entry.transaction.info            = 'hello';
      pt.book(entry).then(res => {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('eerr');
        expect(res.transaction.amount).to.be(1000);
        done();
      })
    });
    it('should book a new transaction 3', done => {
      const entry                       = new pt.Model();
      entry.gameId                      = gameId;
      entry.propertyId                  = propertyId;
      entry.transaction.origin.uuid     = '123'
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 2000;
      entry.transaction.info            = 'hello';
      pt.book(entry).then(res => {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('123');
        expect(res.transaction.amount).to.be(2000);
        done();
      });
    });
    it('should book a new transaction 4 (for another property)', done => {
      const entry                       = new pt.Model();
      entry.gameId                      = gameId;
      entry.propertyId                  = 'another';
      entry.transaction.origin.uuid     = '123'
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 2000;
      entry.transaction.info            = 'hello';
      pt.book(entry).then(res => {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('123');
        expect(res.transaction.amount).to.be(2000);
        done();
      })
    });
  });

  describe('Getting the entries', () => {
    it('should return them for a specific property', done => {
      pt.getEntries(gameId, propertyId, undefined, undefined).then(entries => {
        console.log(entries);
        expect(entries.length).to.be(3);
        done();
      });
    });
  });
  describe('Getting the summary', () => {
    it('should return it for a property', done => {
      pt.getSummary(gameId, propertyId).then(entries => {
        expect(entries.length).to.be(1);
        expect(entries[0]._id).to.be(propertyId);
        expect(entries[0].balance).to.be(4000)
        console.log(entries);
        done();
      })
    })
    it('should return it for all', done => {
      pt.getSummary(gameId).then(entries => {
        console.log(entries);
        expect(entries.length).to.be(2);
        done();
      })
    })
  })
});

