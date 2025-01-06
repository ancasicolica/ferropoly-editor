/**
 * List with all Properties
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 13.08.21
 **/

import EventEmitter from '../common/lib/eventEmitter';
import {get, find, merge, filter, maxBy, minBy} from 'lodash';

class PropertyList extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.properties = [];
    this.bounds     = {
      north: 0,
      south: 0,
      east:  0,
      west:  0
    };
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
    console.warn('Check if obsolete (from V3)');
    properties.forEach(p => {
      this.addProperty(p);
    })
  }

  /**
   * Returns the list of properties
   * @returns {[]}
   */
  getProperties() {
    console.warn('Check if obsolete (from V3)');
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
    console.warn('Check if obsolete (from V3)');
    return used.length;
  }

  /**
   * Updates a property
   * @param property
   * @param data
   */
  updateProperty(property, data) {
    console.warn('Check if obsolete (from V3)');
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
    console.warn('Check if obsolete (from V3)');
    let g = filter(this.properties, {'pricelist': {'propertyGroup': group}});
    console.log('Properties of group ' + group, g);
    return g;
  }

  /**
   * Sets the position of a specific property within a price range.
   *
   * @param {string} uuid - The unique identifier of the property to update.
   * @param {number} pos - The new position of the property within the price range.
   * @return {void} - No return value.
   */
  setPositionInPriceRange(uuid, pos) {
    let element = find(this.properties, {'uuid': uuid});
    if (!element) {
      console.warn(`Property with ${uuid} not found`);
      return;
    }
    element.setPositionInPriceRange(pos);
  }

  /**
   * Returns the bounds of the properties, the most north, east, west and south point
   * @return {*|{north: number, south: number, east: number, west: number}}
   */
  getBounds() {
    if (this.bounds.north === 0) {
      this.bounds.north = parseFloat(maxBy(this.properties, p => {
        return parseFloat(get(p, 'location.position.lat', 45.82));
      }).location.position.lat);
      this.bounds.south = parseFloat(minBy(this.properties, p => {
        return parseFloat(get(p, 'location.position.lat', 47.8));
      }).location.position.lat);
      this.bounds.east  = parseFloat(maxBy(this.properties, p => {
        return parseFloat(get(p, 'location.position.lng', 5.8));
      }).location.position.lng);
      this.bounds.west  = parseFloat(minBy(this.properties, p => {
        return parseFloat(get(p, 'location.position.lng', 10.5));
      }).location.position.lng);
    }
    return this.bounds;
  }

  /**
   * Returns the center of the properties
   * @return {{lat: number, lng: number}}
   */
  getCenter() {
    if (this.bounds.north === 0) {
      this.getBounds();
    }
    return {
      lat: this.bounds.south + (this.bounds.north - this.bounds.south) / 2,
      lng: this.bounds.west + (this.bounds.east - this.bounds.west) / 2
    }
  }

  /**
   * Shows all properties on a map
   * @param map
   */
  showAllPropertiesOnMap(map) {
    const self = this;
    this.properties.forEach(p => {
      p.setMap(map);
    })
  }

  /**
   * Deletes all properties on a map
   */
  clearAllPropertiesOnMap() {
    console.warn('Check if obsolete (from V3)');
    this.properties.forEach(p => {
      p.setMap(null);
    })
  }

  showPropertyOnMap(uuid, map) {
    let e = find(this.properties, {'uuid': uuid});
    if (!e) {
      console.log(`Element ${uuid} not found`);
      return;
    }
    e.setMap(map);
  }

  /**
   * Sets the marker property of all properties to null
   */
  clearAllMarkers() {
    console.warn('Check if obsolete (from V3)');
    this.properties.forEach(property => {
      if (property.marker) {
        property.marker.map = null
      }
    });
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
