/**
 * Testing chancellery Transactions
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.04.23
 **/

const expect     = require('expect.js');
const db         = require('./../../../../common/lib/ferropolyDb');
const chancellery = require('./../../../../common/models/accounting/chancelleryTransaction');
const settings   = require('./../../../../editor/settings');

const gameId = 'unit-test';
describe('Chancellery Transaction Tests', function () {
  before(function (done) {
    db.init(settings, function () {
      chancellery.dumpChancelleryData(gameId, done)
    });
  });

  // Close DB afterwards
  after(function (done) {
    chancellery.dumpChancelleryData(gameId, ()=> {
      db.close(done);
    });
  });

  describe('Booking a transaction', ()=> {
    it('should book a new transaction', done => {
      const entry = new chancellery.Model();
      entry.gameId = gameId;
      entry.transaction.origin.uuid = 'me';
      entry.transaction.amount = 3000;
      entry.transaction.info = 'test';
      chancellery.book(entry, (err, res)=> {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('me');
        expect(res.transaction.info).to.be('test');
        expect(res.transaction.amount).to.be(3000);
        done(err);
      })
    });

    it('should have the right balance then', done => {
      chancellery.getBalance(gameId,(err, res)=> {
        console.log(res);
        expect(res.balance).to.be(3000);
        done(err);
      })
    });
    it('sccce then', done => {
      chancellery.getBalance(gameId,(err, res)=> {
        console.log('CALLBACK', err, res);
        //res.g.g=2;
        done(err);
      })
    });

    it('should book another transaction', done => {
      const entry = new chancellery.Model();
      entry.gameId = gameId;
      entry.transaction.origin.uuid = 'me';
      entry.transaction.amount = 1111;
      entry.transaction.info = 'test';
      chancellery.book(entry, (err, res)=> {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('me');
        expect(res.transaction.amount).to.be(1111);
        done(err);
      })
    });

    it('should have the right balance then', done => {
      chancellery.getBalance(gameId,(err, res)=> {
        console.log(res);
        expect(res.balance).to.be(4111);
        done(err);
      })
    });


    it('should book a negative transaction', done => {
      const entry = new chancellery.Model();
      entry.gameId = gameId;
      entry.transaction.origin.uuid = 'me';
      entry.transaction.amount = -111;
      entry.transaction.info = 'test';
      chancellery.book(entry, (err, res)=> {
        console.log(res);
        expect(res.transaction.origin.uuid).to.be('me');
        expect(res.transaction.amount).to.be(-111);
        done(err);
      })
    });

    it('should have the right balance then', done => {
      chancellery.getBalance(gameId,(err, res)=> {
        console.log(res);
        expect(res.balance).to.be(4000);
        done(err);
      })
    });
  })

  describe('Getting the whole account', ()=> {
    it('should retunr it', done=> {
      chancellery.getEntries(gameId, undefined, undefined, (err, entries) => {
        console.log(entries);
        expect(entries.length).to.be(3);
        done(err);
      })
    })
  })
});

