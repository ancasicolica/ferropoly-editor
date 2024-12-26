/**
 * This is the store for a gameplay
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2024
 **/

import {defineStore} from 'pinia'
import {DateTime} from 'luxon';
import axios from 'axios';
import {assign} from 'lodash';

import {gameplaySchema} from '../schemas/GamePlaySchemas';

export const useGameplayStore = defineStore('Gameplay', {
  state:   () => ({
    gamename:   '',
    owner:      {
      organisatorName:  '',
      organisation:     '',
      organisatorEmail: '',
      organisatorPhone: ''
    },
    scheduling: {
      gameDate:  DateTime.now(),
      gameStart: '',
      gameEnd:   '',
      deleteTs:  ''
    },
    gameParams: {
      startCapital:              0,
      interestInterval:          0,
      interest:                  0,
      interestCyclesAtEndOfGame: 0,
      debtInterest:              0,
      housePrices:               0,
      properties:                {
        lowestPrice:                0,
        highestPrice:               0,
        numberOfPriceLevels:        0,
        numberOfPropertiesPerGroup: 0
      },
      rentFactors:               {
        noHouse:              0,
        oneHouse:             0,
        twoHouses:            0,
        threeHouses:          0,
        fourHouses:           0,
        hotel:                0,
        allPropertiesOfGroup: 0
      },
      chancellery:               {
        minGambling:      0,
        maxGambling:      0,
        minLottery:       0,
        maxLottery:       0,
        maxJackpotSize:   0,
        probabilityWin:   0,
        probabilityLoose: 0
      }
    },
    log:        {
      created:    '',
      lastEdited: ''
    },
    internal:   {
      gameId: '',
      map:    '',
      owner:  ''
    },
    joining:    {
      possibleUntil: '',
      infotext:      '',
      url:           ''
    },
    mobile:     {
      level: 0
    }
  }),
  getters: {
    gameplayInvalid(state) {
      const result = gameplaySchema.safeParse(state);
      if (result.success) {
        return false;
      }
      console.log('GP is invalid', result);
      return result.error?.issues;
    }
  },
  actions: {
    async loadGameplay(gameId) {
      let resp = await axios.get(`/gameplay/load/${gameId}`);
      console.log('loaded', resp);
      assign(this, resp.data.gameplay);
      // Convert Times to JS Date objects
      this.scheduling.deleteTs = DateTime.fromISO(this.scheduling.deleteTs).toJSDate();
      this.scheduling.gameDate = DateTime.fromISO(this.scheduling.gameDate).toJSDate();

      const result = gameplaySchema.safeParse(this);
      console.log('Checked gameplay, result:', result);
    }
  }
})
