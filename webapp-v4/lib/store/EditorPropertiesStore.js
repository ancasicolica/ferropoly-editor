/**
 * A Store for Properties, designed for the Editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 31.12.2024
 **/

import {defineStore} from 'pinia'

import PropertyList from '../PropertyList'
import EditorProperty from '../EditorProperty';
import {filter, sortBy} from 'lodash';
import {createPriceList, createPropertyList} from '../../../editor/lib/pricelistLib';
import {useGameplayStore} from './GamePlayStore';

const propertyList                    = new PropertyList();
export const useEditorPropertiesStore = defineStore('EditorProperties', {
  state:   () => ({

    properties:       propertyList.properties, // Not the complete list due to performance reasons
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
      console.log('Add properties to list...');
      const newProperties = properties.map(p => new EditorProperty(p));
      propertyList.setList(newProperties);

      // Set initial values for the property ranges
      for (let i = 0; i < 6; i++) {
        this.getPropertiesOfRange(i);
      }

      this.createPriceList();
      this.ready = true;
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
      const self = this;
      properties.forEach(p => {
        propertyList.updateProperty(p, p);
      })
    },
    /**
     * Retrieves and sorts properties within the specified price range.
     *
     * @param {Object} range - The price range for filtering properties.
     * @return {Array} An array of properties sorted by their position within the specified price range.
     */
    getPropertiesOfRange(range) {
      console.log('getPropertiesOfRange', range);
      // First get all properties of the given range
      const list = this.properties;
      let f      = filter(list, {'pricelist': {'priceRange': range}});
      // First get all properties of the given range
      let sorted = sortBy(f, 'pricelist.positionInPriceRange');
      let i      = 0;

      sorted.forEach(e => {
        e.pricelist.positionInPriceRange = i++;
      });
      // Finally sort and return array
      return sorted;
    },
    /**
     * Retrieves the properties associated with a specific group.
     *
     * @param {string} group - The name or identifier of the group whose properties need to be retrieved.
     * @return {Array} - An array containing the properties of the specified group.
     */
    getPropertiesOfGroup(group) {
      return propertyList.getPropertiesOfGroup(group);
    },
    /**
     * Shows all properties on a map. Maybe better in the PropertyList?
     * @param map
     */
    showAllPropertiesOnMap(map) {
      this.properties.forEach(p => {
        propertyList.aux[p.uuid].setMap(map);
      })
    },
    /**
     * Provides direct access to the property list
     * @return {PropertyList}
     */
    getPropertyList() {
      return propertyList;
    }
  }
})
