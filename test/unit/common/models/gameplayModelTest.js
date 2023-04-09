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

const users = ['admin1@ferropoly.ch', 'admin2@ferropoly.ch'];
let gp1, gp2, gp3;
describe('GameplayModel Tests', function () {
  before(function (done) {
    db.init(settings, function () {
      gameplays.removeGameplaysForUser(users[0], () => {
        gameplays.removeGameplaysForUser(users[1], done);
      })
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
        ownerEmail: users[0],
        map       : 'zvv',
        gameDate  : DateTime.now().toJSDate()
      }, function (err, res) {
        try {
          console.log(res);
          expect(res._id).to.be.a('string');
          expect(res.internal.gameId.length > 4).to.be(true);
          expect(res.internal.owner).to.be(users[0]);
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
        ownerEmail: users[0],
        map       : 'sbb',
        gameDate  : DateTime.now().toJSDate()
      }, function (err, res) {
        try {
          console.log(res);
          expect(res._id).to.be.a('string');
          expect(res.internal.gameId.length > 4).to.be(true);
          expect(res.internal.owner).to.be(users[0]);
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
        ownerEmail: users[1],
        map       : 'zvv',
        gameDate  : DateTime.now().toJSDate()
      }, function (err, res) {
        console.log(res);
        expect(res._id).to.be.a('string');
        expect(res.internal.gameId.length > 4).to.be(true);
        expect(res.internal.owner).to.be(users[1]);
        expect(res.internal.map).to.be('zvv');
        expect(res.gamename).to.be('testspiel 3 (UnitTest)');
        expect(res.gameParams.housePrices).to.be(.5);
        done(err);
      })
    });
  });

  describe('Creating a new gameId', () => {
    it('should create a new gameId', done => {
      gameplays.createNewGameId((err, id) => {
        console.log(id);
        expect(id).to.be.a('string');
        done(err);
      })
    })
  });

  describe('Counting the gameplays', function () {
    it('should return the correct number for user 1', function (done) {
      gameplays.countGameplaysForUser(users[0], function (err, nb) {
        expect(nb >= 2).to.be(true);
        done(err);
      })
    });
    it('should return the correct number for user 2', function (done) {
      gameplays.countGameplaysForUser(users[1], function (err, nb) {
        expect(nb >= 1).to.be(true);
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


  describe('Getting all the gameplays for a user', function () {
    it('should return some for user 1', function (done) {
      gameplays.getGameplaysForUser(users[0], function (err, gps) {
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
      gameplays.getGameplaysForUser(users[1], function (err, gps) {
        expect(gps.length > 0).to.be(true);
        gp3 = gps[0];
        gps.forEach(function (gp) {
          console.log(gp.internal.gameId);
        });
        done(err);
      })
    });
  });

  describe('Getting all the gameplays for all users', function () {
    it('should return all gps', function (done) {
      gameplays.getAllGameplays(function (err, gps) {
        console.log('NB GPs:', gps.length);
        expect(gps.length > 1).to.be(true);
        done(err);
      })
    });
  });

  describe('Checking if a gp exists', () => {
    it('should return true if so', done => {
      gameplays.checkIfGameIdExists(gp1.internal.gameId, (err, res) => {
        expect(res).to.be(true);
        done(err);
      })
    })
    it('should return false for nonsense', done => {
      gameplays.checkIfGameIdExists('hakunamatata', (err, res) => {
        expect(res).to.be(false);
        done(err);
      })
    })
  })

  describe('Get one specific gameplay for a user', function () {
    it('should return the gameplay for the correct user', function (done) {
      gameplays.getGameplay(gp1.internal.gameId, users[0], function (err, gp) {
        expect(gp).to.be.a('object');
        expect(gp.internal.gameId).to.be(gp1.internal.gameId);
        console.log('got', gp1.internal.gameId)
        done(err);
      })
    });
    it('should return none for an invalid user', function (done) {
      gameplays.getGameplay(gp1.internal.gameId, users[1], function (err, gp) {
        expect(gp).to.be(undefined);
        expect(err).not.to.be(null);
        done();
      })
    });
  });

  describe('Updating a gameplay', function () {
    it('should work', function (done) {
      gameplays.getGameplay(gp3.internal.gameId, users[1], function (err, gp) {
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
    it('should work also partially', function (done) {
      let partial = {
        internal: {
          gameId: gp1.internal.gameId,
          owner : gp1.internal.owner
        },
        gameParams: {
          interestInterVal: 22
        }
      }
      gameplays.updateGameplayPartial(partial, function (err, gpSaved) {
        expect(gpSaved.gameParams.interestInterVal).to.be(22);
        expect(gpSaved.gameParams.startCapital).to.be(4000);
        console.log(gpSaved.internal.gameId + ' updated');
        done(err);
      });
    });
  });

  describe('Adding Admins', function () {
    it('should work', function (done) {
      gameplays.setAdmins(gp3.internal.gameId, users[1], ['demo1@ferropoly.ch', 'demo2@ferropoly.ch'], function (err, gpSaved) {
        expect(gpSaved.admins.logins.length).to.be(2);
        console.log(gpSaved.internal.gameId + ' updated');
        done(err);
      });
    });
  });

  describe('Updating gameplays last changed field', function () {
    it('should work', function (done) {
      console.log(gp3.log.lastEdited);
      gameplays.updateGameplayLastChangedField(users[1], gp3.internal.gameId, function (err, gpSaved) {
        console.log(gpSaved.log.lastEdited);
        console.log(gpSaved.internal.gameId + ' updated');
        done(err);
      });
    });
  });

  describe('Finalizing a gameplay', function () {
    it('should not work without a pricelist', function (done) {
      gameplays.finalize(gp3.internal.gameId, users[1], function (err) {
        expect(err).not.to.be(null);
        done();
      });
    });

    it('should return false as the gp is not finalized', function (done) {
      gameplays.isFinalized(gp3.internal.gameId, function (err, finalized) {
        expect(finalized).to.be(false);
        done(err);
      });
    });
    it('should work with a pricelist', function (done) {
      gameplays.getGameplay(gp3.internal.gameId, users[1], function (err, gp) {
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
          gameplays.finalize(gp3.internal.gameId, users[1], function (err, fgp) {
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
      gameplays.finalize(gp3.internal.gameId, users[1], function (err, fgp) {
        expect(fgp.internal.finalized).to.be(true);
        done(err);
      });
    });
    it('should return true if the gp is finalized', function (done) {
      gameplays.isFinalized(gp3.internal.gameId, function (err, finalized) {
        expect(finalized).to.be(true);
        done(err);
      });
    });
  });

  describe('Updating rules', function () {
    it('should create version 1 the first time', function (done) {
      gameplays.updateRules(gp3.internal.gameId, users[1], {text: 'Spielregeln'}, err => {
        expect(err).to.be(null);

        gameplays.getGameplay(gp3.internal.gameId, users[1], (err, gp) => {
          expect(err).to.be(null);
          expect(gp.rules.text).to.be('Spielregeln');
          expect(gp.rules.version).to.be(0);

          gameplays.updateRules(gp3.internal.gameId, users[1], {
            text   : 'Updated',
            changes: 'abc'
          }, err => {
            expect(err).to.be(null);

            gameplays.getGameplay(gp3.internal.gameId, users[1], (err, gp) => {
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

    it('should save a new pricelist revision', function (done) {
      console.log(gp3.log.priceListVersion);
      gameplays.saveNewPriceListRevision(gp3, function (err, gpSaved) {
        console.log(gpSaved.log.priceListVersion);
        console.log(gpSaved.internal.gameId + ' updated');
        done(err);
      });
    });

  });

  describe('Deleting all gameplays again', function () {
    it('should work with #1', function (done) {
      gameplays.getGameplay(gp1.internal.gameId, users[0], function (err, gp) {
        gameplays.removeGameplay(gp, function (err) {
          done(err);
        });
      })
    });
    it('should work with #2', function (done) {
      gameplays.getGameplay(gp2.internal.gameId, users[0], function (err, gp) {
        gameplays.removeGameplay(gp, function (err) {
          done(err);
        });
      })
    });
    it('should work with #3', function (done) {
      gameplays.getGameplay(gp3.internal.gameId, users[1], function (err, gp) {
        gameplays.removeGameplay(gp, function (err) {
          done(err);
        });
      })
    });

    it('verify by getting all gameplays should return none for user 1', function (done) {
      gameplays.getGameplaysForUser(users[0], function (err, gps) {
        expect(gps.length).to.be(0);
        done(err);
      })
    });

    it('verify by getting all gameplays should return none for user 2', function (done) {
      gameplays.getGameplaysForUser(users[1], function (err, gps) {
        expect(gps.length).to.be(0);
        done(err);
      })
    });

  });
});
