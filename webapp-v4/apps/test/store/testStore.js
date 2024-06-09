/**
 * The store for the test app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.06.2024
 **/

import {defineStore} from 'pinia'

export const useTestStore = defineStore('Test', {
  state  : () => ({
    menubar: {
      online: true,
      helpUrl: 'https://www.ferropoly.ch',
      helpText: undefined
    }
  }),
  getters: {},
  actions: {}
})
