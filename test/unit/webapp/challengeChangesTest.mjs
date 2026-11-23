import assert from 'node:assert/strict';
import {test} from 'node:test';
import {computed, reactive} from 'vue';
import {createChallengeTracker} from '../../../webapp-v4/common/lib/challengeChanges.js';

const challenge = () => reactive({
  _id: 'challenge-1',
  title: 'Eine Challenge',
  schedule: {start: new Date('2026-11-20T10:00:00.000Z')},
  proof: {picture: true},
  reward: {min: 1000}
});

test('erkennt Änderungen an geladenen Challenges und eine Rücknahme', () => {
  const tracker = createChallengeTracker();
  const loaded = challenge();
  const unsaved = computed(() => tracker.isUnsaved(loaded));
  tracker.markSaved(loaded);
  assert.equal(unsaved.value, false);

  loaded.title = 'Neuer Titel';
  assert.equal(unsaved.value, true);
  loaded.title = 'Eine Challenge';
  assert.equal(unsaved.value, false);

  loaded.proof.picture = false;
  assert.equal(unsaved.value, true);
  tracker.markSaved(loaded);
  assert.equal(unsaved.value, false);

  loaded.schedule.start = new Date('2026-11-20T11:00:00.000Z');
  assert.equal(unsaved.value, true);
});

test('neue und nicht erfolgreich gespeicherte Challenges bleiben ungespeichert', () => {
  const tracker = createChallengeTracker();
  const newChallenge = challenge();
  newChallenge._id = null;
  assert.equal(tracker.isUnsaved(newChallenge), true);

  newChallenge._id = 'challenge-2';
  tracker.markSaved(newChallenge);
  assert.equal(tracker.isUnsaved(newChallenge), false);

  const loaded = challenge();
  tracker.markSaved(loaded);
  loaded.reward.min = 2000;
  assert.equal(tracker.isUnsaved(loaded), true);
  assert.equal(tracker.isUnsaved(newChallenge), false);
  loaded.reward.min = 1000;
  assert.equal(tracker.isUnsaved(loaded), false);
});