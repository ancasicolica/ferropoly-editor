<!---
  Panel with the factors for the houses and hotel
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid.mt-2
    .col-4
      rent-factor-settings
    .col-8
      .grid.align-items-stretch
        .col-6
          house-cost-settings
        .col-6
          property-group-setting
      .grid
        .col-12
          rent-preview
  .grid.mt-1
    .col-12.flex.align-items-center.justify-content-end
      prime-button(severity="primary" @click="onSave") Speichern und weiter
    .col-12(v-if="apiErrorMessage")
      prime-message(severity="error") {{apiErrorMessage}}
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
