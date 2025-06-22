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
  before(async function () {
    await db.init(settings);
  });

  // Close DB afterwards
  after(async function () {
    await db.close();
  });

  let totalLocationNb = 0;
  it('should return all documents in a lean way', async () => {
    const data      = await locations.getAllLocationsLean();
    totalLocationNb = data.length;
    expect(totalLocationNb > 1000);
    expect(data[0]._id).to.be(undefined);

  })
  it('should return all documents as model', async () => {
    const data = await locations.getAllLocationsAsModel();
    expect(data.length > 1000);
    expect(data[0]._id).to.be.a('object');
  })
  it('should return all locations for a map', async () => {
    const data = await locations.getAllLocationsForMap('zvv');
    expect(data.length < totalLocationNb);
  })
  it('should return the number of locations for a map', async () => {
    const data = await locations.countLocations();
      expect(data).to.be.a('object');
      expect(data.maps[0].locationNb).to.be.a('number');
  })
  it('should return a single location', async () => {
    const data = await locations.getLocationByUuid('2a3f232a-438a-421d-ca8f-f574c6d6c991');
      console.log(data);
      expect(data.name).to.be('Riedern GL, Post');

  })
})
