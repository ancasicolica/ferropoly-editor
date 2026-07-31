/**
 * The Auth Token Store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 23.12.2024
 **/

import { defineStore } from 'pinia';
import axios from 'axios';
import { get } from 'lodash';
import { DateTime } from 'luxon';

export const useAuthTokenStoreStore = defineStore('AuthTokenStore', {
  state: () => ({
    authToken: 'none',
    expiryDate: DateTime.now().minus({ hours: 1 }),
  }),
  getters: {},
  actions: {
    async getAuthToken() {
      if (this.expiryDate > DateTime.now()) {
        return this.authToken;
      } else {
        const result = await axios.get('/authtoken');
        this.authToken = result.data.authToken;
        this.expiryDate = DateTime.fromISO(result.data.expiryDate);
        console.log(
          `New authtoken ${this.authToken}, expires ${this.expiryDate.toISO()}`
        );
        return get(result, 'data.authToken', 'nix-da');
      }
    },
  },
});
