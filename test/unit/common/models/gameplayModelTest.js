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
  before(async function () {
    await db.init(settings);
    await gameplays.removeGameplaysForUser(users[0]);
    await gameplays.removeGameplaysForUser(users[1]);
  });

  // Close DB afterwards
  after(async function () {
    await db.close();
  });

  describe('Creating a new gameplay', function () {
    it('should work for #1 (user 1)', async function () {  // done entfernt
      const res = await gameplays.createGameplay({
        name:       'testspiel 1 (UnitTest)',
        ownerEmail: users[0],
        map:        'zvv',
        gameDate:   DateTime.now().toJSDate()
      });

      expect(res._id).to.be.a('string');
      expect(res.internal.gameId.length > 4).to.be(true);
      expect(res.internal.owner).to.be(users[0]);
      expect(res.internal.map).to.be('zvv');
      expect(res.gamename).to.be('testspiel 1 (UnitTest)');
      expect(res.gameParams.housePrices).to.be(.5);
    });

    it('should work for #2 (user 1)', async function () {  // done entfernt
      const res = await gameplays.createGameplay({
        name:       'testspiel 2 (UnitTest)',
        ownerEmail: users[0],
        map:        'sbb',
        gameDate:   DateTime.now().toJSDate()
      });

      expect(res._id).to.be.a('string');
      expect(res.internal.gameId.length > 4).to.be(true);
      expect(res.internal.owner).to.be(users[0]);
      expect(res.internal.map).to.be('sbb');
      expect(res.gamename).to.be('testspiel 2 (UnitTest)');
      expect(res.gameParams.housePrices).to.be(.5);
    });

    it('should work for #3 (user 2)', async function () {  // done entfernt
      const res = await gameplays.createGameplay({
        name:       'testspiel 3 (UnitTest)',
        ownerEmail: users[1],
        map:        'zvv',
        gameDate:   DateTime.now().toJSDate()
      });

      expect(res._id).to.be.a('string');
      expect(res.internal.gameId.length > 4).to.be(true);
      expect(res.internal.owner).to.be(users[1]);
      expect(res.internal.map).to.be('zvv');
      expect(res.gamename).to.be('testspiel 3 (UnitTest)');
      expect(res.gameParams.housePrices).to.be(.5);
    });
  });

  describe('Creating a new gameId', () => {
    it('should create a new gameId', done => {
      gameplays.createNewGameId().then(id => {
        console.log(id);
        expect(id).to.be.a('string');
        done();
      })
    })
  });

  describe('Counting the gameplays', function () {
    it('should return the correct number for user 1', function (done) {
      gameplays.countGameplaysForUser(users[0]).then(nb => {
        expect(nb >= 2).to.be(true);
        done();
      })
    });
    it('should return the correct number for user 2', function (done) {
      gameplays.countGameplaysForUser(users[1]).then(nb => {
        expect(nb >= 1).to.be(true);
        done();
      })
    });
    it('should return the correct number all users', function (done) {
      gameplays.countGameplays().then(nb => {
        // the gameplays of the test users are also here
        expect(nb >= 3).to.be(true);
        done();
      })
    });
  });


  describe('Getting all the gameplays for a user', function () {
    it('should return some for user 1', function (done) {
      gameplays.getGameplaysForUser(users[0]).then(gps => {
        expect(gps.length > 1).to.be(true);
        gp1 = gps[0];
        gp2 = gps[1];
        gps.forEach(function (gp) {
          console.log(gp.internal.gameId);
        });
        done();
      }).catch(err => {
        done(err);
      })
    });
    it('should return some for user 2', function (done) {
      gameplays.getGameplaysForUser(users[1]).then(gps => {
        expect(gps.length > 0).to.be(true);
        gp3 = gps[0];
        gps.forEach(function (gp) {
          console.log(gp.internal.gameId);
        });
        done();
      }).catch(err => {
        done(err);
      })
    });
  });

  describe('Getting all the gameplays for all users', function () {
    it('should return all gps', function (done) {
      gameplays.getAllGameplays().then(gps => {
        console.log('NB GPs:', gps.length);
        expect(gps.length > 1).to.be(true);
        done();
      }).catch(err => {
        done(err);
      });
    });
  });

  describe('Checking if a gp exists', () => {
    it('should return true if so', done => {
      gameplays.checkIfGameIdExists(gp1.internal.gameId).then(res => {
        expect(res).to.be(true);
        done();
      })
    })
    it('should return false for nonsense', done => {
      gameplays.checkIfGameIdExists('hakunamatata').then(res => {
        expect(res).to.be(false);
        done();
      })
    })
  })

  describe('Get one specific gameplay for a user', function () {
    it('should return the gameplay for the correct user', function (done) {
      gameplays.getGameplay(gp1.internal.gameId, users[0]).then(gp => {
        expect(gp).to.be.a('object');
        expect(gp.internal.gameId).to.be(gp1.internal.gameId);
        console.log('got', gp1.internal.gameId)
        done();
      }).catch(err => {
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
    it('should work', function () {
      gameplays.getGameplay(gp3.internal.gameId, users[1]).then(async gp => {
        expect(gp).to.be.a('object');
        expect(gp.internal.gameId).to.be(gp3.internal.gameId);
        gp.gameParams.startCapital = 4555;
        const gpSaved              = await gameplays.updateGameplay(gp);
        expect(gpSaved.gameParams.startCapital).to.be(4555);
        console.log(gpSaved.internal.gameId + ' updated');
      })
    });
    it('should work with a plain object', function (done) {
      gameplays.getGameplay(gp3.internal.gameId, users[1]).then(async gp => {
        expect(gp).to.be.a('object');
        expect(gp.internal.gameId).to.be(gp3.internal.gameId);
        gp.gameParams.startCapital = 4555;
        gp.save                    = null;
        const gpSaved              = await gameplays.updateGameplay(gp);
        expect(gpSaved.gameParams.startCapital).to.be(4555);
        console.log(gpSaved.internal.gameId + ' updated');
        done();
      })
    });
    it('should work also partially', async function () {
      let partial   = {
        internal:   {
          gameId: gp1.internal.gameId,
          owner:  gp1.internal.owner
        },
        gameParams: {
          interestInterVal: 22
        }
      }
      const gpSaved = await gameplays.updateGameplayPartial(partial);
      expect(gpSaved.gameParams.interestInterVal).to.be(22);
      expect(gpSaved.gameParams.startCapital).to.be(4000);
      console.log(gpSaved.internal.gameId + ' updated');
    });
  });

  describe('Adding Admins', function () {
    it('should work', async function () {
      const gpSaved = await gameplays.setAdmins(gp3.internal.gameId, users[1], ['demo1@ferropoly.ch',
                                                                                'demo2@ferropoly.ch']);
      expect(gpSaved.admins.logins.length).to.be(2);
      console.log(gpSaved.internal.gameId + ' updated');
    });
  });

  describe('Updating gameplays last changed field', function () {
    it('should work', async function () {
      console.log(gp3.log.lastEdited);
      const gpSaved = await gameplays.updateGameplayLastChangedField(users[1], gp3.internal.gameId);
      console.log(gpSaved.log.lastEdited);
      console.log(gpSaved.internal.gameId + ' updated');
    });
  });

  describe('Finalizing a gameplay', function () {
    it('should not work without a pricelist', function (done) {
      gameplays.finalize(gp3.internal.gameId, users[1]).catch(() => {
        done();
      });
    });

    it('should return false as the gp is not finalized', async function () {
      const finalized = await gameplays.isFinalized(gp3.internal.gameId);
      expect(finalized).to.be(false);
    });
    it('should work with a pricelist', async function () {
      const gp = await gameplays.getGameplay(gp3.internal.gameId, users[1]);

      expect(gp).to.be.a('object');
      expect(gp.scheduling.gameStartTs).to.be(undefined);
      expect(gp.scheduling.gameEndTs).to.be(undefined);
      expect(gp.internal.gameId).to.be(gp3.internal.gameId);
      gp.scheduling.gameStart = '04:30';
      gp.scheduling.gameEnd   = '9:22';
      gp.scheduling.gameDate  = new Date();
      gp.log.priceListVersion = 1;
      const gpSaved           = await gameplays.updateGameplay(gp);
      expect(gpSaved.log.priceListVersion).to.be(1);
      const fgp = await gameplays.finalize(gp3.internal.gameId, users[1]);
      expect(moment(fgp.scheduling.gameStartTs).dayOfYear()).to.be(moment().dayOfYear());
      expect(moment(fgp.scheduling.gameEndTs).dayOfYear()).to.be(moment().dayOfYear());
      expect(fgp.scheduling.gameStartTs.getMinutes()).to.be(30);
      expect(fgp.scheduling.gameStartTs.getHours()).to.be(4);
      expect(fgp.scheduling.gameEndTs.getMinutes()).to.be(22);
      expect(fgp.scheduling.gameEndTs.getHours()).to.be(9);
    });
    it('should do nothing with an already finalized gameplay', async function () {
      const fgp = await gameplays.finalize(gp3.internal.gameId, users[1])
      expect(fgp.internal.finalized).to.be(true);
    });
    it('should return true if the gp is finalized', async function () {
      const finalized = await gameplays.isFinalized(gp3.internal.gameId);
      expect(finalized).to.be(true);
    });
  });

  describe('Updating rules', function () {
    it('should create version 1 the first time', async function () {
      await gameplays.updateRules(gp3.internal.gameId, users[1], {text: 'Spielregeln'});
      const gp = await gameplays.getGameplay(gp3.internal.gameId, users[1]);
      expect(gp.rules.text).to.be('Spielregeln');
      expect(gp.rules.version).to.be(0);

      await gameplays.updateRules(gp3.internal.gameId, users[1], {
        text:    'Updated',
        changes: 'abc'
      });
      gp3 = await gameplays.getGameplay(gp3.internal.gameId, users[1]);
      expect(gp3.rules.text).to.be('Updated');
      expect(gp3.rules.changelog.length).to.be(2);
      expect(gp3.rules.changelog[1].changes).to.be('abc');
      expect(gp3.rules.changelog[1].version).to.be(1);
      expect(gp3.rules.version).to.be(1);

    });

    it('should save a new pricelist revision', async function () {
      console.log(gp2.log.priceListVersion);
      const gpSaved = await gameplays.saveNewPriceListRevision(gp2);
      console.log(gpSaved.log.priceListVersion);
      console.log(gpSaved.internal.gameId + ' updated');
    });
  });


  describe('Making a GP public', function () {
    it('should mark the public flag', async function () {
      let gp = await gameplays.makeGameplayPublic(gp1.internal.gameId)
      expect(gp.internal.gameDataPublic).to.be(true);
      return true;
    })
  });

  describe('Deleting all gameplays again', function () {
    it('should work with #1', async function () {
      const gp = await gameplays.getGameplay(gp1.internal.gameId, users[0]);
      await gameplays.removeGameplay(gp);
    });
    it('should work with #2', async function () {
      const gp = await gameplays.getGameplay(gp2.internal.gameId, users[0]);
      await gameplays.removeGameplay(gp);
    });
    it('should work with #3', async function () {
      const gp = await gameplays.getGameplay(gp3.internal.gameId, users[1]);
      await gameplays.removeGameplay(gp);
    });

    it('verify by getting all gameplays should return none for user 1', function (done) {
      gameplays.getGameplaysForUser(users[0]).then(gps => {
        expect(gps.length).to.be(0);
        done();
      })
    });

    it('verify by getting all gameplays should return none for user 2', function (done) {
      gameplays.getGameplaysForUser(users[1]).then(gps => {
        expect(gps.length).to.be(0);
        done();
      })
    });
  });
})
