<!---
  Google Maps Root element

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #map-root
    h1 map
    #map

</template>

<script>
import {Loader} from '@googlemaps/js-api-loader';


// Hell, yes, this is the API Key in code, git and everywhere... So far I was not able
// to find a better solution, have to check this out. But don't be too happy about finding
// a 'free' API key, it is restricted to the ferropoly infrastructure, consider it as
// useless...
const API_KEY = 'AIzaSyBUF_iMSAIZ4VG6rjpGvTntep-_x2zuAqw'

const loader = new Loader({
  apiKey   : API_KEY,
  version  : 'weekly',
  libraries: ['places']
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom  : 4
};

export default {
  name : 'game-board',
  props: {},
  data : function () {
    return {};
  },
  model: {},
  async mounted() {
    loader.loadCallback(e => {
      if (e) {
        console.log(e);
      } else {
        let m = new google.maps.Map(document.getElementById('map'), mapOptions);
        console.log('maps', m);
      }
    });
  },
  computed  : {},
  methods   : {


  },
  components: {},
  filters   : {}
}
</script>

<style scoped>
#map {
  width: 400px;
  height: 400px;
  background-color: red;
}
</style>
