/**
 * Testing team account Transactions
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.04.23
 **/

const expect   = require('expect.js');
const db       = require('./../../../../common/lib/ferropolyDb');
const tat      = require('./../../../../common/models/accounting/teamAccountTransaction');
const settings = require('./../../../../editor/settings');

const gameId     = 'unit-test';
const teamIds    = ['team-id-1', 'team-id-2'];
describe('Chancellery Transaction Tests', function () {
  before(function (done) {
    db.init(settings, function () {
      tat.dumpAccounts(gameId, done)
    });
  });

  // Close DB afterwards
  after(function (done) {
    tat.dumpAccounts(gameId, () => {
      db.close(done);
    });
  });

  describe('Booking some transactions for team 1', () => {
    it('should book a new transaction 1', done => {
      const entry                       = new tat.Model();
      entry.gameId                      = gameId;
      entry.teamId                      = teamIds[0];
      entry.transaction.origin.uuid     = teamIds[1];
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 1000;
      entry.transaction.info            = 'hello';
      tat.book(entry, (err, res) => {
        console.log(res);
        expect(res.gameId).to.be(gameId);
        done(err);
      })
    });
    it('should book a new transaction 2', done => {
      const entry                       = new tat.Model();
      entry.gameId                      = gameId;
      entry.teamId                      = teamIds[0];
      entry.transaction.origin.uuid     = teamIds[1];
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = -500;
      entry.transaction.info            = 'hello';
      tat.book(entry, (err, res) => {
        console.log(res);
        expect(res.gameId).to.be(gameId);
        done(err);
      })
    });
    it('should book a new transaction 2', done => {
      const entry                       = new tat.Model();
      entry.gameId                      = gameId;
      entry.teamId                      = teamIds[0];
      entry.transaction.origin.uuid     = teamIds[1];
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 3300;
      entry.transaction.info            = 'hello';
      tat.book(entry, (err, res) => {
        console.log(res);
        expect(res.gameId).to.be(gameId);
        done(err);
      })
    });


  });

  describe('Booking some transactions for team 2', () => {
    it('should book a new transaction 1', done => {
      const entry                       = new tat.Model();
      entry.gameId                      = gameId;
      entry.teamId                      = teamIds[1];
      entry.transaction.origin.uuid     = teamIds[0];
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 500;
      entry.transaction.info            = 'hello';
      tat.book(entry, (err, res) => {
        console.log(res);
        expect(res.gameId).to.be(gameId);
        done(err);
      })
    });
    it('should book a new transaction 2', done => {
      const entry                       = new tat.Model();
      entry.gameId                      = gameId;
      entry.teamId                      = teamIds[1];
      entry.transaction.origin.uuid     = teamIds[0];
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 1500;
      entry.transaction.info            = 'hello';
      tat.book(entry, (err, res) => {
        console.log(res);
        expect(res.gameId).to.be(gameId);
        done(err);
      })
    });
    it('should book a new transaction 2', done => {
      const entry                       = new tat.Model();
      entry.gameId                      = gameId;
      entry.teamId                      = teamIds[1];
      entry.transaction.origin.uuid     = teamIds[0];
      entry.transaction.origin.category = 'team';
      entry.transaction.amount          = 7000;
      entry.transaction.info            = 'hello';
      tat.book(entry, (err, res) => {
        console.log(res);
        expect(res.gameId).to.be(gameId);
        done(err);
      })
    });


  });

  describe('Booking a transfer', () => {
    it('should execute the transfer', done => {
      const debitor                        = new tat.Model();
      debitor.gameId                       = gameId;
      debitor.teamId                       = teamIds[1];
      debitor.transaction.origin.uuid      = teamIds[0];
      debitor.transaction.origin.category  = 'team';
      debitor.transaction.amount           = -250;
      debitor.transaction.info             = 'hello';
      const creditor                       = new tat.Model();
      creditor.gameId                      = gameId;
      creditor.teamId                      = teamIds[0];
      creditor.transaction.origin.uuid     = teamIds[1];
      creditor.transaction.origin.category = 'team';
      creditor.transaction.amount          = 250;
      creditor.transaction.info            = 'hello';

      tat.bookTransfer(debitor, creditor, err => {
        done(err);
      })
    })
  })

  describe('Getting entries', () => {
    it('should return the entries for a single team', done => {
      tat.getEntries(gameId, teamIds[0], undefined, undefined, (err, data) => {
        console.log(data);
        expect(data.length).to.be(4);
        expect(data[1].teamId).to.be(teamIds[0]);
        expect(data[2].teamId).to.be(teamIds[0]);
        done(err);
      })
    })
    it('should return the entries for all teams', done => {
      tat.getEntries(gameId, undefined, undefined, undefined, (err, data) => {
        console.log(data);
        expect(data.length).to.be(8);
        done(err);
      })
    })
  })

  describe('Getting ranking list', () => {
    it('should return the list', done => {
      tat.getRankingList(gameId, (err, list) => {
        console.log(list);
        expect(list.length).to.be(2);
        expect(list[0]._id).to.be(teamIds[0]);
        expect(list[0].asset).to.be(4050);
        expect(list[1]._id).to.be(teamIds[1]);
        expect(list[1].asset).to.be(8750);
        done(err);
      })
    })
  });

  describe('Getting balance', () => {
    it('returns the balance for a specific team', done => {
      tat.getBalance(gameId, teamIds[0], (err, res) => {
        console.log(res);
        expect(res.asset).to.be(4050);
        expect(res.count).to.be(4);
        done(err);
      })
    })
  })
});

