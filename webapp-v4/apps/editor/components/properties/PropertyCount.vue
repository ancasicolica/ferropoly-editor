<!---
  Panel with the number of properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->
<template lang="pug">
  prime-panel(:header="panelHeader" toggleable collapsed @update:collapsed="onCollapsedChanged")
    meter-group(:value="meterValue" :max="nbOfProperties")
      template(#label="{value, percentages}")
        .flex.flex-row.flex-wrap
          property-count-label(v-for="v in value" :label="v.label" :value="v.value" :color="v.color")

</template>
<script>

import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';

import MeterGroup from 'primevue/metergroup';
import PrimePanel from 'primevue/panel';
import PropertyCountLabel from './PropertyCountLabel.vue';

export default {
  name:       'PropertyCount',
  components: {PropertyCountLabel, MeterGroup, PrimePanel},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {}
  },
  computed:   {
    panelHeader() {
      let nb = useEditorPropertiesStore().getNumberOfPropertiesInPricelist();
      return 'Orte in Preisliste: ' + nb;
    },
    nbOfProperties() {
      return useEditorPropertiesStore().getNumberOfPropertiesInPricelist();
    },
    meterValue() {
      const store = useEditorPropertiesStore();
      return [
        {label: 'sehr billig', value: store.getPropertiesOfRange(0).length, color: '#eeeeee'},
        {label: 'billig', value: store.getPropertiesOfRange(1).length, color: '#ffc0c0'},
        {label: 'unteres Mittelfeld', value: store.getPropertiesOfRange(2).length, color: '#ff6060'},
        {label: 'oberes Mittlelfeld', value: store.getPropertiesOfRange(3).length, color: '#ff0000'},
        {label: 'teuer', value: store.getPropertiesOfRange(4).length, color: '#800000'},
        {label: 'sehr teuer', value: store.getPropertiesOfRange(5).length, color: '#000000'},
      ]
    }
  },
  created:    function () {
  },
  methods:    {
    onCollapsedChanged() {
      this.$emit('size-update');
    }
  }
}

</script>


<style scoped lang="scss">
::v-deep(.p-panel-header) {
  padding-top: 8px;
  padding-bottom: 8px;
}

::v-deep(.p-panel-content) {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
