<!---
  Google Maps Root element

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #map-root
    #map

</template>

<script>
import {Loader} from '@googlemaps/js-api-loader';
import { WmsMapType } from '@googlemaps/ogc';
import $ from 'jquery';

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

const mapOptionsDefaults = {
  center: {
    lat: 46.85742146786182,
    lng: 8.248587563195557
  },
  zoom  : 8,

};

export default {
  name : 'ferropoly-map',
  props: {
    mapOptions: {
      type   : Object,
      default: function () {
        return mapOptionsDefaults;
      }
    }
  },
  data : function () {
    return {
      mapElement: undefined
    };
  },
  model: {},
  async mounted() {
    let self = this;
    loader.loadCallback(e => {
      if (e) {
        console.log(e);
      } else {
        this.mapOptions.mapTypeControlOptions = {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'swisstopo']
        };
        let m = new google.maps.Map(document.getElementById('map'), this.mapOptions);
        console.log('Google Map Initialized', m);
        let swissMap = WmsMapType({
          url: "https://wms.geo.admin.ch",
           layers: "ch.swisstopo.pixelkarte-farbe",
          name: "Swiss Topo",
          alt: "swiss_top",
          version: '1.1.1',
          transparent: false,
          maxZoom: 55,
          format: 'image/jpeg'
        });

        m.mapTypes.set("swisstopo", swissMap);
        m.setMapTypeId("swisstopo");
        //m.overlayMapTypes.push(swissMap);
        self.resizeHandler();
      }
    });
  },
  created() {

    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler(null);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  computed  : {},
  methods   : {
    resizeHandler() {
      this.mapElement = $('#map');
      let parentWidth = this.mapElement.parent().width();

      let hDoc      = $(window).height();
      let offsetMap = this.mapElement.offset();
      console.log(hDoc, offsetMap);

      this.mapElement.height(hDoc - offsetMap.top);
      this.mapElement.width(parentWidth);

    }

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
