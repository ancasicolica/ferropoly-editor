const assert         = require('node:assert/strict');
const {Settings}     = require('luxon');
const ferropolyDb    = require('../../common/lib/ferropolyDb');
const gameplayModel = require('../../common/models/gameplayModel');
const teamModel     = require('../../common/models/teamModel');
const travelLog     = require('../../common/models/travelLogModel');
const {main}        = require('../../bin/travelLogStressTest');

describe('Travel log stress test', function () {
  let original;
  let batches;
  let closed;
  let deletions;
  let operations;
  let originalNow;

  beforeEach(function () {
    original = {
      init:        ferropolyDb.init,
      close:       ferropolyDb.close,
      getGameplay: gameplayModel.getGameplay,
      getTeams:    teamModel.getTeams,
      insertMany:  travelLog.Model.insertMany,
      deleteMany:  travelLog.Model.deleteMany
    };
    batches = [];
    closed  = 0;
    deletions = [];
    operations = [];
    originalNow = Settings.now;
    ferropolyDb.init = async () => {};
    ferropolyDb.close = async () => { closed++; };
    gameplayModel.getGameplay = async () => ({
      internal: {gameId: 'test-game'}, scheduling: {gameStartTs: new Date('2020-01-01T00:00:00.000Z')}
    });
    teamModel.getTeams = async () => [{uuid: 'team-a'}, {uuid: 'team-b'}];
    travelLog.Model.insertMany = async entries => { operations.push('insert'); batches.push(entries); };
    travelLog.Model.deleteMany = async filter => {
      operations.push('delete');
      deletions.push(filter);
    };
  });

  afterEach(function () {
    ferropolyDb.init = original.init;
    ferropolyDb.close = original.close;
    gameplayModel.getGameplay = original.getGameplay;
    teamModel.getTeams = original.getTeams;
    travelLog.Model.insertMany = original.insertMany;
    travelLog.Model.deleteMany = original.deleteMany;
    Settings.now = originalNow;
  });

  it('removes only old test entries for the chosen game before inserting new ones', async function () {
    await main({gameId: 'test-game', nb: 1});
    assert.deepEqual(deletions, [{gameId: 'test-game', test: true}]);
    assert.deepEqual(operations, ['delete', 'insert', 'insert']);
    assert.equal(closed, 1);
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

  it('draws separate west-to-east zigzag tracks for each team', async function () {
    await main({gameId: 'test-game', nb: 5});
    const entries = batches.flat();
    const tracks = ['team-a', 'team-b'].map(teamId => entries.filter(entry => entry.teamId === teamId));

    for (const track of tracks) {
      assert(track.every(entry => entry.position.lng >= 5.95 && entry.position.lng <= 10.5));
      assert(track.every(entry => entry.position.lat >= 46 && entry.position.lat <= 47.8));
      assert(track.every((entry, index) => index === 0 || entry.position.lng > track[index - 1].position.lng));
      assert(track.every((entry, index) => index === 0 || entry.position.lat !== track[index - 1].position.lat));
      assert(track.every((entry, index) => index === 0 || entry.timestamp > track[index - 1].timestamp));
      assert.equal(track[0].position.lat, track[2].position.lat);
      assert.equal(track[1].position.lat, track[3].position.lat);
    }
    assert(tracks[0].every(a => tracks[1].every(b => a.position.lat < b.position.lat)));
  });

  it('distributes timestamps evenly from game start to now for each team and across batches', async function () {
    const start = Date.parse('2020-01-01T00:00:00.000Z');
    const now = Date.parse('2020-01-01T01:00:00.000Z');
    Settings.now = () => now;
    await main({gameId: 'test-game', nb: 501});

    for (const teamId of ['team-a', 'team-b']) {
      const track = batches.flat().filter(entry => entry.teamId === teamId);
      assert.equal(track.length, 501);
      for (let i = 0; i < track.length; i++) {
        assert.equal(track[i].timestamp.getTime(), start + i * (now - start) / 500);
      }
    }
  });

  it('places a single entry at game start', async function () {
    Settings.now = () => Date.parse('2020-01-01T01:00:00.000Z');
    await main({gameId: 'test-game', nb: 1});
    assert(batches.flat().every(entry => entry.timestamp.getTime() === Date.parse('2020-01-01T00:00:00.000Z')));
  });

  it('does not remove entries when the game start is missing or in the future', async function () {
    Settings.now = () => Date.parse('2020-01-01T01:00:00.000Z');
    for (const gameStartTs of [undefined, new Date('2020-01-01T02:00:00.000Z')]) {
      gameplayModel.getGameplay = async () => ({scheduling: {gameStartTs}});
      await assert.rejects(main({gameId: 'test-game', nb: 2}), /game start/i);
    }
    assert.equal(deletions.length, 0);
    assert.equal(batches.length, 0);
    assert.equal(closed, 2);
  });

  it('rejects invalid arguments without connecting to the database', async function () {
    ferropolyDb.init = async () => { throw new Error('should not connect'); };
    for (const options of [{gameId: '', nb: 2}, {gameId: 'test-game', nb: 0},
      {gameId: 'test-game', nb: 1.5}, {gameId: 'test-game', nb: 'abc'}]) {
      await assert.rejects(main(options));
    }
    assert.equal(closed, 0);
    assert.equal(batches.length, 0);
    assert.equal(deletions.length, 0);
  });

  it('does not write entries when the gameplay does not exist', async function () {
    gameplayModel.getGameplay = async () => { throw new Error('not found'); };
    await assert.rejects(main({gameId: 'missing', nb: 2}), /not found/);
    assert.equal(batches.length, 0);
    assert.equal(deletions.length, 0);
    assert.equal(closed, 1);
  });

  it('does not insert new entries if removing old test entries fails', async function () {
    travelLog.Model.deleteMany = async () => { throw new Error('delete failed'); };
    await assert.rejects(main({gameId: 'test-game', nb: 2}), /delete failed/);
    assert.equal(batches.length, 0);
    assert.equal(closed, 1);
  });

  it('limits batch size and closes the connection after a write error', async function () {
    teamModel.getTeams = async () => [{uuid: 'team-a'}];
    await main({gameId: 'test-game', nb: 501});
    assert.deepEqual(batches.map(batch => batch.length), [500, 1]);
    assert(batches[1][0].position.lng > batches[0][499].position.lng);
    assert.notEqual(batches[1][0].position.lat, batches[0][499].position.lat);

    travelLog.Model.insertMany = async () => { throw new Error('write failed'); };
    await assert.rejects(main({gameId: 'test-game', nb: 1}), /write failed/);
    assert.equal(closed, 2);
  });
});