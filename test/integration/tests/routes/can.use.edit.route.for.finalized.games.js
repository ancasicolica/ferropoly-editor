/**
 * Tests the edit route for finalized games
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
const moment              = require('moment');
const async               = require('async');

describe('/edit route tests with finalized games', function () {
  let gameId  = '';
  let session = {};

  before(function (done) {
    this.timeout(10000);
    debug(__filename, () => {
      deleteAllGames(err => {
        if (err) {
          return done(err);
        }
        createFinalizedGame({random: 80}, (err, res) => {
          if (err) {
            return done(err);
          }
          gameId  = res.gameId;
          session = res.session;
          logout(() => {
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


  describe('Loading the game data', () => {
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

  describe('Saving a game', () => {
    it('should not work with finalized game', done => {
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
        edit.save(session, {gameId: gp.internal.gameId, statusCodes: [500]}, gp, done);
      });
    });
  });

  describe('Saving a single property', () => {
    it('should not work for a finalized game', done => {
      edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameplay).to.be.an('object');
        expect(data.properties).to.be.an('object');

        let property = data.properties[1];

        // Set price range to 4, the other value is not really effective
        property.pricelist.priceRange           = 4;
        property.pricelist.positionInPriceRange = 1;

        edit.saveProperty(session, {gameId, statusCodes: [400]}, property, done);
      });
    });
  });

  describe('Saving a few properties', () => {
    it('should not work for a finalized game', done => {
      edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameplay).to.be.an('object');
        expect(data.properties).to.be.an('object');

        let properties = _.slice(data.properties, 0, 3);

        for (let i = 0; i < properties.length; i++) {
          properties[i].pricelist.priceRange           = 5;
          properties[i].pricelist.positionInPriceRange = i;
        }

        edit.savePositionInPricelist(session, {gameId, statusCodes: [500]}, properties, done);
      });
    });
  });

  describe('Touching the data changed flag', () => {
    it('should not work', done => {
      edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameplay).to.be.an('object');
        expect(data.properties).to.be.an('object');

        // Get the last timestamp
        let gp          = data.gameplay;
        let lastTouched = moment(gp.log.lastEdited);
        edit.dataChanged(session, {gameId: gp.internal.gameId, statusCodes: [500]}, err => {
          if (err) {
            return done(err);
          }

          // Load again, there must be a new timestamp
          edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
            if (err) {
              return done(err);
            }
            expect(lastTouched.isSame(moment(data.gameplay.log.lastEdited))).to.be(true);
            console.log(lastTouched);
            console.log(data.gameplay.log.lastEdited);
            done();
          });

        });
      });
    });
  });

});