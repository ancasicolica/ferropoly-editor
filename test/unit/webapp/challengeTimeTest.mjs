import assert from 'node:assert/strict';
import {test} from 'node:test';
import {onGameDate, defaultChallengeTime, defaultChallengeStart, isChallengeStartInPast, challengeEndForDuration, challengeDuration} from '../../../webapp-v4/common/lib/challengeSchedule.js';

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

test('erkennt nur Challenge-Beginne vor dem aktuellen Zeitpunkt als vergangen', () => {
  const now = new Date(2026, 10, 21, 12, 45).getTime();
  assert.equal(isChallengeStartInPast(new Date(2026, 10, 20, 23, 59), now), true);
  assert.equal(isChallengeStartInPast(new Date(now - 1), now), true);
  assert.equal(isChallengeStartInPast(new Date(now), now), false);
  assert.equal(isChallengeStartInPast(new Date(now + 1), now), false);
  assert.equal(isChallengeStartInPast(new Date(2026, 10, 22, 8), now), false);
  assert.equal(isChallengeStartInPast(null, now), false);
  assert.equal(isChallengeStartInPast('ungültig', now), false);
});

test('schlägt an anderen Spieltagen 12:00 als Beginn vor', () => {
  const now = new Date(2026, 10, 21, 13, 2);
  const start = defaultChallengeStart(new Date(2026, 10, 22), now);
  assert.equal(start.getHours(), 12);
  assert.equal(start.getMinutes(), 0);
  assert.equal(start.getDate(), 22);
  assert.equal(defaultChallengeStart(null, now), null);
});

test('rundet den Beginn heute auf die nächste halbe Stunde', () => {
  const day = new Date(2026, 10, 21);
  for (const [hour, minute, second, expectedHour, expectedMinute] of [
    [13, 2, 0, 13, 30], [13, 30, 0, 13, 30], [13, 30, 1, 14, 0], [13, 59, 59, 14, 0]
  ]) {
    const now = new Date(2026, 10, 21, hour, minute, second);
    const start = defaultChallengeStart(day, now);
    assert.equal(start.getHours(), expectedHour);
    assert.equal(start.getMinutes(), expectedMinute);
    assert.equal(start.getSeconds(), 0);
    assert.equal(isChallengeStartInPast(start, now), false);
  }
  assert.equal(defaultChallengeStart(day, new Date(2026, 10, 21, 23, 45)), null);
});

test('berechnet feste Challenge-Dauern ohne Kürzung am Spielende', () => {
  const day = new Date(2026, 10, 20);
  const start = new Date(2026, 10, 20, 10, 30);
  for (const minutes of [15, 30, 60, 90, 120, 180]) {
    const end = challengeEndForDuration(day, start, minutes, '08:00', '18:00');
    assert.equal(end.getTime() - start.getTime(), minutes * 60 * 1000);
    assert.equal(challengeDuration(day, start, end, '18:00'), minutes);
  }
  assert.equal(challengeEndForDuration(day, new Date(2026, 10, 20, 17, 45), 30, '08:00', '18:00'), null);
});

test('Bis Spielende verwendet das tatsächliche Spielende und benötigt mindestens 15 Minuten', () => {
  const day = new Date(2026, 10, 20);
  const start = new Date(2026, 10, 20, 16, 45);
  const end = challengeEndForDuration(day, start, 'gameEnd', '08:00', '18:00');
  assert.equal(end.getHours(), 18);
  assert.equal(end.getMinutes(), 0);
  assert.equal(challengeDuration(day, start, end, '18:00'), 'gameEnd');
  assert.equal(challengeEndForDuration(day, new Date(2026, 10, 20, 17, 45), 'gameEnd', '08:00', '18:00').getTime() -
      new Date(2026, 10, 20, 17, 45).getTime(), 15 * 60 * 1000);
  assert.equal(challengeEndForDuration(day, new Date(2026, 10, 20, 17, 46), 'gameEnd', '08:00', '18:00'), null);
});

test('ungültige Spielzeiten und nicht angebotene Dauern werden nicht übernommen', () => {
  const day = new Date(2026, 10, 20);
  const start = new Date(2026, 10, 20, 10);
  assert.equal(challengeEndForDuration(day, start, 45, '08:00', '18:00'), null);
  assert.equal(challengeEndForDuration(day, start, 60, '08:00', null), null);
  assert.equal(challengeEndForDuration(day, new Date(2026, 10, 20, 7), 60, '08:00', '18:00'), null);
  assert.equal(challengeDuration(day, start, new Date(2026, 10, 20, 10, 45), '18:00'), null);
  assert.equal(challengeDuration(day, start, null, '18:00'), null);
});