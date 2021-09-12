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
          p Anzahl registrierte Benutzer: {{userNb}}
      b-row
        b-col
          h2 Registrierte Spiele
          dashboard-gp-list(:gameplays="gameplays")


</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue'
import {getNbOfUsers, getGameplays} from '../adapter/dashboard';
import dashboardGpList from './dashboard-gp-list.vue';
import {DateTime} from 'luxon';

export default {
  name      : 'dashboard-root',
  props     : {},
  data      : function () {
    return {
      userNb   : 0,
      gameplays: []
    };
  },
  model     : {},
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

  },
  computed  : {},
  methods   : {},
  components: {MenuBar, dashboardGpList},
  filters   : {},
  mixins    : []
}
</script>

<style lang="scss" scoped>

</style>
