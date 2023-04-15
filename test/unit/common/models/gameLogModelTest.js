/**
 * Tests for the gameLogModel
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.04.23
 **/

const expect     = require('expect.js');
const db         = require('./../../../../common/lib/ferropolyDb');
const log        = require('../../../../common/models/gameLogModel');
const settings   = require('./../../../../editor/settings');


const gameId  = 'unit-test'
const teamIds = ['team-id-1', 'team-id-2'];
describe('gameLogModel Tests', () => {
  before(function (done) {
    db.init(settings, function () {
      log.deleteAllEntries(gameId, done);
    });
  });

  // Close DB afterwards
  after(function (done) {
    log.deleteAllEntries(gameId, () => {
      db.close(done);
    });
  });

  describe('Adding some log entries', () => {
    it('fails without gameId', done => {
      log.addEntry({
        title  : 'Unit Test',
        options: {message: 'This is a message', teamId: teamIds[0]}
      }, (err, res) => {
        console.log(err);
        expect(err).to.be.an('object');
        done();
      })
    })
    it('adds an entry with new API', done => {
      log.addEntry({
        gameId : gameId,
        title  : 'Unit Test',
        options: {message: 'This is a message', teamId: teamIds[0]}
      }, (err, res) => {
        console.log(res);
        expect(res.message).to.be('This is a message');
        done(err);
      })
    })
    it('adds an entry with new API', done => {
      log.addEntry({
        gameId : gameId,
        title  : 'Unit Test',
        options: {message: 'This is a message 2', teamId: teamIds[0]}
      }, (err, res) => {
        console.log(res);
        done(err);
      })
    })
    it('adds an entry with legacy API', done => {
      log.addEntry(gameId, 1, 'title', {message: 'This is a message', teamId: teamIds[1]}, (err, res) => {
        console.log(res);
        expect(res.message).to.be('This is a message');
        done(err);
      })
    })
  });

  describe('Getting log entries', () => {
    it('should return all entries for all teams', done => {
      log.getLogEntries(gameId, undefined, undefined, undefined, (err, res) => {
        console.log(res);
        expect(res.length).to.be(3);
        done(err);
      })
    })
    it('should return all entries for the first team', done => {
      log.getLogEntries(gameId, teamIds[0], undefined, undefined, (err, res) => {
        console.log(res);
        expect(res.length).to.be(2);
        done(err);
      })
    })
    it('should return all entries over the convenience function', done => {
      log.getAllLogEntries(gameId, undefined, (err, res) => {
        console.log(res);
        expect(res.length).to.be(3);
        done(err);
      })
    })
  })
})
