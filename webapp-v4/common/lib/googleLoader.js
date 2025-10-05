/**
 * Loads the Google APIs and provides them to all consuments
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.08.21
 **/

import {setOptions, importLibrary} from '@googlemaps/js-api-loader';
import {merge} from 'lodash';

// Hell, yes, this is the API Key in code, git and everywhere... So far I was not able
// to find a better solution, have to check this out. But don't be too happy about finding
// a 'free' API key, it is restricted to the ferropoly infrastructure, consider it as
// useless...
const API_KEY = 'AIzaSyBUF_iMSAIZ4VG6rjpGvTntep-_x2zuAqw';

setOptions({
  key: API_KEY,
  v:   'weekly'
})

class GoogleLoader {
  constructor() {
    this.google = null;
    this.api    = {
      Map:                   null,
      MapTypeId:             null,
      AdvancedMarkerElement: null,
      PinElement:            null,
      LatLngBounds:          null,
    }

  }

  async load() {

    try {
      return this.google;
    }
    catch (ex) {
      console.error('Error while loading Google API', ex);
      return null;
    }
  }


  async loadEx() {
    try {
      console.log('Loading new Google API 2025 style');
      const mapApi                              = await importLibrary('maps');
      this.api                                  = merge(this.api, mapApi);
      const {AdvancedMarkerElement, PinElement} = await importLibrary('marker');

      const markersApi               = await importLibrary('marker');
      this.api                       = merge(this.api, markersApi);
      this.api.AdvancedMarkerElement = AdvancedMarkerElement;
      this.api.PinElement            = PinElement;
      console.log('API loaded', this.api);
      return this.api;
    }
    catch (ex) {
      console.error('Error while loading Google API ex', ex);
      return null;
    }
  }

  async getInstance() {
    if (!this.google) {
      this.google = await this.loadEx();
    }
    return this.api;
  }

}

const googleInstance = new GoogleLoader();

export default googleInstance;
