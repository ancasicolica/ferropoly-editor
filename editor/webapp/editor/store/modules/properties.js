/**
 * Properties module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.07.21
 **/

import {createHelpers} from 'vuex-map-fields';
import PropertyList from '../../lib/propertyList.js';
import {savePositionInPricelist, saveProperty} from '../../../lib/adapters/gameplay';

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
    updatePropertiesField
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
    },
    /**
     * Usage of a property changed (added to pricelist, removed, pricerange...)
     * @param state
     * @param commit
     * @param rootState
     * @param options
     */
    usageChanged({state, commit, rootState}, options) {
      rootState.editor.api.requestPending = true;
      state.propertyList.updateProperty(options.property, options.data);

      saveProperty(options.property, rootState.gameId, err => {
        rootState.editor.api.requestPending = false;
        if (err) {
          console.error(err);
          rootState.editor.api.error.message  = err.message;
          rootState.editor.api.error.infoText = 'Es gab einen Fehler beim Speichern des Ortes:';
          rootState.editor.api.error.active   = true;
        }
      });
    },
    /**
     * Updates the position of a property in the price range
     * @param state
     * @param commit
     * @param rootState
     * @param options
     */
    updatePositionInPricelist({state, commit, rootState}, options) {
      let saveList = [];
      options.properties.forEach(p => {
        let saveSet = p.getPricelistPositionSaveSet();
        if (saveSet) {
          state.propertyList.updateProperty({uuid: saveSet.uuid}, {
            pricelist: {
              positionInPriceRange: saveSet.positionInPriceRange
            }
          });
          saveList.push(saveSet);
        }
      });

      if (saveList.length > 0) {
        savePositionInPricelist(saveList, rootState.gameId,  err => {
          if (err) {
            console.error(err);
            rootState.editor.api.error.message  = err.message;
            rootState.editor.api.error.infoText = 'Es gab einen Fehler beim Speichern des Ortes:';
            rootState.editor.api.error.active   = true;
          }
        });
      }
    }
  }
};

export default properties;
