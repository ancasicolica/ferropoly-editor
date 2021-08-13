/**
 * Properties module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.07.21
 **/

import {createHelpers} from 'vuex-map-fields';
import PropertyList from '../../lib/propertyList.js';

const propertyList = new PropertyList();

const {getPropertiesField, updatePropertiesField} = createHelpers({
  getterType  : 'getPropertiesField',
  mutationType: 'updatePropertiesField'
});

const properties = {
  state    : () => ({
    propertyList    : propertyList,
    selectedProperty: null
  }),
  getters  : {
    getPropertiesField,
  },
  mutations: {
    updatePropertiesField,
    usageChanged(state, info) {
      state.propertyList.updateProperty(info.property, info.data);
    }
  },
  actions  : {
    applyFilter({state, commit, rootState}) {
      state.propertyList.getProperties().forEach(p => {
        p.setMap(rootState.editor.map);
      });
    },
    selectProperty({state, commit, rootState}, options) {
      if (state.selectedProperty) {
        state.selectedProperty.setMarkerIcon(false);
      }
      state.selectedProperty = options.property;
      state.selectedProperty.setMarkerIcon(true);
    }
  }
};

export default properties;
