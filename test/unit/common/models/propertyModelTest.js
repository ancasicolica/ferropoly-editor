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
    db.init(settings, async function () {
      foundLocations = await locations.getAllLocationsForMap('zvv');
      done();
    });
  });

  // Close DB afterwards
  after(async function () {
    await properties.removeAllPropertiesFromGameplay(gameId);
    db.close();
  });

  describe('Deleting all properties', function () {
    it('should work (even there are none)', async function () {
      await properties.removeAllPropertiesFromGameplay(gameId);
    });
  });

  describe('Add some locations to the properties', function () {
    it('should add the first location', async function () {
      const prop = await properties.createPropertyFromLocation(gameId, foundLocations[0]);
      expect(prop.location.uuid).to.be(foundLocations[0].uuid);
      expect(prop.gameId).to.be(gameId);
      expect(prop.uuid.length > 6).to.be(true);
      propId0 = prop.uuid;
    });
    it('should not add the first location twice', async function () {
      const prop = await properties.createPropertyFromLocation(gameId, foundLocations[0])
      expect(prop.location.uuid).to.be(foundLocations[0].uuid);
      expect(prop.gameId).to.be(gameId);
      expect(prop.uuid.length > 6).to.be(true);
      const props = await properties.getPropertiesForGameplay(gameId, null);
      expect(props.length).to.be(1);
    });
    it('should add the second location', async function () {
      const prop = await properties.createPropertyFromLocation(gameId, foundLocations[1]);
      expect(prop.location.uuid).to.be(foundLocations[1].uuid);
      expect(prop.gameId).to.be(gameId);
      expect(prop.uuid.length > 6).to.be(true);
      const props = await properties.getPropertiesForGameplay(gameId, null);
      expect(props.length).to.be(2);
    });
    it('should add the third location', async function () {
      const prop = await properties.createPropertyFromLocation(gameId, foundLocations[2])
      expect(prop.location.uuid).to.be(foundLocations[2].uuid);
      expect(prop.gameId).to.be(gameId);
      expect(prop.uuid.length > 6).to.be(true);
      const props = await properties.getPropertiesForGameplay(gameId, null)
      expect(props.length).to.be(3);
    });
  });

  describe('Set the price range in a property', function () {
    it('should set the price range', function (done) {
      properties.updatePositionInPriceList(gameId, propId0, 12).then(prop => {
        expect(prop.pricelist.positionInPriceRange).to.be(12);
        done();
      })
    });
    it('should set the price range again', function (done) {
      properties.updatePositionInPriceList(gameId, propId0, 2).then(prop => {
        expect(prop.pricelist.positionInPriceRange).to.be(2);
        done();
      })
    });
    it('should fail as the gameId is wrong', function (done) {
      properties.updatePositionInPriceList('test', propId0, 2).then(() => {
        done('error did not happen');
      })
        .catch(() => {
          done();
        })
    });
  });

  describe('Getting a property', () => {
    it('should return one by id', async () => {
      const prop = await properties.getPropertyById(gameId, propId0);
      console.log(prop);
      expect(prop.uuid).to.be(propId0);
    });
  });

  describe('Allow building', () => {
    it('should work', async () => {
      await properties.allowBuilding(gameId);
    });
  })
  describe('Counting properties', () => {
    it('should work', async () => {
      const res = await properties.countProperties(gameId);
      expect(res).to.be(3);
    });
  })
})
;
