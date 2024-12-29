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
      .grid
        .col-6
          house-cost-settings
        .col-6
          property-group-setting
      .grid
        h1 Summary


</template>
<script>

import RentFactorSettings from './houses/RentFactorSettings.vue';
import HouseCostSettings from './houses/HouseCostSettings.vue';
import PropertyGroupSetting from './houses/PropertyGroupSetting.vue';

export default {
  name: "PanelHouses",
  components: {PropertyGroupSetting, HouseCostSettings, RentFactorSettings},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : { },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
