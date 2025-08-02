<!---
  The panel with the basic settings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div class="ferropoly-container">
    <h1>Spieldaten</h1>
    <div class="grid gap-x-4 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <contact-info></contact-info>
      <game-timing></game-timing>
      <div>
        <game-info></game-info>
        <div class="mt-4">
          <prime-button severity="primary" @click="onSave">Speichern und weiter</prime-button>
        </div>
      </div>

    </div>
    <div v-if="apiErrorMessage">
      <prime-message severity="error">{{apiErrorMessage}}</prime-message>
    </div>
  </div>
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
        console.log('no good', result);
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
