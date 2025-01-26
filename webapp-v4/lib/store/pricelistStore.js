/**
 * Store for the pricelist
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.01.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {useGameplayStore} from './GamePlayStore';
import {useAuthTokenStoreStore} from '../../common/store/authTokenStore';

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
    },
    async finalizeGameplay(){
      try {
        const authToken = await useAuthTokenStoreStore().getAuthToken();
        const id = useGameplayStore().gameId;
        const resp = await axios.post('/gameplay/finalize', {gameId:id, authToken});
        const statusCode = resp.status;
        if (statusCode !== 200) {
          console.log(resp, resp.data);
          return {success: false, message: `Status Code ist ${statusCode}`};
        }
        return {success: true};
      }
      catch(err) {
        console.error(err, err.response);
        const info = err.response?.data.message;
        console.info(info);
        return {success: false, message:info};
      }
    }
  }
})
