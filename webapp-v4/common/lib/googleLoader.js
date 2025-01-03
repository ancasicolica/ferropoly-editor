/**
 * Loads the Google APIs and provides them to all consuments
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.08.21
 **/

import {Loader} from '@googlemaps/js-api-loader';

// Hell, yes, this is the API Key in code, git and everywhere... So far I was not able
// to find a better solution, have to check this out. But don't be too happy about finding
// a 'free' API key, it is restricted to the ferropoly infrastructure, consider it as
// useless...
const API_KEY = 'AIzaSyBUF_iMSAIZ4VG6rjpGvTntep-_x2zuAqw';

const loader = new Loader({
  apiKey   : API_KEY,
  version  : 'weekly',
  libraries: ['places']
});

class GoogleLoader {
  constructor() {
    this.google = null;
  }

  async load()  {

    try {
      this.google = await loader.load();
      return this.google;
    }
    catch(ex) {
      console.error('Error while loading Google API', ex);
      return null;
    }
  }

  async getInstance() {
    if (!this.google) {
      await this.load();
    }
    return this.google;
  }

}

const googleInstance = new GoogleLoader();

export default googleInstance;
