/**
 * A Store for Properties, designed for the Editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 31.12.2024
 **/

import {defineStore} from 'pinia'

import PropertyList from '../../lib/propertyList'
import EditorProperty from '../editorProperty';
import {filter, sortBy} from 'lodash';
import {createPriceList, createPropertyList} from '../../../editor/lib/pricelistLib';
import {useGameplayStore} from './GamePlayStore';

export const useEditorPropertiesStore = defineStore('EditorProperties', {
  state:   () => ({
    propertyList:     new PropertyList(),
    selectedProperty: null,
    ready:            false
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
      this.propertyList.setList(newProperties);

      console.log('Set initial properties values...');
      // Set initial values for the property ranges
      for (let i = 0; i < 6; i++) {
        this.getPropertiesOfRange(i);
      }

      this.createPriceList();
      this.ready = true;

    },
    createPriceList() {
      console.log('Create Pricelist');
      const gp = useGameplayStore().getRawGameplay();
      createPropertyList(gp, this.propertyList.properties)
      console.log('Pricelist created', this.propertyList.properties);
    },
    updateProperties(properties) {
      const self = this;
      properties.forEach(p => {
        self.propertyList.updateProperty(p, p);
      })
    },
    getPropertiesOfRange(range) {
      console.log('getPropertiesOfRange', range);

      // First get all properties of the given range
      const list = this.propertyList.getProperties()
      let f      = filter(list, {'pricelist': {'priceRange': range}});
      // First get all properties of the given range
      console.log('  f');
      let sorted = sortBy(f, 'pricelist.positionInPriceRange');
      console.log('  sorted', sorted.length);
      let i = 0;

      sorted.forEach(e => {
        e.pricelist.positionInPriceRange = i++;
      });
      console.log('  done');
      // Finally sort and return array
      return sorted;
    },
  }
})
