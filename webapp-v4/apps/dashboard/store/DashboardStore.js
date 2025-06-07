/**
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 07.06.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {get} from 'lodash';

export const useDashboardStore = defineStore('Dashboard', {
  state:   () => ({
    registeredUsers: 0
  }),
  getters: {},
  actions: {
    async fetchData() {
      const userResp = await axios.get('/dashboard/users')
      this.registeredUsers = get(userResp, 'data.userNb', 0);
    }
  }
})
