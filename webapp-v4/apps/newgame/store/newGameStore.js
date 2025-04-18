/**
 * Store for new games
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 23.06.2024
 **/

import {defineStore} from 'pinia'
import {DateTime} from 'luxon';
import axios from 'axios';
import {useAuthTokenStoreStore} from '../../../common/store/authTokenStore';
import {toRaw} from 'vue'
export const useNewGameStore = defineStore('NewGame', {
  state:   () => ({
    menuBarElements:  [],
    gameName:         'Ferropoly',
    proposedGameName: '',
    gameMap:          'zvv',
    gameDate:         DateTime.now().plus({days: 7}).toJSDate(),
    presets:          'moderate',
    randomNb:         0,
    errorMessage:     undefined,
    proposedGameIds:  [],
    importData:       {}
  }),
  getters: {
    /**
     * Checks whether the proposed game name is valid based on a length requirement.
     *
     * @param {Object} state - The state object containing the proposed game name.
     * @return {boolean} Returns true if the proposed game name is longer than 3 characters, otherwise false.
     */
    proposedGameNameValid(state) {
      return state.proposedGameName.length > 3;
    },
    importedDataAvailable(state) {
      if (state?.importData?.meta) {
        return true;
      }
    },
    importedGpCreator(state) {
      return state.importData?.meta?.creator;
    },
    importedGpDate(state) {
      return DateTime.fromISO(state.importData?.meta?.date).toJSDate();
    },
    importedGpMap(state) {
      return state.importData?.gameplay?.internal?.map;
    },
    importedGpPropertyNb(state) {
      let props = state.importData?.properties || [];
      return props.length;
    }
  },
  actions: {
    /**
     * Sends a POST request to check the validity of a game ID and processes the response.
     * Updates the proposed game IDs and error message based on the server's response.
     *
     * @return {Promise<Object|undefined>} A promise that resolves to the server's response data containing validity
     *   status and game IDs. Returns undefined if an error occurs.
     */
    async checkId() {
      try {
        let result = await axios.post('/gameplay/checkid', {gameId: this.proposedGameName});

        if (!result || !result.data) {
          this.errorMessage = 'Die Antwort des Servers ist ungültig.';
          return;
        }

        this.errorMessage    = null;
        this.proposedGameIds = result.data?.['ids'] ?? [];
        if (!result.data.valid && this.proposedGameName.length > 0) {
          this.errorMessage = 'Diese Spiel-ID steht leider nicht zur Verfügung. Bitte versuche es mit einer anderen Spiel-ID.'
          return null;
        }

        return result.data;
      }
      catch (err) {
        console.error('checkId', err)
        if (err.response) {
          this.errorMessage = `Fehler bei der Abfrage: ${err.response.status} ${err.response.statusText}`;
        } else {
          this.errorMessage = `Unbekannter Fehler: ${err.message}`;
        }
        throw (new Error(this.errorMessage));
      }
    },
    /**
     * Creates a new game by sending a POST request to the server with necessary game details.
     *
     * @return {Promise<string|null>} Returns a promise that resolves to the proposed game name if successful, or null
     *   in case of any error.
     */
    async createGame() {
      const authToken = await useAuthTokenStoreStore().getAuthToken();
      const importData = toRaw(this.importData);

      const creationSet =         {
        gamename:   this.gameName,
        map:        importData?.gameplay?.internal?.map || this.gameMap,
        gamedate:   this.gameDate,
        random:     this.randomNb,
        presets:    this.presets,
        gameId:     this.proposedGameName,
        gameParams: importData?.gameplay?.gameParams,
        properties: importData?.properties,
        authToken
      }

      console.log('Creating new game', creationSet);

      let result = await axios.post('/gameplay/createnew',creationSet);

      if (result.status === 200) {
        return this.proposedGameName;
      } else {
        this.errorMessage = `Fehler beim Erzeugen des Spiels: ${err.response.status} ${err.response.statusText}`;
      }
    }
  }
})
