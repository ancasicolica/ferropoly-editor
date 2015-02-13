/**
 *
 * Created by kc on 13.02.15.
 */
'use strict';
var expect = require('expect.js');
var db = require('./../../../common/lib/ferropolyDb');
var locations = require('./../../../common/models/locationModel');
var properties = require('./../../../common/models/propertyModel');
var settings = require('./../../../editor/settings');

var gameId = 'gameplay-test-id';
var locations;

describe('PropertyModel Tests', function () {
  before(function (done) {
    db.init(settings, function (err) {
      locations.getAllLocationsForMap('zvv', function (err, _locations) {
        locations = _locations;
        done(err);
      });
    });
  });

  // Close DB afterwards
  after(function (done) {
    db.close(done);
  });

  describe('Deleting all properties', function () {
    it('should work (even there are none)', function (done) {
      properties.removeAllPropertiesFromGameplay(gameId, done);
    });
  });

  describe('Add some locations to the properties', function () {
    it('should add the first location', function(done) {
      properties.createPropertyFromLocation(gameId, locations[0], function(err, prop){
        expect(prop.location.uuid).to.be(locations[0].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        done(err);
      })
    });
    it('should not add the first location twice', function(done) {
      properties.createPropertyFromLocation(gameId, locations[0], function(err, prop){
        expect(prop.location.uuid).to.be(locations[0].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        properties.getPropertiesForGameplay(gameId, null, function(err, props) {
          expect(props.length).to.be(1);
          done(err);
        });

      })
    });
    it('should add the second location', function(done) {
      properties.createPropertyFromLocation(gameId, locations[1], function(err, prop){
        expect(prop.location.uuid).to.be(locations[1].uuid);
        expect(prop.gameId).to.be(gameId);
        expect(prop.uuid.length > 6).to.be(true);
        properties.getPropertiesForGameplay(gameId, null, function(err, props) {
          expect(props.length).to.be(2);
          done(err);
        });
      })
    });
  });
});
