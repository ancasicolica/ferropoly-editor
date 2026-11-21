'use strict';

const expect = require('expect.js');
const model = require('../../../../common/models/challengeModel');

describe('Challenge Model', function () {
  const {Challenge} = model;
  let originalFind;
  let originalFindOne;
  let originalSave;
  let originalFindOneAndDelete;
  let originalInsertOne;
  let originalUpdateOne;

  beforeEach(function () {
    originalFind = Challenge.find;
    originalFindOne = Challenge.findOne;
    originalSave = Challenge.prototype.save;
    originalFindOneAndDelete = Challenge.findOneAndDelete;
    originalInsertOne = Challenge.collection.insertOne;
    originalUpdateOne = Challenge.collection.updateOne;
  });

  afterEach(function () {
    Challenge.find = originalFind;
    Challenge.findOne = originalFindOne;
    Challenge.prototype.save = originalSave;
    Challenge.findOneAndDelete = originalFindOneAndDelete;
    Challenge.collection.insertOne = originalInsertOne;
    Challenge.collection.updateOne = originalUpdateOne;
  });

  it('loads the HTML description for the editor', async function () {
    const query = {
      select: function (projection) {
        expect(projection).to.be('+description');
        return this;
      },
      lean: function () { return this; },
      exec: async function () { return [{description: '<p>Aufgabe</p>'}]; }
    };
    Challenge.find = () => query;

    expect((await model.getChallenges('spiel'))[0].description).to.be('<p>Aufgabe</p>');
    expect((await model.getChallenge('spiel', 'id'))[0].description).to.be('<p>Aufgabe</p>');
  });

  it('creates a new challenge with a generated ID and preserves the HTML', async function () {
    Challenge.prototype.save = async function () {
      await this.validate();
      return this;
    };
    const saved = await model.updateChallenge('spiel', {
      _id: null,
      title: 'Aufgabe',
      description: '<p><strong>Text</strong></p>',
      schedule: {start: new Date('2026-11-20'), end: new Date('2026-11-21')}
    });

    expect(saved._id).to.be.ok();
    expect(saved.gameId).to.be('spiel');
    expect(saved.description).to.be('<p><strong>Text</strong></p>');
  });

  it('starts new challenges at revision 1 and ignores client-provided revisions', async function () {
    Challenge.collection.insertOne = async doc => {
      expect(doc.revision).to.be(1);
      return {acknowledged: true, insertedId: doc._id};
    };
    const saved = await model.createChallenge('spiel', {revision: 99, title: 'Aufgabe',
      schedule: {start: new Date('2026-11-20T10:00:00Z'), end: new Date('2026-11-20T11:00:00Z')}});
    expect(saved.revision).to.be(1);
  });

  it('increments the revision once per save, including legacy challenges without one', async function () {
    const existing = Challenge.hydrate({_id: '507f1f77bcf86cd799439011', gameId: 'spiel', title: 'Alt',
      schedule: {start: new Date('2026-11-20T10:00:00Z'), end: new Date('2026-11-20T11:00:00Z')}});
    Challenge.findOne = () => ({select: () => ({exec: async () => existing})});
    const revisions = [];
    Challenge.collection.updateOne = async (filter, update) => {
      revisions.push(update.$set.revision);
      return {acknowledged: true, matchedCount: 1, modifiedCount: 1};
    };
    const first = await model.updateChallenge('spiel', {_id: existing.id, revision: 99, title: 'Neu'});
    expect(first.revision).to.be(1);
    const second = await model.updateChallenge('spiel', {_id: existing.id, revision: -5, title: 'Nochmal'});
    expect(second.revision).to.be(2);
    expect(revisions).to.eql([1, 2]);
  });

  it('requires a duration of at least 15 minutes', async function () {
    const challenge = new Challenge({gameId: 'spiel', title: 'Aufgabe',
      schedule: {start: new Date('2026-11-20T10:00:00Z'), end: new Date('2026-11-20T10:14:00Z')}});
    try {
      await challenge.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.errors['schedule.end'].message).to.contain('15 Minuten');
    }

    challenge.schedule.end = new Date('2026-11-20T10:15:00Z');
    await challenge.validate();
  });

  it('updates an existing challenge without changing its game', async function () {
    const existing = {gameId: 'spiel', save: async function () { return this; }};
    Challenge.findOne = () => ({select: () => ({exec: async () => existing})});

    const saved = await model.updateChallenge('spiel', {_id: 'id', gameId: 'anderes-spiel', description: '<p>Neu</p>'});
    expect(saved.gameId).to.be('spiel');
    expect(saved.description).to.be('<p>Neu</p>');
  });

  it('does not create another challenge for an unknown existing ID', async function () {
    Challenge.findOne = () => ({select: () => ({exec: async () => null})});
    try {
      await model.updateChallenge('spiel', {_id: '507f1f77bcf86cd799439011'});
      throw new Error('Expected update to fail');
    } catch (err) {
      expect(err.message).to.be('Challenge not found');
    }
  });

  it('deletes only a challenge belonging to the game whose start is still in the future', async function () {
    const now = new Date('2026-11-20T12:00:00Z');
    Challenge.findOneAndDelete = filter => ({exec: async () => {
      expect(filter).to.eql({_id: 'id', gameId: 'spiel', 'schedule.start': {$gt: now}});
      return {_id: 'id'};
    }});
    expect(await model.deleteChallenge('spiel', 'id', now)).to.eql({_id: 'id'});
  });

  it('does not delete a challenge at its start time', async function () {
    const now = new Date('2026-11-20T12:00:00Z');
    Challenge.findOneAndDelete = filter => ({exec: async () => {
      expect(filter['schedule.start'].$gt).to.be(now);
      return null;
    }});
    expect(await model.deleteChallenge('spiel', 'id', now)).to.be(null);
  });
});