/**
 * Gameplay Module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import {getField, updateField} from 'vuex-map-fields';
import {DateTime} from 'luxon';

const gameplay = {
  state    : () => ({
    gamename  : '',
    owner     : {
      organisatorName : '',
      organisation    : '',
      organisatorEmail: '',
      organisatorPhone: ''
    },
    scheduling: {
      gameDate : DateTime.now(),
      gameStart: '',
      gameEnd  : '',
      deleteTs : ''
    },
    gameParams: {
      interestInterval: 0,
      interest        : 0,
      properties      : {
        lowestPrice               : 0,
        highestPrice              : 0,
        numberOfPriceLevels       : 0,
        numberOfPropertiesPerGroup: 0
      }
    },
    log       : {
      created   : '',
      lastEdited: ''
    },
    internal  : {
      gameId: '',
      map   : '',
      owner : ''
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
