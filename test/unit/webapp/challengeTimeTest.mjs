import assert from 'node:assert/strict';
import {test} from 'node:test';
import {onGameDate, defaultChallengeTime} from '../../../webapp-v4/common/lib/challengeSchedule.js';

test('übernimmt nur Uhrzeit und Minuten auf den Spieltag', () => {
  const gameDate = new Date(2026, 10, 20);
  const selectedTime = new Date(2026, 10, 21, 14, 35, 42);
  const result = onGameDate(gameDate, selectedTime);
  assert.equal(result.getFullYear(), 2026);
  assert.equal(result.getMonth(), 10);
  assert.equal(result.getDate(), 20);
  assert.equal(result.getHours(), 14);
  assert.equal(result.getMinutes(), 35);
  assert.equal(result.getSeconds(), 0);
  assert.equal(result.getMilliseconds(), 0);
  assert.equal(gameDate.getHours(), 0);
});

test('übernimmt bereits gespeicherte ISO-Zeiten auf den Spieltag', () => {
  const stored = new Date(2026, 10, 19, 9, 15).toISOString();
  const result = onGameDate(new Date(2026, 10, 20), stored);
  assert.equal(result.getDate(), 20);
  assert.equal(result.getHours(), 9);
  assert.equal(result.getMinutes(), 15);
});

test('leere oder ungültige Zeiten liefern keinen Datumswert', () => {
  assert.equal(onGameDate(new Date(2026, 10, 20), null), null);
  assert.equal(onGameDate(null, new Date()), null);
  assert.equal(onGameDate('ungültig', new Date()), null);
  assert.equal(onGameDate(new Date(2026, 10, 20), 'ungültig'), null);
});

test('setzt das Ende standardmässig 60 Minuten nach dem Beginn, maximal bis Spielende', () => {
  const day = new Date(2026, 10, 20);
  const start = new Date(2026, 10, 20, 10, 30);
  assert.equal(defaultChallengeTime(day, start, 60, '08:00', '18:00').getHours(), 11);
  assert.equal(defaultChallengeTime(day, start, 60, '08:00', '18:00').getMinutes(), 30);
  assert.equal(defaultChallengeTime(day, new Date(2026, 10, 20, 17, 45), 60, '08:00', '18:00').getHours(), 18);
});

test('setzt den Beginn standardmässig 60 Minuten vor dem Ende, minimal bis Spielstart', () => {
  const day = new Date(2026, 10, 20);
  const end = new Date(2026, 10, 20, 12, 30);
  assert.equal(defaultChallengeTime(day, end, -60, '08:00', '18:00').getHours(), 11);
  assert.equal(defaultChallengeTime(day, end, -60, '08:00', '18:00').getMinutes(), 30);
  assert.equal(defaultChallengeTime(day, new Date(2026, 10, 20, 8, 15), -60, '08:00', '18:00').getHours(), 8);
});

test('verwirft fehlende Spielgrenzen und Werte ausserhalb des Spiels', () => {
  const day = new Date(2026, 10, 20);
  assert.equal(defaultChallengeTime(day, new Date(2026, 10, 20, 18, 30), 60, '08:00', '18:00'), null);
  assert.equal(defaultChallengeTime(day, new Date(2026, 10, 20, 7, 45), -60, '08:00', '18:00'), null);
  assert.equal(defaultChallengeTime(day, new Date(2026, 10, 20, 10), 60, '08:00', null), null);
});