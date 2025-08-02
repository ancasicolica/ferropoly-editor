<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div class="ferropoly-container">
    <div class="grid gap-x-4 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2 ">
      <pricelist-settings></pricelist-settings>
      <div>
        <prime-button severity="primary" @click="onSave">Speichern und weiter</prime-button>
      </div>
    </div>
    <div v-if="apiErrorMessage">
      <prime-message severity="error">{{apiErrorMessage}}</prime-message>
    </div>
  </div>
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
