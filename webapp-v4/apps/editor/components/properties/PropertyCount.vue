<!---
  Panel with the number of properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->
<template lang="pug">
  prime-panel(:header="panelHeader" toggleable collapsed)
    meter-group(:value="meterValue")
</template>
<script>

import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';

import MeterGroup from 'primevue/metergroup';
import PrimePanel from 'primevue/panel';

export default {
  name:       'PropertyCount',
  components: {MeterGroup, PrimePanel},
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
      console.log('ORTE', nb);
      return 'Orte in Preisliste:' + nb;
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
