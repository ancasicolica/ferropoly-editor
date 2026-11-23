const assert        = require('node:assert/strict');
const crypto        = require('crypto');
const {DateTime}    = require('luxon');
const gameplayModel = require('../../common/models/gameplayModel');
const propertyModel = require('../../common/models/propertyModel');
const userModel     = require('../../common/models/userModel');

describe('Gameplay export', () => {
  const originalGetGameplay   = gameplayModel.getGameplay;
  const originalGetProperties = propertyModel.getPropertiesForGameplay;
  const originalGetUser       = userModel.getUserByMailAddress;
  let exportGameplay;
  let calls;

  before(() => {
    propertyModel.getPropertiesForGameplay = async (...args) => {
      calls.push(['properties', ...args]);
      return [{location: {uuid: 'station-1', name: 'Private'}, pricelist: {price: 100}, secret: true}];
    };
    userModel.getUserByMailAddress = async (...args) => {
      calls.push(['user', ...args]);
      return {personalData: {forename: 'Ada', surname: 'Lovelace'}};
    };
    exportGameplay = require('../../editor/lib/export');
  });

  beforeEach(() => {
    calls = [];
    gameplayModel.getGameplay = async (...args) => {
      calls.push(['gameplay', ...args]);
      return {gameParams: {name: 'Test'}, internal: {map: 'map-1', secret: true}};
    };
  });

  after(() => {
    gameplayModel.getGameplay = originalGetGameplay;
    propertyModel.getPropertiesForGameplay = originalGetProperties;
    userModel.getUserByMailAddress = originalGetUser;
    delete require.cache[require.resolve('../../editor/lib/export')];
  });

  it('creates a signed file containing only the exported gameplay and property fields', async () => {
    const buffer = await exportGameplay('game-1', 'user@example.com');
    const result = JSON.parse(buffer.toString());
    const data   = JSON.parse(Buffer.from(result.data, 'base64').toString());

    assert.equal(result.version, 1);
    assert.equal(result.meta.creator, 'Ada Lovelace');
    assert.ok(DateTime.fromISO(result.meta.date).isValid);
    assert.equal(result.meta.signature, crypto.createHash('sha256').update(result.data).digest('hex'));
    assert.deepEqual(data, {
      gameplay: {gameParams: {name: 'Test'}, internal: {map: 'map-1'}},
      properties: [{location: {uuid: 'station-1'}, pricelist: {price: 100}}]
    });
    assert.deepEqual(calls, [
      ['gameplay', 'game-1', 'user@example.com'],
      ['properties', 'game-1', {lean: true}],
      ['user', 'user@example.com']
    ]);
  });

  it('propagates a failed gameplay lookup', async () => {
    gameplayModel.getGameplay = async () => { throw new Error('Spiel nicht gefunden'); };
    await assert.rejects(exportGameplay('missing', 'user@example.com'), /Spiel nicht gefunden/);
  });
});