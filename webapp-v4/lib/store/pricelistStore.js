/**
 * Store for the pricelist
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.01.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {useGameplayStore} from './GamePlayStore';

export const usePricelistStore = defineStore('PricelistStore', {
  state:   () => ({
    gameUrl:   '',
    pricelist: []
  }),
  getters: {},
  actions: {
    async fetchPricelist(gameId) {
      console.log(`Fetching pricelist for ${gameId}`);
      const resp = await axios.get(`/pricelist/get/${gameId}`)
      console.log(resp.data);
      this.pricelist = resp.data.pricelist;
      this.gameUrl   = resp.data.gameUrl;

      useGameplayStore().setGameplayData(resp.data.gameplay);
    }
  }
})
