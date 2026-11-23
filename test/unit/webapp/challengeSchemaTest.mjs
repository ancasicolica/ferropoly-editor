import assert from 'node:assert/strict';
import {test} from 'node:test';
import {challengeSchema} from '../../../webapp-v4/common/schemas/ChallengeSchema.js';

const validChallenge = () => ({
  _id: null,
  gameId: 'game-1',
  title: 'Eine Challenge',
  description: '<p>Eine ausführliche Beschreibung der Aufgabe für Teams.</p>',
  schedule: {start: '2026-11-20T10:00:00.000Z', end: new Date('2026-11-20T11:00:00.000Z')},
  proof: {picture: true, call: false, text: false},
  reward: {min: 1000, max: 10000},
  createdAt: null,
  updatedAt: null
});

test('akzeptiert eine Challenge mit Datumswerten vom Server und aus DatePicker', () => {
  assert.equal(challengeSchema.safeParse(validChallenge()).success, true);
});

test('verwirft fehlende Pflichtfelder und ungültige Datumswerte', () => {
  const challenge = validChallenge();
  challenge.title = '  ';
  challenge.gameId = '';
  challenge.schedule.start = null;
  const result = challengeSchema.safeParse(challenge);
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map(issue => issue.path.join('.')).sort(),
    ['gameId', 'schedule.start', 'title']);
});

test('verwirft ein Ende vor dem Beginn und eine invertierte Belohnung', () => {
  const challenge = validChallenge();
  challenge.schedule.end = new Date('2026-11-20T09:00:00.000Z');
  challenge.reward.min = 2000;
  challenge.reward.max = 1000;
  const result = challengeSchema.safeParse(challenge);
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map(issue => issue.path.join('.')).sort(),
    ['reward.max', 'schedule.end']);
});

test('fordert mindestens 15 Minuten Aktivität', () => {
  const challenge = validChallenge();
  challenge.schedule.end = new Date('2026-11-20T10:14:00.000Z');
  const result = challengeSchema.safeParse(challenge);
  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].path.join('.'), 'schedule.end');

  challenge.schedule.end = new Date('2026-11-20T10:15:00.000Z');
  assert.equal(challengeSchema.safeParse(challenge).success, true);
});

test('verwirft zu lange Titel und ungültige Zahlen', () => {
  const challenge = validChallenge();
  challenge.title = 'x'.repeat(101);
  challenge.reward.min = -1;
  challenge.reward.max = 1.5;
  const result = challengeSchema.safeParse(challenge);
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map(issue => issue.path.join('.')).sort(),
    ['reward.max', 'reward.min', 'title']);
});

test('validiert technische Felder und die Nachweis-Optionen', () => {
  const challenge = validChallenge();
  challenge._id = 123;
  challenge.createdAt = 'kein Datum';
  challenge.proof.call = 'true';
  const result = challengeSchema.safeParse(challenge);
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map(issue => issue.path.join('.')).sort(),
    ['_id', 'createdAt', 'proof.call']);
});

test('fordert mindestens eine Nachweis-Option', () => {
  const challenge = validChallenge();
  challenge.proof.picture = false;
  const result = challengeSchema.safeParse(challenge);
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map(issue => issue.path.join('.')), ['proof']);

  for (const key of ['picture', 'call', 'text']) {
    challenge.proof = {picture: false, call: false, text: false, [key]: true};
    assert.equal(challengeSchema.safeParse(challenge).success, true);
  }
});