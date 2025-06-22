/**
 *
 * Created by kc on 13.02.15.
 */
'use strict';
const expect         = require('expect.js');
const db             = require('./../../../../common/lib/ferropolyDb');
const travelLogModel = require('../../../../common/models/travelLogModel');
const settings       = require('./../../../../editor/settings');

const gameId     = 'gameplay-test-id';
const teamIds    = [
  '111-111',
  '222-222'
]
const propertyId = 'prop-1234'
const position   = {
  lat: 46.1,
  lng: 8.1
}
const property   = {
  uuid: '1234',
  location:
        {
          position: position
        }
}
const user       = 'cameo@ferropoly.ch'

describe('TravelLogModel Tests', function () {
  before(async function () {
    await db.init(settings);
  });

  // Close DB afterwards
  after(async function () {
    await travelLogModel.deleteAllEntries(gameId);
    await db.close();
  });

  describe('Adding normal entries', function () {
    it('should work ', async function () {
      const info = await travelLogModel.addEntry(gameId, teamIds[0], propertyId);
      console.log(info);
    });
    it('should deny if teamId is not a string ', function () {
      travelLogModel.addEntry(gameId, {}, propertyId).catch(err => {
        expect(err).to.be.a('object')
      })


    });
    it('should deny if propertyId is not set', function () {
      travelLogModel.addEntry(gameId, teamIds[0], null).catch(err => {
        expect(err).to.be.a('object')
      })
    });
  });

  describe('Adding property entries', function () {
    it('should work ', async function () {
      const info = await travelLogModel.addPropertyEntry(gameId, teamIds[0], property);
      console.log(info);
    });
    it('should deny if teamId is not a string ', function () {
      travelLogModel.addPropertyEntry(gameId, {}, propertyId).catch(err => {
        expect(err).to.be.a('object')
      });
    });
    it('should deny if propertyId is not set', function () {
      travelLogModel.addPropertyEntry(gameId, teamIds[0], null).catch(err => {
        expect(err).to.be.a('object')
      })
    });
  });

  describe('Adding position entries', function () {
    it('should work ', async function () {
      const info = await travelLogModel.addPositionEntry(gameId, teamIds[0], user, position);
      console.log(info);
    });
    it('should deny if teamId is not a string ', function () {
      travelLogModel.addPositionEntry(gameId, {}, user, position).catch(err => {
        expect(err).to.be.a('object')
      })
    });
    it('should deny if user is not set', function () {
      travelLogModel.addPositionEntry(gameId, teamIds[0], null, position).catch(err => {
        expect(err).to.be.a('object')
      })
    });
  });

  describe('Get all entries', function () {
    it('should work for one team ', async function () {
      const info = await travelLogModel.getLogEntries(gameId, teamIds[0], null, null);
      console.log(info);
    });
    it('should work for all teams', async function () {
      const info = await travelLogModel.getLogEntries(gameId, null, null, null);
      console.log(info);
    });
    it('should work for all and everything', async function () {
      const info = await travelLogModel.getAllLogEntries(gameId, null);
      console.log(info);
    });
  });
});
