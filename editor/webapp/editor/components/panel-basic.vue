<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-basic
    h1 Spieldaten
    b-row
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        contact-info
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        game-timing
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        game-info
        b-button(variant="primary" v-on:click="saveAndContinue") Speichern und weiter
</template>

<script>

import ContactInfo from './basic/contact-info.vue';
import GameInfo from './basic/game-info.vue';
import GameTiming from './basic/game-timing.vue';

export default {
  name      : 'panel-basic',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {

  },
  computed  : {
  },
  methods   : {
    saveAndContinue() {
      console.log('save and continue');
      this.$emit('panel-change', 'panel-player');
    }
  },
  components: {ContactInfo, GameInfo, GameTiming},
  filters   : {}
}
</script>

<style scoped>

</style>
