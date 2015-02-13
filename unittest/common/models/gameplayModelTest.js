/**
 * Unit tests for gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

var expect = require('expect.js');
var db = require('./../../../common/lib/ferropolyDb');
var gameplays = require('./../../../common/models/gameplayModel');
var settings = require('./../../../editor/settings');

describe('UserModel Tests', function () {
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
      gameplays.createGameplay({name: 'testspiel 1', ownerEmail: 'olivia@kunz.ch', map: 'zvv'}, function (err, res) {
        expect(res._id).to.be.a('object');
        expect(res.internal.gameId.length > 9).to.be(true);
        expect(res.internal.owner).to.be('olivia@kunz.ch');
        expect(res.internal.map).to.be('zvv');
        expect(res.gamename).to.be('testspiel 1');
        expect(res.gameParams.housePrices).to.be(.5);
        done(err);
      })
    });
    it('should work for #2 (user 1)', function (done) {
      gameplays.createGameplay({name: 'testspiel 2', ownerEmail: 'olivia@kunz.ch', map: 'sbb'}, function (err, res) {
        expect(res._id).to.be.a('object');
        expect(res.internal.gameId.length > 9).to.be(true);
        expect(res.internal.owner).to.be('olivia@kunz.ch');
        expect(res.internal.map).to.be('sbb');
        expect(res.gamename).to.be('testspiel 2');
        expect(res.gameParams.housePrices).to.be(.5);
        done(err);
      })
    });
    it('should work for #3 (user 2)', function (done) {
      gameplays.createGameplay({
        name: 'testspiel 3',
        ownerEmail: 'christian@kusti.ch',
        map: 'zvv'
      }, function (err, res) {
        expect(res._id).to.be.a('object');
        expect(res.internal.gameId.length > 9).to.be(true);
        expect(res.internal.owner).to.be('christian@kusti.ch');
        expect(res.internal.map).to.be('zvv');
        expect(res.gamename).to.be('testspiel 3');
        expect(res.gameParams.housePrices).to.be(.5);
        done(err);
      })
    });
  });

  var gp1, gp2, gp3;
  describe('Getting all the gameplays for a user', function () {
    it('should return some for user 1', function (done) {
      gameplays.getGameplaysForUser('olivia@kunz.ch', function (err, gps) {
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
      gameplays.getGameplaysForUser('christian@kusti.ch', function (err, gps) {
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
      gameplays.getGameplay(gp1.internal.gameId, 'olivia@kunz.ch', function (err, gp) {
        expect(gp).to.be.a('object');
        expect(gp.internal.gameId).to.be(gp1.internal.gameId);
        done(err);
      })
    });
    it('should return none for an invalid user', function (done) {
      gameplays.getGameplay(gp1.internal.gameId, 'christian@kusti.ch', function (err, gp) {
        expect(gp).to.be(undefined);
        done(err);
      })
    });
  });

  describe('Updating a gameplay', function () {
    it('should work', function (done) {
      gameplays.getGameplay(gp3.internal.gameId, 'christian@kusti.ch', function (err, gp) {
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

  describe('Deleting all gameplays agin', function () {
    it('should work with #1', function (done) {
      gameplays.getGameplay(gp1.internal.gameId, 'olivia@kunz.ch', function (err, gp) {
        gameplays.removeGameplay(gp, function (err) {
          done(err);
        });
      })
    });
    it('should work with #2', function (done) {
      gameplays.getGameplay(gp2.internal.gameId, 'olivia@kunz.ch', function (err, gp) {
        gameplays.removeGameplay(gp, function (err) {
          done(err);
        });
      })
    });
    it('should work with #3', function (done) {
      gameplays.getGameplay(gp3.internal.gameId, 'christian@kusti.ch', function (err, gp) {
        gameplays.removeGameplay(gp, function (err) {
          done(err);
        });
      })
    });

    it('verify by getting all gameplays should return some for user 1', function (done) {
      gameplays.getGameplaysForUser('olivia@kunz.ch', function (err, gps) {
        expect(gps).to.be(undefined);
        done(err);
      })
    });

  });
});
