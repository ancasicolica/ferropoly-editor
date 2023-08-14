/**
 *
 * Created by kc on 13.02.15.
 */
'use strict';
const expect     = require('expect.js');
const db         = require('./../../../../common/lib/ferropolyDb');
const locations  = require('./../../../../common/models/locationModel');
const properties = require('./../../../../common/models/propertyModel');
const settings   = require('./../../../../editor/settings');

const gameId = 'gameplay-test-id';
let foundLocations;
let propId0;

describe('PropertyModel Tests', function () {
  before(function (done) {
    db.init(settings, function () {
      locations.getAllLocationsForMap('zvv', function (err, _locations) {
        foundLocations = _locations;
        done(err);
      });
    });
  });

  // Close DB afterwards
  after(function (done) {
    properties.removeAllPropertiesFromGameplay(gameId, err=> {
      expect(err).to.be(undefined);
      db.close(done);
    })
  });

  describe('Deleting all properties', function () {
    it('should work (even there are none)', function (done) {
      properties.removeAllPropertiesFromGameplay(gameId, done);
    });
  });

  describe('Add some locations to the properties', function () {
    it('should add the first location', function (done) {
      properties.createPropertyFromLocation(gameId, foundLocations[0], function (err, prop) {
        expect(prop.location.uuid).to.be(foundLocations[0].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        propId0 = prop.uuid;
        done(err);
      })
    });
    it('should not add the first location twice', function (done) {
      properties.createPropertyFromLocation(gameId, foundLocations[0], function (err, prop) {
        expect(prop.location.uuid).to.be(foundLocations[0].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        properties.getPropertiesForGameplay(gameId, null, function (err, props) {
          expect(props.length).to.be(1);
          done(err);
        });

      })
    });
    it('should add the second location', function (done) {
      properties.createPropertyFromLocation(gameId, foundLocations[1], function (err, prop) {
        expect(prop.location.uuid).to.be(foundLocations[1].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        properties.getPropertiesForGameplay(gameId, null, function (err, props) {
          expect(props.length).to.be(2);
          done(err);
        });
      })
    });
    it('should add the third location', function (done) {
      properties.createPropertyFromLocation(gameId, foundLocations[2], function (err, prop) {
        expect(prop.location.uuid).to.be(foundLocations[2].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        properties.getPropertiesForGameplay(gameId, null, function (err, props) {
          expect(props.length).to.be(3);
          done(err);
        });
      })
    });
  });

  describe('Set the price range in a property', function () {
    it('should set the price range', function (done) {
      properties.updatePositionInPriceList(gameId, propId0, 12, function (err, prop) {
        expect(err).to.be(undefined);
        expect(prop.pricelist.positionInPriceRange).to.be(12);
        done(err);
      })
    });
    it('should set the price range again', function (done) {
      properties.updatePositionInPriceList(gameId, propId0, 2, function (err, prop) {
        expect(err).to.be(undefined);
        expect(prop.pricelist.positionInPriceRange).to.be(2);
        done(err);
      })
    });
    it('should fail as the gameId is wrong', function (done) {
      properties.updatePositionInPriceList('test', propId0, 2, function (err, prop) {
        expect(err).not.to.be(undefined);
        expect(prop).to.be(undefined);
        done();
      })
    });
  });

  describe('Getting a property', ()=> {
    it('should return one by id', done=> {
      properties.getPropertyById(gameId, propId0, (err, prop) => {
        console.log(prop);
        expect(prop.uuid).to.be(propId0);
        done(err);
      } );
    });
  })
  describe('Allow building', ()=> {
    it('should work', done=> {
      properties.allowBuilding(gameId, (err, res) => {
        console.log(res);
        done(err);
      } );
    });
  })
  describe('Counting properties', ()=> {
    it('should work', done=> {
      properties.countProperties(gameId, (err, res) => {
        console.log(res);
        expect(res).to.be(3);
        done(err);
      } );
    });
  })
});
