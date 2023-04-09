/**
 * Testing location model, this is done on real data (nothing is written into the db)
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.04.23
 **/
const expect    = require('expect.js');
const db        = require('./../../../../common/lib/ferropolyDb');
const locations = require('./../../../../common/models/locationModel');
const settings  = require('./../../../../editor/settings');
describe('Location Model test', () => {
  before(function (done) {
    db.init(settings, done);
  });

  // Close DB afterwards
  after(function (done) {
    db.close(done);
  });

  let totalLocationNb = 0;
  it('should return all documents in a lean way', done => {
    locations.getAllLocations((err, data) => {
      totalLocationNb = data.length;
      expect(totalLocationNb > 1000);
      expect(data[0]._id).to.be(undefined);
      done(err);
    })
  })
  it('should return all documents as model', done => {
    locations.getAllLocationsAsModel((err, data) => {
      expect(data.length > 1000);
      expect(data[0]._id).to.be.a('object');
      done(err);
    })
  })
  it('should return all locations for a map', done => {
    locations.getAllLocationsForMap('zvv', (err, data) => {
      expect(data.length < totalLocationNb);
      done(err);
    })
  })
  it('should return a single location', done => {
    locations.getLocationByUuid('2a3f232a-438a-421d-ca8f-f574c6d6c991', (err, data) => {
      console.log(data);
      expect(data.name).to.be('Riedern GL, Post');
      done(err);
    })
  })
})
