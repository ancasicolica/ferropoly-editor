/**
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 07.06.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {get} from 'lodash';
import {DateTime} from 'luxon';

export const useDashboardStore = defineStore('Dashboard', {
  state:   () => ({
    registeredUsers: 0,
    locationInfo: {
      maps: []
    },
    gameplays: []
  }),
  getters: {},
  actions: {
    async fetchData() {
      const userResp = await axios.get('/dashboard/users')
      this.registeredUsers = get(userResp, 'data.userNb', 0);

      const locationResp = await axios.get('/locations/summary');
      this.locationInfo = get(locationResp, 'data');

      const gpResp = await axios.get('/dashboard/gameplays');
      this.gameplays = get(gpResp, 'data.gameplays');
      let today = DateTime.now();
      this.gameplays.forEach(gp => {
        let gameDate            = DateTime.fromISO(gp.scheduling.gameDate);
        let delta               = gameDate.diff(today, 'days').days;
        gp.scheduling.countdown = Math.ceil(delta);
      })
    }
  }
})
