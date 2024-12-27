/**
 * This is the store for a gameplay
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2024
 **/

import {defineStore} from 'pinia'
import {DateTime} from 'luxon';
import axios from 'axios';
import {merge} from 'lodash';

import {
  gamenameSchema,
  gameplaySchema,
  organisationSchema,
  organisatorEmailSchema,
  organisatorPhoneSchema,
  organisatorNameSchema
} from '../schemas/GamePlaySchemas';

import {useAuthTokenStoreStore} from '../../common/store/authTokenStore';

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
      gameDate:  new Date(),
      gameStart: new Date(),
      gameEnd:   new Date(),
      deleteTs:  new Date(),
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
    /**
     * Validates the provided gameplay state against a predefined schema.
     *
     * @param {Object} state - The gameplay state object to be validated.
     * @return {undefined|Array} Returns undefined if the gameplay state is valid,
     * or an array of validation issues if the state is invalid.
     */
    gameplayInvalid(state) {
      const result = gameplaySchema.safeParse(state);
      if (result.success) {
        return undefined;
      }
      console.log('GP is invalid', result);
      return result.error?.issues;
    },
    organisatorNameValidation(state) {
      return organisatorNameSchema.safeParse(state.owner.organisatorName);
    },
    gamenameValidation(state) {
      return gamenameSchema.safeParse(state.gamename);
    },
    organisationValidation(state) {
      return organisationSchema.safeParse(state.owner.organisation);
    },
    organisatorEmailValidation(state) {
      return organisatorEmailSchema.safeParse(state.owner.organisatorEmail);
    },
    organisatorPhonelValidation(state) {
      return organisatorPhoneSchema.safeParse(state.owner.organisatorPhone);
    },
    gameTimesValidation(state) {
    return {success: state.scheduling.gameEnd > state.scheduling.gameStart};
    }
  },
  actions: {
    /**
     * Loads the gameplay data for the specified game ID.
     *
     * This method fetches gameplay data from the server, updates the current
     * gameplay instance with the fetched data, and converts specific fields
     * (like scheduling times) to JavaScript Date objects.
     *
     * Additionally, the loaded data is validated against the `gameplaySchema`.
     *
     * @param {string} gameId - The unique identifier of the game to load gameplay data for.
     * @return {Promise<void>} A promise that resolves once the gameplay data has been successfully loaded and
     *   processed.
     */
    async loadGameplay(gameId) {
      let resp = await axios.get(`/gameplay/load/${gameId}`);
      console.log('loaded', resp);
      merge(this, resp.data.gameplay);
      // Convert Times to JS Date objects
      this.scheduling.deleteTs  = DateTime.fromISO(this.scheduling.deleteTs).toJSDate();
      this.scheduling.gameDate  = DateTime.fromISO(this.scheduling.gameDate).toJSDate();
      this.scheduling.gameStart = DateTime.fromISO(this.scheduling.gameStart).toJSDate();
      this.scheduling.gameEnd   = DateTime.fromISO(this.scheduling.gameEnd).toJSDate();

      const result = gameplaySchema.safeParse(this);
      console.log('Checked gameplay, result:', result);
    },
    /**
     * Asynchronously saves the current gameplay data by sending a POST request to the server.
     *
     * Retrieves the authentication token and sends the gameplay data, along with the token,
     * to the server endpoint constructed using the internal game ID.
     *
     * @returns {Promise<Object>} A promise that resolves with an object indicating the success status.
     *          The object contains a `success` property (boolean) and, in case of failure, a `message`
     *          property with the error details.
     */
    saveGameplay: async function() {
      const self = this;

      try {
        const authToken =  await useAuthTokenStoreStore().getAuthToken();
        let resp = await axios.post(`/gameplay/save/${self.internal.gameId}`, {gameplay: self, authToken});
        console.log('Gameplay saved', resp);
        return {success: true}
      }
      catch(err) {
        console.error('Error while saving gameplay', err);
        return {success: false, message:`Fehler beim Speichern: ${err.message}`}
      }
    }
  }
})
