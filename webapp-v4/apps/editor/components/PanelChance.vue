<!---
  Panel for Chancellery
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div class="ferropoly-container">
    <div class="grid gap-x-4 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2">
      <chance-settings></chance-settings>
      <div>
        <gambling-settings></gambling-settings>
        <div class="mt-4">
          <prime-button severity="primary" @click="onSave">Speichern und weiter</prime-button>
        </div>
      </div>
    </div>
    <div v-if="apiErrorMessage">
      <prime-message severity="error">{{ apiErrorMessage }}</prime-message>
    </div>
  </div>
</template>
<script>

import ChanceSettings from './chance/ChanceSettings.vue';
import GamblingSettings from './chance/GamblingSettings.vue';
import PrimeButton from 'primevue/button';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import PrimeMessage from 'primevue/message';

export default {
  name:       'PanelChance',
  components: {GamblingSettings, ChanceSettings, PrimeButton, PrimeMessage},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      errorMessage: undefined
    }
  },
  computed:   {

    apiErrorMessage() {
      return this.errorMessage;
    }
  },
  created:    function () {
  },
  methods:    {
    async onSave() {
      console.log('save');
      const result = await useGameplayStore().saveGameplay();
      if (!result?.success) {
        // ERROR
        console.log('no good', result)
        this.errorMessage = result?.message;
        return;
      }
      this.$router.push('/properties');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
