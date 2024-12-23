/**
 * The Auth Token Store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 23.12.2024
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {get} from 'lodash'

export const useAuthTokenStoreStore = defineStore('AuthTokenStore', {
  state:   () => ({
    authToken: 'none'
  }),
  getters: {},
  actions: {
    async getAuthToken() {
      const result = await axios.get('/authtoken');
      console.log('Authtoken', result.data);
      return get(result, 'data.authToken', 'nix-da');
    }
  }
})
