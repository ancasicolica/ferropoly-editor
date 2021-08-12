/**
 * Property Class for the Editor. This class is a property (as known from the
 * model) but is enhanced with functionality for the editor, like
 * Google Maps functionalities
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.08.21
 **/

import {merge} from 'lodash';

class Property {
  /**
   * Constructor
   * @param p is the property as in the Property Model, is merged with the object
   */
  constructor(p) {
    merge(this, p);
    this.marker = null;
  }

  createMarker() {
    if (!google) {
      return;
    }
    if (this.marker) {
      return;
    }
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: {
          lat: parseFloat(this.location.position.lat),
          lng: parseFloat(this.location.position.lng)
        },
        map     : null,
        title   : this.location.name,
      });
    }
  }

  /**
   * Sets the map of the Marker
   * @param map Map object or null if not displaying on the map
   */
  setMap(map) {
    this.createMarker();
    this.marker.setMap(map);
  }
}

export default Property;
