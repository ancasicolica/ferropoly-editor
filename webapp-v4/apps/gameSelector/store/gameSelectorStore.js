/**
 * The store for the game selector app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.05.2024
 **/

import {defineStore} from 'pinia'
import {useUserStore} from '../../../common/store/userStore';
import axios from 'axios';
import {DateTime} from 'luxon';
import {get} from 'lodash';

export const useGameSelectorStore = defineStore('gameSelector', {
  state:   () => ({
    menuBarElements: [
      {label: 'Neues Spiel', url: '/newgame', key: 'new-game', active: false},
      {label: 'Admin Dashboard', url: '/dashboard', key: 'dashboard', active: false},
    ],
    gameplays:       [],
    dataLoaded:      false,
  }),
  getters: {},
  actions: {
    /**
     * Initializes the component state by setting menu visibility based on user roles,
     * loading the user's gameplays, and marking the data as loaded.
     *
     * @return {Promise<void>} A promise that resolves when the initialization is complete.
     */
    async init() {
      const userStore = useUserStore();
      await this.readMyGames();
      this.menuBarElements[1].visible = userStore.roles.admin;
      this.dataLoaded                 = true;
    },
    async deleteGameplay(gameId) {
      let result = await axios.delete(`/gameplay/${gameId}`);
      await this.readMyGames();
      return result.data;
    },
    /**
     * Fetches the user's games from the server and processes their scheduling information.
     * The scheduling timestamps are converted to JavaScript Date objects.
     *
     * @return {Promise<void>} A promise that resolves once the games have been fetched and processed.
     */
    async readMyGames() {
      let resp = await axios.get('/gameplay/mygames', {dataType: 'json'});

      resp.data.gameplays.forEach(gp => {
        gp.scheduling.deleteTs = DateTime.fromISO(gp.scheduling.deleteTs).toJSDate();
        gp.scheduling.gameDate = DateTime.fromISO(gp.scheduling.gameDate).toJSDate();
      });
      console.log('Loaded Gameplays', resp.data);
      this.gameplays = get(resp, 'data.gameplays', []);
    }
  }
})
