/**
 * Store for new games
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 23.06.2024
 **/

import {defineStore} from 'pinia'

export const useNewGameStore = defineStore('NewGame', {
  state  : () => ({
    menuBarElements: [],
    gameName       : 'Ferropoly'
  }),
  getters: {},
  actions: {}
})
