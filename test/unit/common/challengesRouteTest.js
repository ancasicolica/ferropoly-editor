'use strict';

const expect = require('expect.js');
const express = require('express');
const challenges = require('../../../common/models/challengeModel');
const gameplays = require('../../../common/models/gameplayModel');
const route = require('../../../common/routes/challenges');

describe('Challenge save route', function () {
  let server;
  let url;
  let session;
  let originalGetGameplay;
  let originalGetChallenge;
  let originalUpdateChallenge;
  let originalDeleteChallenge;

  before(async function () {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = session;
      next();
    });
    route.init(app, {});
    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    url = `http://127.0.0.1:${server.address().port}/challenges/spiel`;
  });

  after(async function () {
    await new Promise(resolve => server.close(resolve));
  });

  beforeEach(function () {
    session = {authToken: 'token', passport: {user: 'owner@example.ch'}};
    originalGetGameplay = gameplays.getGameplay;
    originalGetChallenge = challenges.getChallenge;
    originalUpdateChallenge = challenges.updateChallenge;
    originalDeleteChallenge = challenges.deleteChallenge;
  });

  afterEach(function () {
    gameplays.getGameplay = originalGetGameplay;
    challenges.getChallenge = originalGetChallenge;
    challenges.updateChallenge = originalUpdateChallenge;
    challenges.deleteChallenge = originalDeleteChallenge;
  });

  const post = async body => fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  it('rejects a missing or incorrect auth token', async function () {
    expect((await post({challenge: {title: 'Test'}})).status).to.be(401);
    expect((await post({authToken: 'invalid', challenge: {title: 'Test'}})).status).to.be(401);
  });

  it('rejects access to another user’s gameplay', async function () {
    gameplays.getGameplay = async () => { throw new Error('No access'); };
    const response = await post({authToken: 'token', challenge: {title: 'Test'}});
    expect(response.status).to.be(403);
  });

  it('saves only editable properties for an authorized gameplay', async function () {
    gameplays.getGameplay = async (id, owner) => {
      expect(id).to.be('spiel');
      expect(owner).to.be('owner@example.ch');
    };
    challenges.updateChallenge = async (id, challenge) => {
      expect(id).to.be('spiel');
      expect(challenge).to.eql({title: 'Test', description: '<p>Text</p>'});
      return {...challenge, _id: '507f1f77bcf86cd799439011', gameId: id};
    };
    const response = await post({authToken: 'token', challenge: {
      title: 'Test', description: '<p>Text</p>', gameId: 'other', createdAt: 'fake'
    }});
    expect(response.status).to.be(200);
    expect((await response.json()).description).to.be('<p>Text</p>');
  });

  it('does not save an unknown existing challenge', async function () {
    gameplays.getGameplay = async () => {};
    challenges.getChallenge = async () => [];
    challenges.updateChallenge = async () => { throw new Error('Unexpected save'); };
    const response = await post({authToken: 'token', challenge: {_id: '507f1f77bcf86cd799439011'}});
    expect(response.status).to.be(404);
  });

  const remove = (authToken = 'token') => fetch(`${url}/507f1f77bcf86cd799439011`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({authToken})
  });

  it('rejects deleting without an authorized session or gameplay', async function () {
    expect((await remove('invalid')).status).to.be(401);
    gameplays.getGameplay = async () => { throw new Error('No access'); };
    expect((await remove()).status).to.be(403);
  });

  it('deletes an authorized challenge before its start', async function () {
    gameplays.getGameplay = async () => {};
    challenges.deleteChallenge = async (gameId, id) => {
      expect(gameId).to.be('spiel');
      expect(id).to.be('507f1f77bcf86cd799439011');
      return {_id: id};
    };
    expect((await remove()).status).to.be(200);
  });

  it('rejects deleting a started challenge and an unknown challenge', async function () {
    gameplays.getGameplay = async () => {};
    challenges.deleteChallenge = async () => null;
    challenges.getChallenge = async () => [{_id: 'id'}];
    expect((await remove()).status).to.be(409);
    challenges.getChallenge = async () => [];
    expect((await remove()).status).to.be(404);
  });
});