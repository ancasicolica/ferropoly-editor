/**
 * This is the store for a gameplay
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2024
 **/

import {defineStore} from 'pinia'
import {DateTime} from 'luxon';
import axios from 'axios';
import {merge, get} from 'lodash';

import {
  gamenameSchema,
  gameplaySchema,
  organisationSchema,
  organisatorEmailSchema,
  organisatorPhoneSchema,
  organisatorNameSchema,
  numberOfPriceLevelsSchema,
  numberOfPropertiesPerGroupSchema,
  pricelistPriceSchema,
  startCapitalSchema,
  interestSchema,
  interestIntervalSchema,
  interestCyclesAtEndOfGameSchema, debtInterestSchema
} from '../schemas/GamePlaySchemas';

import {useAuthTokenStoreStore} from '../../common/store/authTokenStore';
import {useEditorPropertiesStore} from './EditorPropertiesStore';

export const useGameplayStore = defineStore('Gameplay', {
  state:   () => ({
    gamename:   '',
    admins:     {
      logins: []
    },
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
      created:    new Date(),
      lastEdited: new Date()
    },
    internal:   {
      gameId: '',
      map:    '',
      owner:  ''
    },
    joining:    {
      possibleUntil: new Date(),
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
    },
    pricelistPriceValidation(state) {
      return pricelistPriceSchema.safeParse({
        lowestPrice:  state.gameParams.properties.lowestPrice,
        highestPrice: state.gameParams.properties.highestPrice
      });
    },
    numberOfPriceLevelsValidation(state) {
      return numberOfPriceLevelsSchema.safeParse(state.gameParams.properties.numberOfPriceLevels);
    },
    numberOfPropertiesPerGroupValidation(state) {
      return numberOfPropertiesPerGroupSchema.safeParse(state.gameParams.properties.numberOfPropertiesPerGroup);
    },
    startCapitalValidation(state) {
      return startCapitalSchema.safeParse(state.gameParams.startCapital);
    },
    interestlValidation(state) {
      return interestSchema.safeParse(state.gameParams.startCapital);
    },
    interestIntervalValidation(state) {
      return interestIntervalSchema.safeParse(state.gameParams.startCapital);
    },
    interestCyclesAtEndOfGameValidation(state) {
      return interestCyclesAtEndOfGameSchema.safeParse(state.gameParams.startCapital);
    },
    debtInterestValidation(state) {
      return debtInterestSchema.safeParse(state.gameParams.startCapital);
    },
    numberOfInterestRounds(state) {
      let start    = DateTime.fromJSDate(state.scheduling.gameStart);
      let end      = DateTime.fromJSDate(state.scheduling.gameEnd);
      let duration = end.diff(start, 'minutes');
      console.log('numberOfInterestRounds', start, end, duration, duration.minutes);
      return Math.floor(duration.minutes / state.gameParams.interestInterval);
    },
    gameId(state) {
      return state.internal.gameId;
    },
    finalized(state) {
      return state.internal.finalized;
    },
    latestJoiningDate(state) {
      return DateTime.fromISO(state.scheduling.gameDate).minus({day: 1}).toISO();
    },
    registrationActive(state) {
      const limit = DateTime.fromJSDate(state.joining.possibleUntil).startOf('day').minus({days: 1});
      return DateTime.local() <= limit.startOf('day');
    },
    registrationFinished(state) {
      return DateTime.local() > DateTime.fromJSDate(state.joining.possibleUntil);
    },
    registrationEndingSoon() {
      return !(this.registrationActive || this.registrationFinished);
    },
    joiningInfotext(state) {
      console.log('xxxxx', state.joining, state.joining.infotext);
      return state.joining.infotext;
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
      console.log('loaded', resp, resp.status);

      // Save GamePlay data
      this.setGameplayData(resp.data.gameplay);

      //  Save properties
      useEditorPropertiesStore().setProperties(resp.data.properties);
    },
    setGameplayData(gameplay) {
      merge(this, gameplay);
      // Convert Times to JS Date objects
      this.scheduling.deleteTs   = DateTime.fromISO(this.scheduling.deleteTs).toJSDate();
      this.scheduling.gameDate   = DateTime.fromISO(this.scheduling.gameDate).toJSDate();
      this.scheduling.gameStart  = DateTime.fromISO(this.scheduling.gameStart).toJSDate();
      this.scheduling.gameEnd    = DateTime.fromISO(this.scheduling.gameEnd).toJSDate();
      this.joining.possibleUntil = DateTime.fromISO(this.joining.possibleUntil).toJSDate();
      this.log.created           = DateTime.fromISO(this.log.created).toJSDate();
      this.log.lastEdited        = DateTime.fromISO(this.log.lastEdited).toJSDate();

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
    saveGameplay: async function () {
      const self = this;

      try {
        const authToken = await useAuthTokenStoreStore().getAuthToken();
        let resp        = await axios.post(`/gameplay/save/${self.internal.gameId}`, {gameplay: self, authToken});
        console.log('Gameplay saved', resp);
        this.log.lastEdited = new Date();
        return ({
          success: true
        });
      }
      catch (err) {
        console.error('Error while saving gameplay', err);
        let additionalInfo = get(err, 'response.data.message', '');
        return {success: false, message: `Fehler beim Speichern: ${err.message}. ${additionalInfo}`}
      }
    },
    /**
     * Retrieves a raw and unaltered gameplay state object.
     * The returned object is a deep copy of the current `$state`, ensuring immutability.
     *
     * @return {Object} A deep copy of the gameplay state.
     */
    getRawGameplay() {
      return JSON.parse(JSON.stringify(this.$state));
    },
    /**
     * Creates a pricelist for the specified game using the provided authentication token.
     * Sends a request to the server to create a new pricelist and handles success or error responses.
     *
     * @return {Promise<Object>} Resolves to an object containing the result of the operation.
     *                           If successful, the object includes `success: true` and the `gameId`.
     *                           In case of an error, the object includes `success: false` and an error message.
     */
    async createPricelist() {
      const self = this;
      try {
        const authToken = await useAuthTokenStoreStore().getAuthToken();
        let resp        = await axios.post('/pricelist/create',
          {gameId: self.internal.gameId, authToken});
        console.log('Pricelist created', resp);
        return {success: true, gameId: self.internal.gameId};
      }
      catch (err) {
        console.error('Error while creating pricelist', err);
        let additionalInfo = get(err, 'response.data.message', '');
        return {success: false, message: `Fehler beim Erstellen der Preisliste: ${err.message}. ${additionalInfo}`}
      }
    },
    setJoiningInfotext(text) {
      this.joining.infotext = text;
    },



  }
})
