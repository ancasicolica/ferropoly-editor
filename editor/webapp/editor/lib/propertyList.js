/**
 * List with all Properties
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 13.08.21
 **/

import EventEmitter from '../../common/lib/eventEmitter';
import {find, merge} from 'lodash';

class PropertyList extends EventEmitter {
  constructor() {
    super();
    this.properties = [];
  }

  addProperty(property) {
    this.properties.push(property);

    property.on('property-selected', p => {
      this.emit('property-selected', p);
    });
  }

  getProperties() {
    return this.properties;
  }

  updateProperty(property, data) {
    let p = find(this.properties, {uuid: property.uuid});
    if (!p) {
      console.error('Property not found!', property);
    }
    merge(p, data);
    console.log('Updated', property);
  }
}

export default PropertyList;
