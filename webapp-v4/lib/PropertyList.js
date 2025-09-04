/**
 * List with all Properties
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 13.08.21
 **/

import EventEmitter from '../common/lib/eventEmitter';
import {get, merge, filter, maxBy, minBy, findIndex} from 'lodash';


class PropertyList extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.properties = new Map();
    this.bounds     = {
      north: 0,
      south: 0,
      east:  0,
      west:  0
    };
    this.activeProperty = null; // currently selected property, only one possible
  }

  /**
   * Adds a property to the list
   * @param property
   */
  addProperty(property) {
    this.properties.set(property.uuid, property);
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
    return [...this.properties.values()];
  }

  /**
   * Returns the number of properties used in the price list
   */
  usedPropertyNb() {
    // lodash's filter expects arrays or plain objects; convert Map to array
    const values = [...this.properties.values()];
    let used = filter(values, p => {
      return p.pricelist && p.pricelist.priceRange >= 0;
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
    let p = this.properties.get(property.uuid);
    if (!p) {
      console.error('Property not found!', property);
    }
    merge(p, data);
    //console.log('Updated', property);
  }


  /**
   * Sets the position of a specific property within a price range.
   *
   * @param {string} uuid - The unique identifier of the property to update.
   * @param {number} pos - The new position of the property within the price range.
   * @return {void} - No return value.
   */
  setPositionInPriceRange(uuid, pos) {
    let element = this.properties.get(uuid);
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
      // Convert Map to array to use lodash's maxBy/minBy
      const values = [...this.properties.values()];
      if (values.length === 0) {
        // No properties available; keep defaults
        return this.bounds;
      }
      this.bounds.north = parseFloat(
        maxBy(values, p => parseFloat(get(p, 'location.position.lat', 45.82))).location.position.lat
      );
      this.bounds.south = parseFloat(
        minBy(values, p => parseFloat(get(p, 'location.position.lat', 47.8))).location.position.lat
      );
      this.bounds.east = parseFloat(
        maxBy(values, p => parseFloat(get(p, 'location.position.lng', 5.8))).location.position.lng
      );
      this.bounds.west = parseFloat(
        minBy(values, p => parseFloat(get(p, 'location.position.lng', 10.5))).location.position.lng
      );
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
// Iterate over the values of the Map explicitly
    for (const p of this.properties.values()) {
      // p is a property instance
      p.setMap(map); // map can be a Map instance or null to hide markers
    }

  }

  /**
   * Deletes all properties on a map
   */
  clearAllPropertiesOnMap() {
    console.warn('Check if obsolete (from V3)');
    for (const p of this.properties.values()) {
      // p is a property instance
      p.setMap(null); // map can be a Map instance or null to hide markers
    }
  }

  showPropertyOnMap(uuid, map) {
    let e = this.properties.get(uuid);
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
    for (const property of this.properties.values()) {
      if (property.marker) {
        property.marker.map = null
      }
    }
  }

  /**
   * Applies the filter over all properties. See property-filter.vue for details
   * @param f
   */
  applyFilter(f) {
    console.log('applyFilter', f);

    for (const p of this.properties.values()) {
      // p is a property instance
      p.applyFilter(findIndex(f.entries, {'uuid': p.uuid}) >= 0);
    }
  }

  /**
   * Sets the property with the given UUID as the active property and updates its marker icon.
   * If there is an already active property, its marker icon will be reset.
   *
   * @param {string} uuid - The unique identifier of the property to be set as active.
   * @return {object} Does not return a value.
   */
  selectPropertyAsActive(uuid) {
    if (this.activeProperty) {
      this.activeProperty.setMarkerIcon(false);
    }
    
    let e = this.properties.get(uuid);
    if (!e) {
      console.log(`Element ${uuid} not found`);
      return null;
    }

    e.setMarkerIcon(true);
    this.activeProperty = e;
    return e;
  }
}

export default PropertyList;
