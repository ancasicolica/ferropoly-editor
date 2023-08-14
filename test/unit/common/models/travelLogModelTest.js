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
  uuid    : '1234',
  location:
    {
      position: position
    }
}
const user       = 'cameo@ferropoly.ch'

describe('TravelLogModel Tests', function () {
  before(function (done) {
    db.init(settings, function () {
      done()
    });
  });

  // Close DB afterwards
  after(function (done) {
    travelLogModel.deleteAllEntries(gameId).then(() => {
      db.close(done);
    }).catch(done);
  });

  describe('Adding normal entries', function () {
    it('should work ', function (done) {
      travelLogModel.addEntry(gameId, teamIds[0], propertyId, (err, info) => {
        console.log(info);
        done(err);
      })
    });
    it('should deny if teamId is not a string ', function (done) {
      travelLogModel.addEntry(gameId, {}, propertyId, (err, info) => {
        console.log(info);
        expect(err).to.be.a('object')
        done();
      })
    });
    it('should deny if propertyId is not set', function (done) {
      travelLogModel.addEntry(gameId, teamIds[0], null, (err, info) => {
        console.log(info);
        expect(err).to.be.a('object')
        done();
      })
    });
  });

  describe('Adding property entries', function () {
    it('should work ', function (done) {
      travelLogModel.addPropertyEntry(gameId, teamIds[0], property, (err, info) => {
        console.log(info);
        done(err);
      })
    });
    it('should deny if teamId is not a string ', function (done) {
      travelLogModel.addPropertyEntry(gameId, {}, propertyId, (err, info) => {
        console.log(info);
        expect(err).to.be.a('object')
        done();
      })
    });
    it('should deny if propertyId is not set', function (done) {
      travelLogModel.addPropertyEntry(gameId, teamIds[0], null, (err, info) => {
        console.log(info);
        expect(err).to.be.a('object')
        done();
      })
    });
  });

  describe('Adding position entries', function () {
    it('should work ', function (done) {
      travelLogModel.addPositionEntry(gameId, teamIds[0], user, position, (err, info) => {
        console.log(info);
        done(err);
      })
    });
    it('should deny if teamId is not a string ', function (done) {
      travelLogModel.addPositionEntry(gameId, {}, user, position, (err, info) => {
        console.log(info);
        expect(err).to.be.a('object')
        done();
      })
    });
    it('should deny if user is not set', function (done) {
      travelLogModel.addPositionEntry(gameId, teamIds[0], null, position, (err, info) => {
        console.log(info);
        expect(err).to.be.a('object')
        done();
      })
    });
  });

  describe('Get all entries', function () {
    it('should work for one team ', function (done) {
      travelLogModel.getLogEntries(gameId, teamIds[0], null, null, (err, info) => {
        console.log(info);
        done(err);
      })
    });
    it('should work for all teams', function (done) {
      travelLogModel.getLogEntries(gameId, null, null, null, (err, info) => {
        console.log(info);
        done(err);
      })
    });
    it('should work for all and everything', function (done) {
      travelLogModel.getAllLogEntries(gameId, null, (err, info) => {
        console.log(info);
        done(err);
      })
    });

  });

});
