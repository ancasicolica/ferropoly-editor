/**
 * The store for the challenges
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/

import {defineStore} from 'pinia'
import {ref} from 'vue'
import axios from 'axios';

export const useChallengesStore = defineStore('Challenges', () => {
  const gameId       = ref('')
  const challenges  = ref([]);

  async function fetchData(_gameId) {
    gameId.value = _gameId;

   const resp = await axios.get(`/challenges/all/${_gameId}`);
   challenges.value = resp.data;
   console.log('challenges read', challenges.value);
  }

  return {gameId, challenges, fetchData}
})
