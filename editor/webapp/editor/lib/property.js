/**
 * Property Class for the Editor. This class is a property (as known from the
 * model) but is enhanced with functionality for the editor, like
 * Google Maps functionalities
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.08.21
 **/

import {merge} from 'lodash';
import EventEmitter from '../../common/lib/eventEmitter';

const ICON_EDIT_LOCATION     = 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png';
const ICON_TRAIN_LOCATION    = 'https://maps.gstatic.com/mapfiles/ms2/micons/green.png';
const ICON_BUS_LOCATION      = 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow.png';
const ICON_BOAT_LOCATION     = 'https://maps.gstatic.com/mapfiles/ms2/micons/blue.png';
const ICON_CABLECAR_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/purple.png';
const ICON_OTHER_LOCATION    = 'https://maps.gstatic.com/mapfiles/ms2/micons/pink.png';

const iconPriceLabels             = ['A.png', 'B.png', 'C.png', 'D.png', 'E.png', 'F.png'];
const ICON_TRAIN_LOCATION_USED    = '/images/markers/letters/green_Marker';
const ICON_BUS_LOCATION_USED      = '/images/markers/letters/yellow_Marker';
const ICON_BOAT_LOCATION_USED     = '/images/markers/letters/blue_Marker';
const ICON_CABLECAR_LOCATION_USED = '/images/markers/letters/purple_Marker';
const ICON_OTHER_LOCATION_USED    = '/images/markers/letters/pink_Marker';

class Property extends EventEmitter {

  /**
   * Constructor
   * @param p is the property as in the Property Model, is merged with the object
   */
  constructor(p) {
    super();
    merge(this, p);
    this.marker          = null;
    this.isVisibleInList = true; // Flag indicating if the property is in the list or not
  }

  /**
   * Creates a marker, if not already there.
   * A marker is mandatory for the property in order to be displayed
   * on the map
   */
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
      this.marker.addListener('click', () => {
        this.emit('property-selected', this);
      });
      this.setMarkerIcon(false);
    }
  }

  /**
   * Sets the map of the Marker (makes it visible or not)
   * @param map Map object or null if not displaying on the map
   */
  setMap(map) {
    this.createMarker();
    this.marker.setMap(map);
    this.map = map;
  }

  /**
   * Applies the filter (showing or map or not)
   * @param show
   */
  applyFilter(show) {
    if (show && !this.isVisibleInList) {
      this.marker.setMap(this.map);
      this.isVisibleInList = true;
    } else if (!show && this.isVisibleInList) {
      this.marker.setMap(null);
      this.isVisibleInList = false;
    }
  }


  /**
   * Set the icon for this location in the map
   * @param editMode true if editing the item
   */
  setMarkerIcon(editMode) {
    if (this.marker) {
      let x = -1;
      if (this.pricelist) {
        x = this.pricelist.priceRange;
      }
      if (editMode) {
        this.marker.setIcon(ICON_EDIT_LOCATION);
      } else {
        switch (this.location.accessibility) {
          case 'train':
            if (x === -1) {
              this.marker.setIcon(ICON_TRAIN_LOCATION);
            } else {
              this.marker.setIcon(ICON_TRAIN_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          case 'bus':
            if (x === -1) {
              this.marker.setIcon(ICON_BUS_LOCATION);
            } else {
              this.marker.setIcon(ICON_BUS_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          case 'boat':
            if (x === -1) {
              this.marker.setIcon(ICON_BOAT_LOCATION);
            } else {
              this.marker.setIcon(ICON_BOAT_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          case 'cablecar':
            if (x === -1) {
              this.marker.setIcon(ICON_CABLECAR_LOCATION);
            } else {
              this.marker.setIcon(ICON_CABLECAR_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          default:
            if (x === -1) {
              this.marker.setIcon(ICON_OTHER_LOCATION);
            } else {
              this.marker.setIcon(ICON_OTHER_LOCATION_USED + iconPriceLabels[x]);
            }
            break;
        }
      }
    }
  };
}

export default Property;
