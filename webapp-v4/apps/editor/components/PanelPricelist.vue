<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid.mt-2
    .col-6
      pricelist-settings
    .col-3
      prime-button(severity="primary" @click="onSave") Speichern und weiter
  .grid.m1(v-if="apiErrorMessage")
    .col-12
      prime-message(severity="error") {{apiErrorMessage}}
</template>
<script>

import PricelistSettings from './pricelist/PricelistSettings.vue';
import PrimeButton from 'primevue/button';
import PrimeMessage from 'primevue/message';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';

export default {
  name:       'PanelPricelist',
  components: {PricelistSettings, PrimeButton, PrimeMessage},
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
        console.log('no good 2', result)
        this.errorMessage = result?.message;
        return;
      }
      this.$router.push('/rent');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
