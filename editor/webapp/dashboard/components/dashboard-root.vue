<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 12.09.21
-->
<template lang="pug">
  div
    menu-bar(show-user-box=true)
    b-container(fluid=true)
      b-row
        b-col
          h1 Administrator Dashboard
      b-row
        b-col
          h3 Benutzer
          p Anzahl registrierte Benutzer: {{userNb}}
        b-col
          h3 Locations
          b-table-simple(small)
            b-tr
              b-td Maps Version
              b-td {{locationSummary.version}}
            b-tr
              b-td Anzahl Orte total
              b-td {{locationSummary.all}}
            b-tr(v-for="map in locationSummary.maps" :key="map.name")
              b-td(v-if="map.enabled") {{map.name}}
              b-td(v-if="map.enabled") {{map.locationNb}}
        b-col
          h4 Download Ortsdaten
          p
            b-button(href='/locations') Alle Orte downloaden
          h4 Upload Ortsdaten
          location-uploader
      b-row
        b-col
          h3 Registrierte Spiele
          dashboard-gp-list(:gameplays="gameplays")


</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue'
import {getNbOfUsers, getGameplays, getLocationSummary} from '../adapter/dashboard';
import dashboardGpList from './dashboard-gp-list.vue';
import {DateTime} from 'luxon';
import LocationUploader from './location-uploader.vue';

export default {
  name      : 'DashboardRoot',
  components: {LocationUploader, MenuBar, dashboardGpList},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      userNb   : 0,
      gameplays: [],
      locationSummary: {
        version: '0',
        all: 0,
        maps: [{
          "map": "sbb",
          "name": "Ganze Schweiz",
          "description": "Die grösste Karte des Ferropoly: das ganze Schweizer ÖV-Netz",
          "enabled": true,
          "locationNb": 0
        }]
      }
    };
  },
  computed  : {},
  created   : function () {
    let self = this;

    getNbOfUsers((err, info) => {
      if (err) {
        return console.error('Users not read', err);
      }
      console.log('users', info);
      self.userNb = info.userNb;
    });
    getGameplays((err, info) => {
      if (err) {
        return console.error('GPs not read', err);
      }
      let today = DateTime.now();
      info.forEach(gp => {
        let gameDate = DateTime.fromISO(gp.scheduling.gameDate);
        let delta = gameDate.diff(today, 'days').days;
        gp.scheduling.countdown = Math.ceil(delta);
      })
      console.log('gameplays', info);
      self.gameplays = info;
    });
    getLocationSummary((err, summary) => {
      if (err) {
        return console.error('Location summary not read', err);
      }
      this.locationSummary = summary;
      console.log(this.locationSummary);
    });

  },
  methods   : {}
}
</script>

<style lang="scss" scoped>

</style>
