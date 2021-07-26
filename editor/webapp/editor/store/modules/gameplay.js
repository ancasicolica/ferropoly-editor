/**
 * Gameplay Module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import { getField, updateField } from 'vuex-map-fields';

const gameplay = {
  state    : () => ({
    gamename  : '',
    owner     : {
      organisatorName : '',
      organisation    : '',
      organisatorEmail: '',
      organisatorPhone: ''
    },
    gameParams: {
      interestInterval: 0,
      interest        : 0
    }
  }),
  getters  : {
    getField,
  },
  mutations: {
    updateField,
  }

};

export default gameplay;
