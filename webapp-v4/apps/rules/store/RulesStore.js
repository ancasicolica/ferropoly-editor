/**
 * Rules store for the Editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 15.02.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';

export const useRulesStore = defineStore('Rules', {
  state:   () => ({
    editAllowed: false,
    raw:         ''
  }),
  getters: {},
  actions: {
    async fetchRules(gameId) {
      const loadedRules = await axios.get(`/rules/data/${gameId}`);
      console.log(loadedRules.data);
      this.editAllowed = loadedRules.data.editAllowed || false;
      this.raw         = loadedRules.data?.rules.raw;
    }
  }
})
