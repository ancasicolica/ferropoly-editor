/**
 *
 * Created by kc on 14.02.15.
 */
'use strict';

const expect     = require('expect.js');
const db         = require('./../../../../common/lib/ferropolyDb');
const locations  = require('./../../../../common/models/locationModel');
const properties = require('./../../../../common/models/propertyModel');
const gameplays  = require('./../../../../common/models/gameplayModel');
const settings   = require('./../../../../editor/settings');
const gplib      = require('./../../../../editor/lib/gameplayLib');
const {DateTime} = require('luxon');
let gp;

describe('GameplayLib Tests', function () {
  before(function (done) {
    db.init(settings, function (err) {
      done(err);
    });
  });

  // Close DB afterwards
  after(function (done) {
    db.close(done);
  });

  describe('Creating a complete new gameplay', function () {
    it('should create a gameplay', function (done) {
      gplib.createNewGameplay({
        email   : 'anyone@me.com',
        map     : 'zvv',
        gamename: 'LibTest',
        gamedate: DateTime.local(2020, 1, 1).toJSDate()
      }, function (err, newGp) {
        expect(newGp.gamename).to.be('LibTest');
        gp = newGp;
        done(err);
      });
    });
    it('should have the same number of properties as there are locations', function (done) {
      locations.getAllLocationsForMap('zvv', function (err, zvvLocs) {
        if (err) {
          done(err);
        }
        properties.getPropertiesForGameplay(gp.internal.gameId, null, function (err, props) {
          expect(props.length).to.be(zvvLocs.length);
          done(err);
        })
      })
    });
  });

  describe('Delete the complete gameplay', function () {
    it('should delete all properties of the gameplay', function (done) {
      gplib.deleteGameplay({gameId: gp.internal.gameId, ownerEmail: 'anyone@me.com'}, function (err) {
        if (err) {
          done(err);
        }
        // verifiy if really so
        properties.getPropertiesForGameplay(gp.internal.gameId, null, function (err, props) {
          expect(props.length).to.be(0);
          done(err);
        })
      })
    });
    it('should delete the gameplay as well', function (done) {
      gameplays.getGameplay(gp.internal.gameId, 'anyone@me.com', function (err, foundGp) {
        expect(foundGp).to.be(undefined);
        expect(err).not.to.be(null);
        done();
      })
    })
  });

  describe('Create the demo gameplay', function () {
    this.timeout(15000);
    it('should create the demo gameplay', function (done) {
      gplib.createDemoGameplay(function (err) {
        done(err);
      });
    });
  });

});
