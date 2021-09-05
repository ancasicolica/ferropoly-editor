/**
 * Gameplay Module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/
import {createHelpers} from 'vuex-map-fields';

const {getGameplayField, updateGameplayField} = createHelpers({
  getterType  : 'getGameplayField',
  mutationType: 'updateGameplayField'
});

import {DateTime} from 'luxon';
import {checkEmail, checkPhone} from '../../../common/lib/playerValidator';

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
      startCapital             : 0,
      interestInterval         : 0,
      interest                 : 0,
      interestCyclesAtEndOfGame: 0,
      debtInterest             : 0,
      housePrices              : 0,
      properties               : {
        lowestPrice               : 0,
        highestPrice              : 0,
        numberOfPriceLevels       : 0,
        numberOfPropertiesPerGroup: 0
      },
      rentFactors              : {
        noHouse             : 0,
        oneHouse            : 0,
        twoHouses           : 0,
        threeHouses         : 0,
        fourHouses          : 0,
        hotel               : 0,
        allPropertiesOfGroup: 0
      },
      chancellery              : {
        minLottery      : 0,
        maxLottery      : 0,
        maxJackpotSize  : 0,
        probabilityWin  : 0,
        probabilityLoose: 0
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
    },
    joining   : {
      possibleUntil: '',
      infotext     : ''
    },
    mobile    : {
      level: 0
    }
  }),
  getters  : {
    getGameplayField,

    gamenameValid        : state => {
      let len = state.gamename.length;
      return ((len > 3) && (len < 60));
    },
    organisatorNameValid : state => {
      let len = state.owner.organisatorName.length;
      return ((len > 3) && (len < 60));
    },
    organisationValid    : state => {
      let len = state.owner.organisation.length;
      return (len < 60);
    },
    organisatorEmailValid: state => {
      return checkEmail(state.owner.organisatorEmail);
    },
    organisatorPhoneValid: state => {
      return checkPhone(state.owner.organisatorPhone);
    },
    gameDurationValid    : state => {
      let start = DateTime.fromISO(state.scheduling.gameStart);
      let end   = DateTime.fromISO(state.scheduling.gameEnd);
      let diff  = end.diff(start, 'minutes');
      console.log('diff', diff.minutes);
      return diff.minutes >= 4 * 60;
    },
    basicFormValid       : (state, getters) => {
      return (getters.gamenameValid && getters.organisatorNameValid && getters.organisationValid &&
        getters.organisatorEmailValid && getters.organisatorPhoneValid && getters.gameDurationValid);
    }
  },
  mutations: {
    updateGameplayField,
    test(state, n) {
      state.gameParams.interestInterval = n;
    },
  }

};

export default gameplay;
