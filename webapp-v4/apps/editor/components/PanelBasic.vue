<!---
  The panel with the basic settings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid.m1
    .col-12
       h1 Spieldaten
  .grid.m1
    .col-4
      contact-info
    .col-4
      game-timing
    .col-4
      game-info
      prime-button.mt-5(severity="primary" @click="onSave") Speichern und weiter
  .grid.m1(v-if="apiErrorMessage")
    .col-12
      prime-message(severity="error") {{apiErrorMessage}}
</template>
<script>

import ContactInfo from './basic/ContactInfo.vue';
import GameInfo from './basic/GameInfo.vue';
import GameTiming from './basic/GameTiming.vue';

import PrimeButton from 'primevue/button';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import PrimeMessage from 'primevue/message';
export default {
  name: "PanelBasic",
  components: {ContactInfo, GameInfo, GameTiming, PrimeButton,PrimeMessage},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      errorMessage : undefined
    }
  },
  computed  : {
    apiErrorMessage() {
      return this.errorMessage;
    }
  },
  created   : function () {
  },
  methods   : {
    async onSave() {
      console.log('save');
      const result = await useGameplayStore().saveGameplay();
      if (!result?.success) {
        // ERROR
        console.log('no good')
        this.errorMessage = result?.message;
        return;
      }
      this.$router.push('/pricelist');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
