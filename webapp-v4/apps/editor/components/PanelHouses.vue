<!---
  Panel with the factors for the houses and hotel
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div class="ferropoly-container">
    <div class="grid gap-x-4 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <rent-factor-settings></rent-factor-settings>
      <div class="col-span-2">
        <div class="grid gap-x-4 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2">
        <house-cost-settings></house-cost-settings>
        <property-group-setting></property-group-setting>
        </div>
        <div>
          <rent-preview></rent-preview>
          <div class="mt-4 flex justify-end">
            <prime-button severity="primary" @click="onSave">Speichern und weiter</prime-button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="apiErrorMessage">
      <prime-message severity="error">{{ apiErrorMessage }}</prime-message>
    </div>
  </div>
</template>
<script>

import RentFactorSettings from './houses/RentFactorSettings.vue';
import HouseCostSettings from './houses/HouseCostSettings.vue';
import PropertyGroupSetting from './houses/PropertyGroupSetting.vue';
import RentPreview from './houses/RentPreview.vue';
import PrimeButton from 'primevue/button';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import PrimeMessage from 'primevue/message';

export default {
  name:       'PanelHouses',
  components: {RentPreview, PropertyGroupSetting, HouseCostSettings, RentFactorSettings, PrimeButton, PrimeMessage},
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
        console.log('no good', result);
        this.errorMessage = result?.message;
        return;
      }
      this.$router.push('/chance');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
