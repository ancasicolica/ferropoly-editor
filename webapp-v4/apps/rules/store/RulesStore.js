/**
 * Rules store for the Editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 15.02.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {getAuthToken} from '../../../common/adapters/authToken';

export const useRulesStore = defineStore('Rules', {
  state:   () => ({
    editAllowed: false,
    raw:         '',
    rawOriginal: '',
    gameId:      '',
    text:        '',
  }),
  getters: {},
  actions: {
    /**
     * Fetches the rules for the specified game ID from the server and processes the response.
     *
     * @param {string} gameId - The unique identifier of the game whose rules need to be fetched.
     * @return {Promise<void>} A Promise that resolves when the rules are successfully fetched and processed.
     */
    async fetchRules(gameId) {
      const loadedRules = await axios.get(`/rules/data/${gameId}`);
      console.log(loadedRules.data);
      this.editAllowed = loadedRules.data.editAllowed || false;
      this.raw         = loadedRules.data?.rules.raw;
      this.rawOriginal = loadedRules.data?.rules.raw;
      this.text        = loadedRules.data?.rules.text;
      this.gameId      = gameId;
    },
    /**
     * Saves the current rules for a specific game using an HTTP POST request.
     * If the `editAllowed` property is `false`, the save operation is skipped, and a warning is logged.
     * The method retrieves an authentication token before sending the request.
     *
     * @return {Promise<void>} A Promise that resolves when the save operation is complete.
     */
    async saveRules() {
      if (!this.editAllowed) {
        console.warn('Saving not allowed');
        return;
      }
      const authToken  = await getAuthToken();
      const res        = await axios.post(`/rules/raw/${this.gameId}`, {
        raw: this.raw,
        authToken
      });
      this.rawOriginal = this.raw;
      this.text        = res.data?.text;
    },

    async resetRules() {
      if (!this.editAllowed) {
        console.warn('resetting not allowed');
        return;
      }
      const authToken  = await getAuthToken();
      const res        = await axios.post(`/rules/reset/${this.gameId}`, {
        authToken
      });
      this.raw         = res.data?.raw;
      this.rawOriginal = res.data?.raw;
      this.text        = res.data?.text;
    }
  },
})
