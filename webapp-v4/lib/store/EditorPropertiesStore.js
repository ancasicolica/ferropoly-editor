/**
 * A Store for Properties, designed for the Editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 31.12.2024
 **/

import {defineStore} from 'pinia'

import PropertyList from '../PropertyList'
import EditorProperty from '../EditorProperty';
import {filter, find, findIndex, set, sortBy} from 'lodash';
import {createPriceList, createPropertyList} from '../../../editor/lib/pricelistLib';
import {useGameplayStore} from './GamePlayStore';
import {useAuthTokenStoreStore} from '../../common/store/authTokenStore';
import axios from 'axios';
import {toRaw} from 'vue';

const propertyAuxData = new PropertyList();

export const useEditorPropertiesStore = defineStore('EditorProperties', {
  state:   () => ({
    properties:       [],
    selectedProperty: null
  }),
  getters: {},
  actions: {
    /**
     * Adds and sets multiple properties to the property list. This is initially done.
     *
     * @param {Array} properties - An array of property definitions to be added to the property list.
     * @return {void} No return value.
     */
    setProperties(properties) {
      const self = this;
      console.log('Add properties to list...');
      properties.forEach(p => {
        self.properties.push(p);
        propertyAuxData.addProperty(new EditorProperty(p));
      })

      // Set initial values for the property ranges
      for (let i = 0; i < 6; i++) {
        this.getPropertiesOfRange(i);
      }

      this.createPriceList();
      this.ready = true;
    },
    /**
     * Saves the positions of the provided properties in the pricelist.
     * Updates internal states and sends the new positioning to the server.
     *
     * @param {Array} properties - An array of property objects that need to be positioned in the pricelist.
     * @return {Promise<void>} A promise that resolves once the position data has been successfully saved or rejects in
     *   case of an error.
     */
    async savePositionsInPricelist(properties) {
      const gameId = useGameplayStore().gameId;
      for (let i = 0; i < properties.length; i++) {
        propertyAuxData.setPositionInPriceRange(properties[i].uuid, i);
        let index = findIndex(this.properties, {'uuid': properties[i].uuid});
        if (index < 0) {
          console.warn(`property not found`, properties[i]);
        } else {
          this.properties[index].pricelist.positionInPriceRange = i;
          //console.log('update', index, i, properties[i]);
        }
      }

      let saveSet = [];
      propertyAuxData.properties.forEach(p => {
        let s = p.getPricelistPositionSaveSet();
        if (s) {
          saveSet.push(s);
        }
      })

      try {
        const authToken = await useAuthTokenStoreStore().getAuthToken();
        const resp      = await axios.post(`/gameplay/savePositionInPricelist/${gameId}`, {
          properties: saveSet,
          authToken
        });
        console.log('Updated positions in backend', resp.data);
        this.createPriceList();
      }
      catch (ex) {
        console.error('Error in savePositionsInPricelist', ex);
      }
    },
    /**
     * Generates and initializes a price list based on the current gameplay data.
     *
     * The method retrieves raw gameplay data, processes it, and creates a list of properties
     * with associated pricing information.
     *
     * @return {void} Does not return a value.
     */
    createPriceList() {
      console.log('Create Pricelist');
      const gp = useGameplayStore().getRawGameplay();
      createPropertyList(gp, this.properties)
    },
    /**
     * Updates the properties in the property list with the provided values.
     *
     * @param {Array} properties - An array of property objects to be updated.
     * @return {void} This method does not return a value.
     */
    updateProperties(properties) {
      properties.forEach(p => {
        //  this.propertyList.updateProperty(p, p);
      })
    },
    /**
     * Retrieves and sorts properties within the specified price range.
     *
     * @param {Object} range - The price range for filtering properties.
     * @return {Array} An array of properties sorted by their position within the specified price range.
     */
    getPropertiesOfRange(range) {
      // First get all properties of the given range
      const list = this.properties;
      let f      = filter(list, obj => {
        return obj.pricelist.priceRange === range
      });

      // Then get all properties of the given range
      let sorted = sortBy(f, 'pricelist.positionInPriceRange');
      let i      = 0;

      sorted.forEach(e => {
        set(e, 'pricelist.positionInPriceRange', i++);
      });

      // Finally sort and return array
      return sorted;
    },
    getNumberOfPropertiesInPricelist() {
      const list = this.properties;
      let f      = filter(list, obj => {
        return obj.pricelist.priceRange > -1;
      });
      return f.length;
    },
    getPropertyByUuid(uuid) {
      return find(this.properties, {'uuid': uuid});
    },
    /**
     * Retrieves the properties associated with a specific group.
     *
     * @param {string} group - The name or identifier of the group whose properties need to be retrieved.
     * @return {Array} - An array containing the properties of the specified group.
     */
    getPropertiesOfGroup(group) {
      return filter(this.properties, {'pricelist': {'propertyGroup': group}});
    },
    /**
     * Provides direct access to the property list
     * @return {PropertyList}
     */
    getPropertyList() {
      return propertyAuxData;
    },
    /**
     * Applies a filter to the given data based on the specified filter type.
     */
    applyFilter(f) {
      if (f.filterType === 'all') {
        f.entries = this.properties;
      } else if (f.filterType === 'accessibility') {
        f.entries = filter(this.properties, {'location': {'accessibility': f.filter}});
      } else if (f.filterType === 'location') {
        f.entries = filter(this.properties, p => {
          return p.location.name.toLowerCase().includes(f.filter);
        });
      } else if (f.filterType === 'priceRange') {
        // This has to be filtered with the vue data
        f.entries = filter(this.properties, {'pricelist': {'priceRange': f.filter}});
      }
      propertyAuxData.applyFilter(f);
    },
    /**
     * Selects a property as active based on the provided UUID.
     *
     * @param {string} uuid - The unique identifier of the property to be marked as active.
     * @return {Object} Returns the result of the operation from the `selectPropertyAsActive` method on `propertyAuxData`.
     */
    selectPropertyAsActive(uuid) {
      return propertyAuxData.selectPropertyAsActive(uuid);
    },
    /**
     * Saves the currently selected property to the backend.
     * The method retrieves the selected property, appends the game ID, retrieves the authentication token,
     * and makes a POST request to save the property.
     *
     * @return {Promise<void>} A promise that resolves when the property is successfully saved
     *                         or logs an error if saving fails.
     */
    async saveSelectedProperty() {
      const rawProperty = toRaw(this.selectedProperty);
      console.log('save property', rawProperty);
      try {
        const gameId       = useGameplayStore().gameId;
        rawProperty.gameId = gameId;
        const authToken    = await useAuthTokenStoreStore().getAuthToken();
        const resp         = await axios.post(`/gameplay/saveProperty/${gameId}`, {
          property: rawProperty,
          authToken
        });
        console.log('Updated Property in backend', resp.data);
      }
      catch (ex) {
        console.error('Error in saveSelectedProperty', ex);
      }
    }
  }
})
