/**
 * This is the base class for Properties
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.08.21
 **/

import {get, merge} from 'lodash';
import EventEmitter from './eventEmitter';
import mapLoader from './googleLoader';
import {toRaw} from 'vue'

class Property extends EventEmitter {

  static infoWindow     = null;
  static googleInstance = null;

  /**
   * Closes the currently open info window, if it exists.
   *
   * @return {void} Does not return a value.
   */
  static closeInfoWindow() {
    if (Property.infoWindow) {
      Property.infoWindow.close();
    }
  }

  /**
   * Constructor
   * @param p is the property as in the Property Model, is merged with the object
   */
  constructor(p) {
    super();
    this.marker          = null;
    this.isVisibleInList = true; // Flag indicating if the property is in the list or not

    // The Icons to use
    this.ICON_EDIT_LOCATION     = '/images/markers/selected.png';
    this.ICON_TRAIN_LOCATION    = '/images/markers/z-neutral.png';
    this.ICON_BUS_LOCATION      = '/images/markers/b-neutral.png';
    this.ICON_BOAT_LOCATION     = '/images/markers/s-neutral.png';
    this.ICON_CABLECAR_LOCATION = '/images/markers/v-neutral.png';
    this.ICON_OTHER_LOCATION    = '/images/markers/v-neutral.png';

    this.iconPriceLabels             = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png',
                                        '09.png', '10.png'];
    this.ICON_TRAIN_LOCATION_USED    = '/images/markers/32-b/z-';
    this.ICON_BUS_LOCATION_USED      = '/images/markers/32-b/b-';
    this.ICON_BOAT_LOCATION_USED     = '/images/markers/32-b/s-';
    this.ICON_CABLECAR_LOCATION_USED = '/images/markers/32-b/v-';
    this.ICON_OTHER_LOCATION_USED    = '/images/markers/32-b/v-';

    this.map = null;
    merge(this, p);
  }

  async showInfoWindow(info) {
    if (!Property.infoWindow) {
      Property.infoWindow = new Property.googleInstance.InfoWindow();
    }
    if (!this.marker) {
      return;
    }
    Property.infoWindow.close();
    Property.infoWindow.setContent(info);
    Property.infoWindow.open(this.marker.map, this.marker);
  }

  /**
   * Opens an InfoWindow on a specified marker.
   *
   * @param {Marker} marker - The marker to open the InfoWindow on.
   *
   * @return {void}
   */
  openInfoWindow(marker) {
    this.emit('info-window-opened', this);
    console.warn('OBSOLETE: Property.openInfoWindow');
    if (this.infoWindow) {
      this.infoWindow.open(this.map, marker);
    }
  }

  /**
   * Closes the info window if it is currently open.
   *
   * @returns {void}
   */
  closeInfoWindow() {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
    console.warn('OBSOLETE: Property.closeInfoWindow');
  }

  /**
   * Creates a marker, if not already there.
   * A marker is mandatory for the property in order to be displayed
   * on the map
   */
  async createMarker() {
    if (!Property.googleInstance) {
      Property.googleInstance = await mapLoader.getInstance();
    }
    if (this.marker) {
      return;
    }
    if (!this.marker) {
      this.marker = toRaw(new Property.googleInstance.AdvancedMarkerElement({
        position: {
          lat: parseFloat(this.location.position.lat),
          lng: parseFloat(this.location.position.lng)
        },
        map:      null,
        title:    this.location.name,
      }));
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
  async setMap(map) {
    await this.createMarker();
    this.map = toRaw(map);
    if (this.marker) {
      this.marker.map = this.map;
    }

  }

  /**
   * Applies the filter (showing or map or not)
   * @param show
   */
  applyFilter(show) {

    if (show && !this.isVisibleInList) {
      if (this.marker) {
        this.marker.map = this.map;
      }
      this.isVisibleInList = true;
    } else if (!show && this.isVisibleInList) {
      if (this.marker) {
        this.marker.map = null;
      }
      this.isVisibleInList = false;
    }
  }

  /**
   * Returns the location of the property in google maps lat/lng-format
   * @returns {{lng: number, lat: number}}
   */
  getGoogleMapsLocation() {
    let lat = get(this, 'location.position.lat', '47.1');
    let lng = get(this, 'location.position.lng', '8.8');
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
  }
}

export default Property;
