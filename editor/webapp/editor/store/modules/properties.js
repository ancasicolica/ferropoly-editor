/**
 * Properties module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.07.21
 **/

import {createHelpers} from 'vuex-map-fields';

const {getPropertiesField, updatePropertiesField} = createHelpers({
  getterType  : 'getPropertiesField',
  mutationType: 'updatePropertiesField'
});

const properties = {
  state    : () => ({
    list: []
  }),
  getters  : {
    getPropertiesField,
  },
  mutations: {
    updatePropertiesField,
  },
  actions: {
    applyFilter({state, commit, rootState}, options) {
      state.list.forEach(p => {
        p.setMap( rootState.editor.map);
      });
    }
  }
};

export default properties;
