/**
 * The store for the challenges
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/

import {defineStore} from 'pinia'
import {ref} from 'vue'
import axios from 'axios';
import {createNewChallenge} from '../lib/Challenge';
import {onGameDate} from '../lib/challengeSchedule';
import {getAuthToken} from '../adapters/authToken';
import {createChallengeTracker} from '../lib/challengeChanges';

export const useChallengesStore = defineStore('Challenges', () => {
  const gameId           = ref('')
  const gameDate         = ref(null);
  const gameStart        = ref(null);
  const gameEnd          = ref(null);
  const challenges       = ref([]);
  const currentChallenge = ref(null);
  let challengeTracker   = createChallengeTracker();

  /**
   * Fetches the data from the server
   * @param _gameId
   * @return {Promise<void>}
   */
  async function fetchData(_gameId) {
    gameId.value               = _gameId;
    gameDate.value             = null;
    gameStart.value            = null;
    gameEnd.value              = null;
    challenges.value           = [];
    currentChallenge.value     = null;
    challengeTracker           = createChallengeTracker();
    const [resp, gameplayResp] = await Promise.all([
      axios.get(`/challenges/all/${_gameId}`),
      axios.get(`/gameplay/info/${_gameId}`)
    ]);
    gameDate.value             = new Date(gameplayResp.data.scheduling.gameDate);
    gameStart.value            = gameplayResp.data.scheduling.gameStart;
    gameEnd.value              = gameplayResp.data.scheduling.gameEnd;
    if (Number.isNaN(gameDate.value.getTime())) {
      gameDate.value = null;
      throw new Error('Der Spieltag ist ungültig.');
    }
    challenges.value       = resp.data.map(challenge => ({
      ...challenge,
      schedule: {
        start: onGameDate(gameDate.value, challenge.schedule?.start),
        end:   onGameDate(gameDate.value, challenge.schedule?.end)
      }
    }));
    challenges.value.forEach(challenge => challengeTracker.markSaved(challenge));
    currentChallenge.value = challenges.value[0] ?? null;
    console.log('challenges read', challenges.value);
  }

  /**
   * Adds a new challenge
   */
  function addNewChallenge() {
    const challenge = createNewChallenge(gameId.value, {title: `Challenge ${challenges.value.length + 1}`});
    challenges.value.push(challenge);
    currentChallenge.value = challenge;
  }

  function isChallengeUnsaved(challenge) {
    return challengeTracker.isUnsaved(challenge);
  }

  /**
   * Saves the current challenge
   * @return {Promise<*|Challenge>}
   */
  async function saveCurrentChallenge() {
    const challenge = currentChallenge.value;
    if (!challenge) {
      return;
    }
    const authToken = await getAuthToken();
    console.log('Saving challenge', gameId.value);
    const resp = await axios.post(`/challenges/${gameId.value}`, {authToken, challenge});
    Object.assign(challenge, resp.data);
    challengeTracker.markSaved(challenge);
    return challenge;
  }

  async function deleteCurrentChallenge() {
    const challenge = currentChallenge.value;
    if (!challenge) return;
    if (challenge._id) {
      const authToken = await getAuthToken();
      await axios.delete(`/challenges/${gameId.value}/${challenge._id}`, {data: {authToken}});
    }
    const index = challenges.value.indexOf(challenge);
    if (index !== -1) {
      challenges.value.splice(index, 1);
      if (currentChallenge.value === challenge) {
        currentChallenge.value = challenges.value[index] ?? challenges.value[index - 1] ?? null;
      }
    }
  }

  return {gameId, gameDate, gameStart, gameEnd, challenges, fetchData, currentChallenge, addNewChallenge, saveCurrentChallenge, deleteCurrentChallenge, isChallengeUnsaved}
})
