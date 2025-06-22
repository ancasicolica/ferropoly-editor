/**
 * Testing chancellery Transactions
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.04.23
 **/

const expect      = require('expect.js');
const db          = require('./../../../../common/lib/ferropolyDb');
const chancellery = require('./../../../../common/models/accounting/chancelleryTransaction');
const settings    = require('./../../../../editor/settings');

const gameId = 'unit-test';
describe('Chancellery Transaction Tests', function () {

  before(async function () {
    await db.init(settings);
    await chancellery.dumpChancelleryData(gameId);
  });

  // Close DB afterwards
  after(async function () {
    await chancellery.dumpChancelleryData(gameId);
    await db.close();
  });

  describe('Booking a transaction 1', () => {
    it('should book a new transaction', done => {
      const entry                   = new chancellery.Model();
      entry.gameId                  = gameId;
      entry.transaction.origin.uuid = 'me';
      entry.transaction.amount      = 3000;
      entry.transaction.info        = 'test';
      chancellery.book(entry).then(res => {
        console.log('booked', res);
        expect(res.transaction.origin.uuid).to.be('me');
        expect(res.transaction.info).to.be('test');
        expect(res.transaction.amount).to.be(3000);
        done();
      }).catch(done);
    });

    it('should have the right balance then', done => {
      chancellery.getBalance(gameId).then(res => {
        console.log(res);
        expect(res.balance).to.be(3000);
        done();
      }).catch(done);
    });
  });

  describe('Booking a transaction 2', () => {
    it('should book another transaction', done => {
      const entry                   = new chancellery.Model();
      entry.gameId                  = gameId;
      entry.transaction.origin.uuid = 'me';
      entry.transaction.amount      = 1111;
      entry.transaction.info        = 'test';
      chancellery.book(entry).then(res => {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('me');
        expect(res.transaction.amount).to.be(1111);
        done();
      }).catch(done);
    });

    it('should have the right balance then', done => {
      chancellery.getBalance(gameId).then(res => {
        console.log('result', res);
        expect(res.balance).to.be(4111);
        done();
      }).catch(done);
    });
  });

  describe('Booking a transaction 3', () => {
    it('should book a negative transaction', done => {
      const entry                   = new chancellery.Model();
      entry.gameId                  = gameId;
      entry.transaction.origin.uuid = 'me';
      entry.transaction.amount      = -111;
      entry.transaction.info        = 'test';
      chancellery.book(entry).then(res => {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('me');
        expect(res.transaction.amount).to.be(-111);
        done();
      }).catch(done);
    });

    it('should have the right balance then', done => {
      chancellery.getBalance(gameId).then(res => {
        console.log('result', res);
        expect(res.balance).to.be(4000);
        done();
      }).catch(done);
    });
  })

  describe('Getting the whole account', () => {
    it('should get it', done => {
      chancellery.getEntries(gameId, undefined, undefined).then(entries => {
        console.log(entries);
        expect(entries.length).to.be(3);
        done();
      }).catch(done);
    })
  })
});

