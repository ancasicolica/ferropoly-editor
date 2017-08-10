/**
 * Tests the edit route
 * Created by christian on 27.02.17.
 */

const expect              = require('expect.js');
const needle              = require('needle');
const settings            = require('../../fixtures/settings');
const login               = require('../../routes/login');
const logout              = require('../../routes/logout');
const createGame          = require('../../sequences/createGame');
const createFinalizedGame = require('../../sequences/createFinalizedGame');
const deleteAllGames      = require('../../sequences/deleteAllGames');
const gameplay            = require('../../routes/gameplay');
const _                   = require('lodash');
const admins              = require('../../routes/admins');
const edit                = require('../../routes/edit');
const debug               = require('../../routes/debug');

const admin1 = 'demo@ferropoly.ch';
const admin2 = 'nobody@ferropoly.ch';
const admin3 = 'team3@ferropoly.ch';
const admin4 = 'team9@ferropoly.ch';

describe('/edit route test WHICH IS DUMMY ONLY SO FAR', function () {
  let gameId  = '';
  let session = {};

  before(function (done) {
    this.timeout(10000);
    debug(__filename, () => {
      deleteAllGames(err => {
        if (err) {
          return done(err);
        }
        createGame({random: 80}, (err, res) => {
          if (err) {
            return done(err);
          }
          gameId  = res.gameId;
          session = res.session;
          logout(()=>{
            login(settings, (err, mySession) => {
              session = mySession;
              done(err);
            });
          });
        });
      })
    });
  });

  after(done => {
    logout(done);
  });
  describe('Loading the HTML page', () => {
    it('should not work without being logged in', done => {
      edit.getPage(null, {gameId, statusCodes: [401]}, done)
    });


    it('should work after being logged in', done => {
      login(settings, (err, session) => {
        if (err) {
          return done(err);
        }
        edit.getPage({cookies: session.cookies}, {gameId, statusCodes: [200]}, done);
      });
    });
  });

  describe('Loading the game data', () => {
    it('should not work without being logged in', done => {
      logout(() => {
        edit.load(null, {gameId, statusCodes: [401]}, done);
      });
    });
    it('should work when being logged in', done => {
      login(settings, (err, session) => {
        edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
          if (err) {
            return done(err);
          }
          expect(data).to.be.an('object');
          expect(data.gameplay).to.be.an('object');
          expect(data.properties).to.be.an('object');
          done();
        });
      });
    });
  });

  describe.only('Saving a game', () => {
    it('should woirk', done => {

        edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
          if (err) {
            return done(err);
          }
          expect(data).to.be.an('object');
          expect(data.gameplay).to.be.an('object');
          expect(data.properties).to.be.an('object');

          // Change a field of the gameplay
          let gp                   = data.gameplay;
          gp.owner.organisatorName = "Galileo";
          edit.save(session, {gameId: gp.internal.gameId, statusCodes: [200]}, gp, err => {
            if (err) {
              return done(err);
            }

            // Load again, it must be the new setting!
            edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
              if (err) {
                return done(err);
              }
              expect(data.gameplay.owner.organisatorName).to.be('Galileo');
            });
            done();
          });
        });

    });
  });
});