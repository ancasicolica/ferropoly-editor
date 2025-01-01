/**
 * Store for the editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.12.2024
 **/

import {defineStore} from 'pinia'
import {useGameplayStore} from '../../../lib/store/GamePlayStore';

export const useEditorStore = defineStore('Editor', {
  state:   () => ({
    ready: false
  }),
  getters: {},
  actions: {
    async loadData(gameId) {
      useGameplayStore().loadGameplay(gameId)
        .then(() => {
          this.ready = true;
        })
        .catch(err => {
          console.error('Error while loading gameplay', err);
        });

    }
  }
})
