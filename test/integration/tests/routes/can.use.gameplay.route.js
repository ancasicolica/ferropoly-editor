/**
 * Tests the edit route
 * Created by christian on 27.02.17.
 */

const expect              = require('expect.js');
const settings            = require('../../fixtures/settings');
const login               = require('../../routes/login');
const logout              = require('../../routes/logout');
const deleteAllGames      = require('../../sequences/deleteAllGames');
const gameplay            = require('../../routes/gameplay');
const _                   = require('lodash');
const debug               = require('../../routes/debug');


const maxNumberOfGames = 4;

// Finalization is not tested, this feature is used in the fixtures quite often
describe('/gameplay route tests', function () {
  let gameId  = '';
  let session = {};

  before(function (done) {
    this.timeout(10000);
    debug(__filename, () => {
      deleteAllGames(err => {
        if (err) {
          return done(err);
        }
        logout(() => {
          login(settings, (err, mySession) => {
            session = mySession;
            done(err);
          });
        });
      })
    });
  });

  after(done => {
    logout(done);
  });
  describe('Getting my games', () => {
    it('should not work without being logged in', done => {
      gameplay.getMyGames(null, {gameId, expectedStatusCode: 401}, done);
    });


    it('should work after being logged in', done => {
      login(settings, (err, session) => {
        if (err) {
          return done(err);
        }
        gameplay.getMyGames(session, {gameId, expectedStatusCode: 200}, (err, resp) => {
          if (err) {
            return done(err);
          }
          // we don't care about the length of the array now
          expect(resp.gameplays).to.be.an('array');
          done();
        });
      });
    });
  });

  describe('Creating a new game', () => {
    it('should not work without being logged in', done => {
      logout(() => {
        gameplay.createNew(null, {gamename: 'abcd', expectedStatusCode: 401}, done);
      });
    });
    it('should work when being logged in for #1', done => {
      login(settings, (err, newSession) => {
        session = newSession
        gameplay.createNew(session, {gamename: 'game#1', random: 0, expectedStatusCode: 200}, (err, data) => {
          if (err) {
            return done(err);
          }
          expect(data).to.be.an('object');
          expect(data.gameId).to.be.an('string');
          done();
        });
      });
    });
    it('should work when being logged in for #2', done => {
      gameplay.createNew(session, {gamename: 'game#2', random: 0, expectedStatusCode: 200}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameId).to.be.an('string');
        done();
      });
    });
    it('should work when being logged in for #3', done => {
      gameplay.createNew(session, {gamename: 'game#3', random: 0, expectedStatusCode: 200}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameId).to.be.an('string');
        done();
      });
    });
    it('should work when being logged in for #4', done => {
      gameplay.createNew(session, {gamename: 'game#4', random: 0, expectedStatusCode: 200}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameId).to.be.an('string');
        done();
      });
    });
    it('should have 4 games for the user now', done => {
      gameplay.getMyGames(session, {gameId, expectedStatusCode: 200}, (err, resp) => {
        if (err) {
          return done(err);
        }
        expect(resp.gameplays).to.be.an('array');
        expect(resp.gameplays.length).to.be(maxNumberOfGames);
        done();
      });
    });
    it('should not work for a 5th game', done => {
      gameplay.createNew(session, {gamename: 'game#4', random: 0, expectedStatusCode: 403}, (err, data) => {
        if (err) {
          return done(err);
        }
        done();
      });
    });
    it('should still have 4 games for the user now', done => {
      gameplay.getMyGames(session, {gameId, expectedStatusCode: 200}, (err, resp) => {
        if (err) {
          return done(err);
        }
        expect(resp.gameplays).to.be.an('array');
        expect(resp.gameplays.length).to.be(maxNumberOfGames);
        // Before we continue, we delete all games again!
        deleteAllGames(done);
      });
    });
  });


  describe('Checking a gameId', () => {
    it('works without being logged in', done => {
      logout(() => {
        gameplay.checkId(null, {gameId: 'abcd', expectedStatusCode: 200}, (err, resp) => {
            if (err) {
              return done(err);
            }
            expect(resp).to.be.an('object');
            console.log(resp);
            done();
          }
        );
      });
    });
    it('should work when being logged in', done => {
      login(settings, (err, newSession) => {
        session = newSession;
        gameplay.checkId(null, {gameId: 'abcd', expectedStatusCode: 200}, (err, resp) => {
          if (err) {
            return done(err);
          }
          expect(resp).to.be.an('object');
          expect(resp.valid).to.be(true);
          console.log(resp);
          done();
        });
      });
    });
    it('should suggest new names when id is already taken', done => {
      gameplay.createNew(session, {
        gamename          : 'game#1',
        gameId            : 'test-x',
        random            : 0,
        expectedStatusCode: 200
      }, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameId).to.be.an('string');
        gameplay.checkId(null, {gameId: 'test-x', expectedStatusCode: 200}, (err, resp) => {
          if (err) {
            return done(err);
          }
          expect(resp).to.be.an('object');
          expect(resp.valid).to.be(false);
          expect(resp.ids).to.be.an('array');
          expect(resp.ids.length > 4).to.be(true);
          console.log(resp);
          gameplay.delete(session, {gameId: 'test-x'}, done);
        });
      });
    });
  });


  describe('Deleting a game', () => {
    // execute the 3 following tests in this order
    it('does not work without being logged in', done => {
      gameplay.createNew(session, {
        gamename          : 'game#1',
        gameId            : 'test-x1',
        random            : 0,
        expectedStatusCode: 200
      }, (err) => {
        if (err) {
          return done(err);
        }
        logout(() => {
          gameplay.delete(null, {gameId: 'test-x1', expectedStatusCode: 401}, (err, resp) => {
              if (err) {
                return done(err);
              }
              done();
            }
          );
        });
      });
    });
    it('should not work with another user', done => {
      let wrongLogin        = _.cloneDeep(settings);
      wrongLogin.login.user = 'team10@ferropoly.ch';
      login(wrongLogin, (err, newSession) => {
        session = newSession;
        gameplay.delete(session, {gameId: 'test-x1', expectedStatusCode: 500}, (err, resp) => {
          if (err) {
            return done(err);
          }
          logout(done);
        });
      });
    });

    it('should work for the user', done => {
      console.log(settings);
      login(settings, (err, newSession) => {
        session = newSession;
        gameplay.delete(session, {gameId: 'test-x1', expectedStatusCode: 200}, (err, resp) => {
          if (err) {
            return done(err);
          }
          logout(done);
        });
      });
    });
  });
});
