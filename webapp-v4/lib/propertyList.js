/**
 * List with all Properties
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 13.08.21
 **/

import EventEmitter from '../common/lib/eventEmitter';
import {find, merge, filter} from 'lodash';

class PropertyList extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.properties = [];
  }

  /**
   * Adds a property to the list
   * @param property
   */
  addProperty(property) {
    this.properties.push(property);

    property.on('property-selected', p => {
      this.emit('property-selected', p);
    });
  }

  /**
   * Sets the complete property list in one step
   * @param properties
   */
  setList(properties) {
    console.log('Setting complete property list');
    this.properties = properties;
  }

  /**
   * Returns the list of properties
   * @returns {[]}
   */
  getProperties() {
    return this.properties;
  }

  /**
   * Returns the number of properties used in the price list
   * @returns {[]}
   */
  usedPropertyNb() {
    let used = filter(this.properties, p => {
      return p.pricelist.priceRange >= 0;
    });
    return used.length;
  }

  /**
   * Updates a property
   * @param property
   * @param data
   */
  updateProperty(property, data) {
    let p = find(this.properties, {uuid: property.uuid});
    if (!p) {
      console.error('Property not found!', property);
    }
    merge(p, data);
    //console.log('Updated', property);
  }

  /**
   * Retrieves properties that belong to a specific group.
   *
   * @param {string} group - The name of the property group to filter by.
   * @return {Array} An array of properties that match the specified group.
   */
  getPropertiesOfGroup(group) {
    return filter(this.properties, {'pricelist': {'propertyGroup': group}});
  }

  /**
   * Applies the filter over all properties. See property-filter.vue for details
   * @param f
   */
  applyFilter(f) {
    if (f.filterType === 'all') {
      this.properties.forEach(p => {
        p.applyFilter(true);
      });
    } else if (f.filterType === 'accessibility') {
      this.properties.forEach(p => {
        p.applyFilter(p.location.accessibility === f.filter);
      });
    } else if (f.filterType === 'location') {
      this.properties.forEach(p => {
        p.applyFilter(p.location.name.toLowerCase().includes(f.filter));
      });
    } else if (f.filterType === 'priceRange') {
      if (f.filter === 'allInList') {
        this.properties.forEach(p => {
          p.applyFilter(p.pricelist.priceRange >= 0);
        });
      } else {
        this.properties.forEach(p => {
          p.applyFilter(p.pricelist.priceRange.toString() === f.filter);
        });
      }
    }
  }
}

export default PropertyList;
