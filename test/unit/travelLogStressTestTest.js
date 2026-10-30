const assert         = require('node:assert/strict');
const ferropolyDb    = require('../../common/lib/ferropolyDb');
const gameplayModel = require('../../common/models/gameplayModel');
const teamModel     = require('../../common/models/teamModel');
const travelLog     = require('../../common/models/travelLogModel');
const {main}        = require('../../bin/travelLogStressTest');

describe('Travel log stress test', function () {
  let original;
  let batches;
  let closed;

  beforeEach(function () {
    original = {
      init:        ferropolyDb.init,
      close:       ferropolyDb.close,
      getGameplay: gameplayModel.getGameplay,
      getTeams:    teamModel.getTeams,
      insertMany:  travelLog.Model.insertMany
    };
    batches = [];
    closed  = 0;
    ferropolyDb.init = async () => {};
    ferropolyDb.close = async () => { closed++; };
    gameplayModel.getGameplay = async () => ({internal: {gameId: 'test-game'}});
    teamModel.getTeams = async () => [{uuid: 'team-a'}, {uuid: 'team-b'}];
    travelLog.Model.insertMany = async entries => { batches.push(entries); };
  });

  afterEach(function () {
    ferropolyDb.init = original.init;
    ferropolyDb.close = original.close;
    gameplayModel.getGameplay = original.getGameplay;
    teamModel.getTeams = original.getTeams;
    travelLog.Model.insertMany = original.insertMany;
  });

  it('adds the requested number of marked entries for every team', async function () {
    await main({gameId: 'test-game', nb: 3});
    const entries = batches.flat();
    assert.equal(entries.length, 6);
    assert.equal(entries.filter(entry => entry.teamId === 'team-a').length, 3);
    assert.equal(entries.filter(entry => entry.teamId === 'team-b').length, 3);
    assert.equal(new Set(entries.map(entry => entry._id)).size, 6);
    assert(entries.every(entry => entry.gameId === 'test-game' && entry.test === true));
    assert(entries.every(entry => entry.position && entry.timestamp instanceof Date));
    assert.equal(closed, 1);
  });

  it('rejects invalid arguments without connecting to the database', async function () {
    ferropolyDb.init = async () => { throw new Error('should not connect'); };
    for (const options of [{gameId: '', nb: 2}, {gameId: 'test-game', nb: 0},
      {gameId: 'test-game', nb: 1.5}, {gameId: 'test-game', nb: 'abc'}]) {
      await assert.rejects(main(options));
    }
    assert.equal(closed, 0);
    assert.equal(batches.length, 0);
  });

  it('does not write entries when the gameplay does not exist', async function () {
    gameplayModel.getGameplay = async () => { throw new Error('not found'); };
    await assert.rejects(main({gameId: 'missing', nb: 2}), /not found/);
    assert.equal(batches.length, 0);
    assert.equal(closed, 1);
  });

  it('limits batch size and closes the connection after a write error', async function () {
    teamModel.getTeams = async () => [{uuid: 'team-a'}];
    await main({gameId: 'test-game', nb: 501});
    assert.deepEqual(batches.map(batch => batch.length), [500, 1]);

    travelLog.Model.insertMany = async () => { throw new Error('write failed'); };
    await assert.rejects(main({gameId: 'test-game', nb: 1}), /write failed/);
    assert.equal(closed, 2);
  });
});