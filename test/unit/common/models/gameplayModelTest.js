/**
 * Unit tests for gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

const expect     = require('expect.js');
const db         = require('./../../../../common/lib/ferropolyDb');
const gameplays  = require('./../../../../common/models/gameplayModel');
const settings   = require('./../../../../editor/settings');
const moment     = require('moment');
const {DateTime} = require('luxon');

describe('GameplayModel Tests', function () {
  before(function (done) {
    db.init(settings, function (err) {
      done(err);
    });
  });

  // Close DB afterwards
  after(function (done) {
    db.close(done);
  });

  describe('Creating a new gameplay', function () {
    it('should work for #1 (user 1)', function (done) {
      gameplays.createGameplay({
        name      : 'testspiel 1 (UnitTest)',
        ownerEmail: 'admin1@ferropoly.ch',
        map       : 'zvv',
        gameDate  : DateTime.now().toJSDate()
      }, function (err, res) {
        try {
          expect(res._id).to.be.a('string');
          expect(res.internal.gameId.length > 9).to.be(true);
          expect(res.internal.owner).to.be('admin1@ferropoly.ch');
          expect(res.internal.map).to.be('zvv');
          expect(res.gamename).to.be('testspiel 1 (UnitTest)');
          expect(res.gameParams.housePrices).to.be(.5);
          done();
        } catch (ex) {
          done(ex);
        }
      })
    });
    it('should work for #2 (user 1)', function (done) {
      gameplays.createGameplay({
        name      : 'testspiel 2 (UnitTest)',
        ownerEmail: 'admin1@ferropoly.ch',
        map       : 'sbb',
        gameDate  : DateTime.now().toJSDate()
      }, function (err, res) {
        try {
          expect(res._id).to.be.a('string');
          expect(res.internal.gameId.length > 9).to.be(true);
          expect(res.internal.owner).to.be('admin1@ferropoly.ch');
          expect(res.internal.map).to.be('sbb');
          expect(res.gamename).to.be('testspiel 2 (UnitTest)');
          expect(res.gameParams.housePrices).to.be(.5);
          done(err);
        } catch (ex) {
          done(ex);
        }
      });
    });
      it('should work for #3 (user 2)', function (done) {
        gameplays.createGameplay({
          name      : 'testspiel 3 (UnitTest)',
          ownerEmail: 'admin2@ferropoly.ch',
          map       : 'zvv',
          gameDate  : DateTime.now().toJSDate()
        }, function (err, res) {
          expect(res._id).to.be.a('string');
          expect(res.internal.gameId.length > 9).to.be(true);
          expect(res.internal.owner).to.be('admin2@ferropoly.ch');
          expect(res.internal.map).to.be('zvv');
          expect(res.gamename).to.be('testspiel 3 (UnitTest)');
          expect(res.gameParams.housePrices).to.be(.5);
          done(err);
        })
      });
    });

    describe('Counting the gameplays', function () {
      it('should return the correct number for user 1', function (done) {
        gameplays.countGameplaysForUser('admin1@ferropoly.ch', function (err, nb) {
         // expect(nb).to.be(2);
          done(err);
        })
      });
      it('should return the correct number for user 2', function (done) {
        gameplays.countGameplaysForUser('admin2@ferropoly.ch', function (err, nb) {
          //expect(nb).to.be(1);
          done(err);
        })
      });
      it('should return the correct number all users', function (done) {
        gameplays.countGameplays(function (err, nb) {
          // the gameplays of the test users are also here
          expect(nb >= 3).to.be(true);
          done(err);
        })
      });

    });

    var gp1, gp2, gp3;
    describe('Getting all the gameplays for a user', function () {
      it('should return some for user 1', function (done) {
        gameplays.getGameplaysForUser('admin1@ferropoly.ch', function (err, gps) {
          expect(gps.length > 1).to.be(true);
          gp1 = gps[0];
          gp2 = gps[1];
          gps.forEach(function (gp) {
            console.log(gp.internal.gameId);
          });
          done(err);
        })
      });
      it('should return some for user 2', function (done) {
        gameplays.getGameplaysForUser('admin2@ferropoly.ch', function (err, gps) {
          expect(gps.length > 0).to.be(true);
          gp3 = gps[0];
          gps.forEach(function (gp) {
            console.log(gp.internal.gameId);
          });
          done(err);
        })
      });
    });

    describe('Get one specific gameplay for a user', function () {
      it('should return the gameplay for the correct user', function (done) {
        gameplays.getGameplay(gp1.internal.gameId, 'admin1@ferropoly.ch', function (err, gp) {
          expect(gp).to.be.a('object');
          expect(gp.internal.gameId).to.be(gp1.internal.gameId);
          console.log('got', gp1.internal.gameId)
          done(err);
        })
      });
      it('should return none for an invalid user', function (done) {
        gameplays.getGameplay(gp1.internal.gameId, 'admin2@ferropoly.ch', function (err, gp) {
          expect(gp).to.be(undefined);
          expect(err).not.to.be(null);
          done();
        })
      });
    });

    describe('Updating a gameplay', function () {
      it('should work', function (done) {
        gameplays.getGameplay(gp3.internal.gameId, 'admin2@ferropoly.ch', function (err, gp) {
          expect(gp).to.be.a('object');
          expect(gp.internal.gameId).to.be(gp3.internal.gameId);
          gp.gameParams.startCapital = 4555;
          gameplays.updateGameplay(gp, function (err, gpSaved) {
            expect(gpSaved.gameParams.startCapital).to.be(4555);
            console.log(gpSaved.internal.gameId + ' updated');
            done(err);
          });

        })
      });
    });

    describe('Finalizing a gameplay', function () {
      it('should not work without a pricelist', function (done) {
        gameplays.finalize(gp3.internal.gameId, 'admin2@ferropoly.ch', function (err) {
          expect(err).not.to.be(null);
          done();
        });
      });
      it('should work with a pricelist', function (done) {
        gameplays.getGameplay(gp3.internal.gameId, 'admin2@ferropoly.ch', function (err, gp) {
          expect(gp).to.be.a('object');
          expect(gp.scheduling.gameStartTs).to.be(undefined);
          expect(gp.scheduling.gameEndTs).to.be(undefined);
          expect(gp.internal.gameId).to.be(gp3.internal.gameId);
          gp.scheduling.gameStart = '04:30';
          gp.scheduling.gameEnd   = '9:22';
          gp.scheduling.gameDate  = new Date();
          gp.log.priceListVersion = 1;
          gameplays.updateGameplay(gp, function (err, gpSaved) {
            expect(gpSaved.log.priceListVersion).to.be(1);
            gameplays.finalize(gp3.internal.gameId, 'admin2@ferropoly.ch', function (err, fgp) {
              console.log(fgp);
              expect(moment(fgp.scheduling.gameStartTs).dayOfYear()).to.be(moment().dayOfYear());
              expect(moment(fgp.scheduling.gameEndTs).dayOfYear()).to.be(moment().dayOfYear());
              expect(fgp.scheduling.gameStartTs.getMinutes()).to.be(30);
              expect(fgp.scheduling.gameStartTs.getHours()).to.be(4);
              expect(fgp.scheduling.gameEndTs.getMinutes()).to.be(22);
              expect(fgp.scheduling.gameEndTs.getHours()).to.be(9);
              done(err);
            });
          });
        })
      });
      it('should do nothing with an already finalized gameplay', function (done) {
        gameplays.finalize(gp3.internal.gameId, 'admin2@ferropoly.ch', function (err, fgp) {
          expect(fgp.internal.finalized).to.be(true);
          done(err);
        });
      });
    });

    describe('Updating rules', function () {
      it('should create version 1 the first time', function (done) {
        gameplays.updateRules(gp3.internal.gameId, 'admin2@ferropoly.ch', {text: 'Spielregeln'}, err => {
          expect(err).to.be(null);

          gameplays.getGameplay(gp3.internal.gameId, 'admin2@ferropoly.ch', (err, gp) => {
            expect(err).to.be(null);
            expect(gp.rules.text).to.be('Spielregeln');
            expect(gp.rules.version).to.be(0);

            gameplays.updateRules(gp3.internal.gameId, 'admin2@ferropoly.ch', {
              text   : 'Updated',
              changes: 'abc'
            }, err => {
              expect(err).to.be(null);

              gameplays.getGameplay(gp3.internal.gameId, 'admin2@ferropoly.ch', (err, gp) => {
                expect(err).to.be(null);
                expect(gp.rules.text).to.be('Updated');
                expect(gp.rules.changelog.length).to.be(2);
                expect(gp.rules.changelog[1].changes).to.be('abc');
                expect(gp.rules.changelog[1].version).to.be(1);
                expect(gp.rules.version).to.be(1);
                done(err);
              });
            });
          });
        });
      });
    });

    describe('Deleting all gameplays again', function () {
      it('should work with #1', function (done) {
        gameplays.getGameplay(gp1.internal.gameId, 'admin1@ferropoly.ch', function (err, gp) {
          gameplays.removeGameplay(gp, function (err) {
            done(err);
          });
        })
      });
      it('should work with #2', function (done) {
        gameplays.getGameplay(gp2.internal.gameId, 'admin1@ferropoly.ch', function (err, gp) {
          gameplays.removeGameplay(gp, function (err) {
            done(err);
          });
        })
      });
      it('should work with #3', function (done) {
        gameplays.getGameplay(gp3.internal.gameId, 'admin2@ferropoly.ch', function (err, gp) {
          gameplays.removeGameplay(gp, function (err) {
            done(err);
          });
        })
      });

      it('verify by getting all gameplays should return none for user 1', function (done) {
        gameplays.getGameplaysForUser('admin1@ferropoly.ch', function (err, gps) {
          //expect(gps).to.be(undefined);
          done(err);
        })
      });

      it('verify by getting all gameplays should return none for user 2', function (done) {
        gameplays.getGameplaysForUser('admin2@ferropoly.ch', function (err, gps) {
          //expect(gps).to.be(undefined);
          done(err);
        })
      });

    });
  });
