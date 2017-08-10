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
const moment              = require('moment');
const async               = require('async');

describe('/edit route tests', function () {
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

  describe('Saving a game', () => {
    it('should work', done => {
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
    it('should be refused for a wrong gameId', done => {
      edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameplay).to.be.an('object');
        expect(data.properties).to.be.an('object');

        // Change a field of the gameplay
        let gp             = data.gameplay;
        let correctGameId  = gp.internal.gameId;
        gp.internal.gameId = "fake-id";
        edit.save(session, {gameId: correctGameId, statusCodes: [400]}, gp, err => {
          if (err) {
            return done(err);
          }

          // Load again, it must be the new setting!
          edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
            if (err) {
              return done(err);
            }
            expect(data.gameplay.internal.gameId).to.be(correctGameId);
          });
          done();
        });
      });
    });
  });

  describe('Saving a single property', () => {
    it('should work', done => {
      edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameplay).to.be.an('object');
        expect(data.properties).to.be.an('object');

        let property = _.find(data.properties, p => {
          return p.location.name === 'Chur'
        });
        // Just check basics
        expect(property.gameId).to.be(gameId);
        expect(property.gamedata.buildingEnabled).to.be(false);
        expect(property.location.accessibility).to.be('train');

        // Set price range to 4, the other value is not really effective
        property.pricelist.priceRange           = 4;
        property.pricelist.positionInPriceRange = 1;


        edit.saveProperty(session, {gameId, statusCodes: [200]}, property, err => {
          if (err) {
            return done(err);
          }

          // Load again, there must be a new timestamp
          edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
            if (err) {
              return done(err);
            }

            property = _.find(data.properties, p => {
              return p.location.name === 'Chur'
            });
            expect(property.pricelist.priceRange).to.be(4);
            expect(property.pricelist.positionInPriceRange).to.be(1);
            done();
          });
        });
      });
    });
  });

  describe('Saving a few properties', () => {
    it('should work', done => {
      edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
        if (err) {
          return done(err);
        }
        expect(data).to.be.an('object');
        expect(data.gameplay).to.be.an('object');
        expect(data.properties).to.be.an('object');

        let properties = _.filter(data.properties, p => {
          switch (p.location.name) {
            case 'Chur':
            case 'Hinwil':
            case 'Trin':
            case 'Locarno':
            case 'Zermatt':
            case 'Grindelwald':
              return true;
          }
        });
        // Just check basics
        expect(properties.length).to.be(6);
        properties = _.sortBy(properties, p => {
          return p.location.name;
        });
        for (let i = 0; i < properties.length; i++) {
          properties[i].pricelist.priceRange           = 5;
          properties[i].pricelist.positionInPriceRange = i;
        }
        async.each(properties,
          function (p, cb) {
            edit.saveProperty(session, {gameId, statusCodes: [200]}, p, cb);
          },
          function (err) {
            if (err) {
              return done(err);
            }

            // Now we can test what we want...
            edit.savePositionInPricelist(session, {gameId, statusCodes: [200]}, properties, err => {
              if (err) {
                return done(err);
              }

              // Load again, new data must fit
              edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
                if (err) {
                  return done(err);
                }

                properties = _.filter(data.properties, p => {
                  switch (p.location.name) {
                    case 'Chur':
                    case 'Hinwil':
                    case 'Trin':
                    case 'Locarno':
                    case 'Zermatt':
                    case 'Grindelwald':
                      return true;
                  }
                });

                expect(properties.length).to.be(6);
                properties = _.sortBy(properties, p => {
                  return p.location.name;
                });
                for (let i = 0; i < properties.length; i++) {
                  expect(properties[i].pricelist.priceRange).to.be(5);
                  expect(properties[i].pricelist.positionInPriceRange).to.be(i);
                }

                done();
              });
            });
          });
      });
    });
  });

  describe('Touching the data changed flag', () => {
    it('should work', done => {
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
        edit.dataChanged(session, {gameId: gp.internal.gameId, statusCodes: [200]}, err => {
          if (err) {
            return done(err);
          }

          // Load again, there must be a new timestamp
          edit.load(session, {gameId, statusCodes: [200]}, (err, data) => {
            if (err) {
              return done(err);
            }
            expect(lastTouched.isBefore(moment(data.gameplay.log.lastEdited))).to.be(true);
            console.log(lastTouched);
            console.log(data.gameplay.log.lastEdited);
            done();
          });

        });
      });
    });
  });

});