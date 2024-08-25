/**
 * Store for new games
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 23.06.2024
 **/

import {defineStore} from 'pinia'
import {DateTime} from 'luxon';

export const useNewGameStore = defineStore('NewGame', {
  state  : () => ({
    menuBarElements : [],
    gameName        : 'Ferropoly',
    proposedGameName: '',
    gameMap         : 'zvv',
    gameDate        : DateTime.now().plus({days: 7}).toJSDate(),
    presets         : 'moderate',
    randomNb        : 0,
  }),
  getters: {},
  actions: {}
})
