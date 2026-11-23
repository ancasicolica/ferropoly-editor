const assert        = require('node:assert/strict');
const fs            = require('fs');
const locationModel = require('../../common/models/locationModel');
const userModel     = require('../../common/models/userModel');
const initRoutes    = require('../../editor/routes/locations');

describe('Location JSON height import', () => {
  const originalReadFile = fs.readFile;
  const originalGetUser  = userModel.getUserByMailAddress;
  const originalGet      = locationModel.getLocationByUuid;
  const originalSave     = locationModel.Model.prototype.save;
  const originalSaveLoc  = locationModel.saveLocation;
  const originalFind     = locationModel.Model.find;
  let handler;
  let storedLocation;
  let saves;
  let incomingLocation;
  let version;

  before(() => {
    initRoutes({use: () => {}, post: (path, middleware, route) => { handler = route; }});
  });

  beforeEach(() => {
    saves = 0;
    version = 1;
    incomingLocation = {
      name: 'Test', uuid: 'height-test', position: {lat: '47', lng: '8'},
      accessibility: 'bus', maps: {zvv: true}, height: 520.3
    };
    userModel.getUserByMailAddress = async () => ({roles: {admin: true}});
    locationModel.getLocationByUuid = async () => storedLocation;
    locationModel.Model.prototype.save = async function () {
      storedLocation = this;
      saves++;
    };
    locationModel.saveLocation = async () => { saves++; };
    fs.readFile = (path, encoding, callback) => callback(null, JSON.stringify({
      type: 'LocationDatabase', version, timestamp: new Date().toISOString(),
      locations: [incomingLocation]
    }));
  });

  afterEach(() => {
    fs.readFile = originalReadFile;
    userModel.getUserByMailAddress = originalGetUser;
    locationModel.getLocationByUuid = originalGet;
    locationModel.Model.prototype.save = originalSave;
    locationModel.saveLocation = originalSaveLoc;
    locationModel.Model.find = originalFind;
    storedLocation = null;
  });

  async function upload() {
    let response;
    await handler({file: {path: 'locations.json'}, session: {passport: {user: 'admin'}}}, {
      setHeader: () => {},
      send: data => { response = data; },
      status: code => { throw new Error(`Unexpected status ${code}`); }
    });
    return response;
  }

  it('stores the JSON height for a new location and exposes it in the model', async () => {
    version = 2026.11;
    const result = await upload();
    assert.equal(result.newLocations, 1);
    assert.equal(saves, 1);
    assert.equal(storedLocation.height, 520.3);
    assert.equal(storedLocation.toObject().height, 520.3);
  });

  it('updates existing heights, including zero, without erasing them when absent', async () => {
    storedLocation = new locationModel.Model({...incomingLocation, height: 400});
    incomingLocation.height = 0;
    const updated = await upload();
    assert.equal(updated.changedLocations, 1);
    assert.equal(storedLocation.height, 0);
    assert.equal(saves, 1);

    incomingLocation.maps = storedLocation.toObject().maps;
    delete incomingLocation.height;
    const unchanged = await upload();
    assert.equal(unchanged.unalteredLocations, 1);
    assert.equal(storedLocation.height, 0);
    assert.equal(saves, 1);
  });

  it('includes the height in the lean JSON export data', async () => {
    locationModel.Model.find = () => ({lean: () => ({exec: async () => [
      {name: 'Test', uuid: 'height-test', height: 520.3}
    ]})});
    const locations = await locationModel.getAllLocationsLean();
    assert.equal(locations[0].height, 520.3);
  });
});