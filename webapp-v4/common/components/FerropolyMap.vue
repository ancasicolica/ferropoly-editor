<!---
  Google Maps root element for Ferropoly

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21

  History:
  1.0.0     First versioned map

-->
<template lang="pug">
  #map-root
    #map

</template>

<script>

import {WmsMapType} from '@googlemaps/ogc';
import $ from 'jquery';
import mapLoader from '../lib/googleLoader.js';
import {assign} from 'lodash';
import {setString, getItem} from '../lib/localStorage';

const mapOptionsDefaults = {
  center:            {
    lat: 47.35195,
    lng: 7.90781
  },
  zoom:              8,
  maxZoom:           18,
  streetViewControl: false,
  fullscreenControl: false,
  mapId: 'ef99df0ba107dc42',
  restriction: {
    latLngBounds: {
      north: 48.2,
      south: 45.6,
      east:  11.01,
      west:  5.5
    }
  }
};

export default {
  name:       'FerropolyMap',
  components: {},
  filters:    {},
  model:      {},
  props:      {
    mapOptions: {
      type:    Object,
      default: function () {
        return mapOptionsDefaults;
      }
    },
    /**
     * How many pixels shall be the map smaller than filling the screen to bottom???
     */
    ySizeReduction: {
      type:    String,
      default: function () {
        return '0';
      }
    }
  },
  data:       function () {
    return {
      mapElement:     undefined,
      map:            undefined,
      googleInstance: null,
    };
  },
  computed:   {},
  /**
   * When Map was mounted
   */
  async mounted() {
    let self            = this;
    this.googleInstance = await mapLoader.getInstance();

    console.log('Google API loaded, creating map...', this.googleInstance);

    let googleInstance = this.googleInstance;
    console.log('GI', googleInstance);

    self.mapOptions.mapTypeControlOptions = {
      mapTypeIds: [this.googleInstance.MapTypeId.ROADMAP, this.googleInstance.MapTypeId.TERRAIN, 'swisstopo',
                   this.googleInstance.MapTypeId.SATELLITE]
    };

    let mapOptions = assign(mapOptionsDefaults, self.mapOptions);

    if (!self.mapOptions.center) {
      self.mapOptions.center = mapOptionsDefaults.center;
    }

    self.map = new this.googleInstance.Map(document.getElementById('map'), mapOptions);

    console.log('Map created', mapOptions, self.map);

    // Saving map-types to the local storage
    self.map.addListener('maptypeid_changed', () => {
      console.log('Maptype changed', self.map.getMapTypeId());
      setString('ferropoly-map', self.map.getMapTypeId());
    });

    let swissMap = WmsMapType({
      url:         'https://wms.geo.admin.ch',
      layers:      'ch.swisstopo.pixelkarte-farbe',
      name:        'Swiss Topo',
      alt:         'swiss_topo',
      version:     '1.1.1',
      transparent: false,
      maxZoom:     55,
      format:      'image/jpeg'
    });

    self.map.mapTypes.set('swisstopo', swissMap);
    self.map.setMapTypeId(getItem('ferropoly-map', 'roadmap'));
    self.resizeHandler();

    self.map.addListener('center_changed', () => {
      self.$emit('center-changed', self.map.getCenter())
    });
    self.map.addListener('zoom_changed', () => {
      self.$emit('zoom-changed', self.map.getZoom())
    });
    console.log('Google Map Initialized');
    self.$emit('map', self.map);

  },
  /**
   * When Map was Created
   */
  created() {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler(null);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    /**
     * Sets the focus on the property: if the property
     * is in the current viewport, nothing is done. Otherwise
     * it is centered to the map
     */
    setFocusOnProperty(property) {
      let pos = property.marker.getPosition();
      if (!this.map.getBounds().contains(pos)) {
        this.map.panTo(pos);
      }
    },
    /**
     * Sets the maps bounds
     * @param bounds is a this.googleInstance.Map.LatLngBoundsLiteral
     */
    panToBounds(bounds) {
      this.map.panToBounds(bounds);
    },
    /**
     * Sets the maps bounds including zoom
     * @param bounds is a this.googleInstance.Map.LatLngBoundsLiteral
     */
    fitBounds(bounds) {
      this.map.fitBounds(bounds);
    },
    /**
     * Sets the map center
     * @param center is a this.googleInstance.Map.LatLngLiteral
     */
    setCenter(center) {
      this.map.setCenter(center);
    },
    /**
     * Sets the zoom of the map
     * @param zoom
     */
    setZoom(zoom) {
      this.map.setZoom(zoom);
    },
    /**
     * Creates the maximum Size
     */
    resizeHandler() {
      console.log('resize');
      this.mapElement = $('#map');
      let parentWidth = this.mapElement.parent().width();

      let hDoc      = $(window).height();
      let offsetMap = this.mapElement.offset();
      console.log(hDoc, offsetMap);

      if (this.mapElement && offsetMap) {
        this.mapElement.height(hDoc - offsetMap.top - parseInt(this.ySizeReduction));
        this.mapElement.width(parentWidth);
      } else {
        console.log('Map not ready yet');
      }
    }
  }
}
</script>

<style scoped>
#map {
  width: 400px;
  height: 400px;
  background-color: lightgrey;
}
</style>
