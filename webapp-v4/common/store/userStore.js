/**
 * A store containing the user information about the user being logged in
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.05.2024
 **/

import {defineStore} from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state  : () => ({
    personalData: {
      forename: '',
      surename: '',
      email   : undefined,
      avatar  : undefined
    },
    roles       : {
      admin : false,
      editor: false,
      player: true
    },
    info        : {
      registrationDate: undefined,
      lastLogin       : undefined,
      agbAccepted     : undefined,
      generatedAvatar : undefined,
      facebook        : {},
      google          : {}
    },
    dataLoaded  : false,
  }),
  getters: {},
  actions: {
    async fetchUserData() {
      axios.get('/userinfo')
        .then(resp => {
          this.personalData = resp.data.info.personalData;
          this.roles        = resp.data.info.roles;
          this.info         = resp.data.info.info;
          this.dataLoaded   = true;
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
})
