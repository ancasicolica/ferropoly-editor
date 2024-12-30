<!---
  Panel for Chancellery
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid.mt-2
    .col-6
      chance-settings
    .col-6
      gambling-settings
      prime-button.mt-3(severity="primary" @click="onSave") Speichern und weiter
      .div.mt-2(v-if="apiErrorMessage")
        prime-message(severity="error") {{apiErrorMessage}}

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
