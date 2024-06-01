/**
 * The store for the game selector app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.05.2024
 **/

import {defineStore} from 'pinia'
import {useUserStore} from '../../../common/store/userStore';
import {readMyGames} from '../../../lib/adapters/gameplay';

export const useGameSelectorStore = defineStore('gameSelector', {
  state  : () => ({
    menuBarElements: [
      {label: 'Neues Spiel', url: '/newgame', key: 'new-game', active: false},
      {label: 'Admin Dashboard', url: '/dashboard', key: 'dashboard', active: false},
    ],
    gameplays      : [],
    dataLoaded     : false,
  }),
  getters: {},
  actions: {
    async init() {
      const userStore                 = useUserStore();
      this.menuBarElements[1].visible = userStore.roles.admin;
      this.gameplays                  = await readMyGames();
      this.dataLoaded                 = true;
    }
  }
})
