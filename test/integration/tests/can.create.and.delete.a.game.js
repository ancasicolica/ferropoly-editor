/**
 * Create a game, check if it is here and then delete it again
 * Created by christian on 24.02.17.
 */

const expect         = require('expect.js');
const settings       = require('./../fixtures/settings');
const login          = require('./../routes/login');
const async          = require('async');
const gameplay       = require('./../routes/gameplay');
const _              = require('lodash');
const deleteAllGames = require('../sequences/deleteAllGames');
const debug          = require('../routes/debug');

describe('Create and delete a gameplay', function () {
  let session             = {};
  let gameplaysBeforeTest = [];
  let newGameId           = '';

  before(done => {
    debug(__filename, () => {
      deleteAllGames(err => {
        login(settings, (err, s) => {
          session = s;
          done(err);
        })
      })
    })
  });

  // Close DB afterwards
  after(done => {
    console.log('Done');
    done();
  });

  describe('Get the current games', () => {
    this.timeout(4000);
    it('should return some', done => {
      gameplay.getMyGames(session, (err, resp) => {
        gameplaysBeforeTest = resp.gameplays;
        done(err);
      });
    });
  });

  describe('Create new game', () => {
    it('should work', done => {
      gameplay.createNew(session, {random: 40}, (err, resp) => {
        newGameId = resp.gameId;
        done(err);
      });
    });
  });

  describe('Check if the gameplay is available and data correct', () => {
    it('should be', done => {
      gameplay.getMyGames(session, (err, resp) => {
        let newGame = _.find(resp.gameplays, g => {
          return g.internal.gameId == newGameId;
        });
        expect(newGame.internal.gameId).to.be(newGameId);
        expect(newGame.internal.creatingInstance).to.be.a('string');
        expect(newGame.internal.finalized).to.be(false);
        expect(newGame.internal.map).to.be('sbb');
        expect(newGame.internal.owner).to.be(settings.login.user);
        expect(newGame.isOwner).to.be(true);
        expect(newGame.log.priceListVersion).to.be(0);
        expect(newGame.scheduling.gameDate).to.be.a('string');
        expect(newGame.scheduling.deleteTs).to.be.a('string');
        expect(newGame.scheduling.gameStart).to.be.a('string');
        expect(newGame.scheduling.gameEnd).to.be.a('string');
        done(err);
      });
    });
  });

  describe('Delete the game again', () => {
    this.timeout(20000); // if main is not running, this takes a long time!
    it('should delete the game', done => {
      gameplay.delete(session, {gameId: newGameId}, (err) => {
        done(err);
      });
    });
  });
});