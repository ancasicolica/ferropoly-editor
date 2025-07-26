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
    editAllowed:       false,
    gamePlayFinalized: false,
    raw:               '',
    rawOriginal:       '',
    gameId:            '',
    released:          '',
    text:              '',
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
      this.editAllowed       = loadedRules.data.editAllowed || false;
      this.gamePlayFinalized = loadedRules.data.gamePlayFinalized || false;
      this.raw               = loadedRules.data?.rules.raw;
      this.rawOriginal       = loadedRules.data?.rules.raw;
      this.text              = loadedRules.data?.rules.text;
      this.released          = loadedRules.data?.rules.released;
      this.gameId            = gameId;
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
      const regex =  new RegExp('&nbsp;', 'gm');
      this.rawOriginal = _.replace(this.raw, regex, ' ');
      this.text        = _.replace(res.data?.text, this.regex, ' ');
    },

    /**
     * Resets the rules for the current game if editing is allowed.
     * Sends a request to reset the rules on the server and updates the relevant properties with the response data.
     * Logs a warning if resetting is not allowed.
     *
     * @return {Promise<void>} A promise that resolves when the rules have been reset and the data has been updated.
     */
    async resetRules() {
      if (!this.editAllowed) {
        console.warn('resetting not allowed');
        return;
      }
      const authToken  = await getAuthToken();
      const res        = await axios.post(`/rules/reset/${this.gameId}`, {
        authToken
      });
      const regex =  new RegExp('&nbsp;', 'gm');

      this.raw         = _.replace(res.data?.raw, regex, ' ');
      this.rawOriginal = _.replace(res.data?.raw, regex, ' ');
      this.text        = _.replace(res.data?.text, regex, ' ');
      this.released    = res.data?.released;
    },
    /**
     * Releases the rules for the current game identified by `this.gameId`.
     * Sends a POST request to the `/rules/release` endpoint with the necessary authentication token and text data.
     * Updates internal properties such as `raw`, `rawOriginal`, `text`, and `released` based on the response received.
     *
     * @return {Promise<void>} Resolves when the rules release is successfully completed.
     */
    async releaseRules() {
      const authToken  = await getAuthToken();
      const res        = await axios.post(`/rules/release/${this.gameId}`, {
        authToken
      });
      const regex =  new RegExp('&nbsp;', 'gm');

      this.raw         = _.replace(res.data?.raw, regex, ' ');
      this.rawOriginal = _.replace(res.data?.raw, regex, ' ');
      this.text        = _.replace(res.data?.text, regex, ' ');
      this.released    = res.data?.released;
    }

  },
})
