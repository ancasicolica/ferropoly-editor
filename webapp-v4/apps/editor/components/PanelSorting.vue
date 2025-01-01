<!---
  The panel for sorting the properties into correct order
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  h1 Reihenfolge
  progress-spinner(v-if="!ready")
  tabs(value="0" v-if="ready" lazy)
    tab-list
      tab(value="0") Sehr billig
      tab(value="1") Billig
      tab(value="2") Unteres Mittelfeld
      tab(value="3") Oberes Mittelfeld
      tab(value="4") Teuer
      tab(value="5") Sehr teuer
    tab-panels
      tab-panel(value="0")
        property-sorting(range=0)
      tab-panel(value="1")
        property-sorting(range=1)
      tab-panel(value="2")
        property-sorting(range=2)
      tab-panel(value="3")
        property-sorting(range=3)
      tab-panel(value="4")
        property-sorting(range=4)
      tab-panel(value="5")
        property-sorting(range=5)
</template>
<script>


import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import ProgressSpinner from 'primevue/progressspinner';
import {mapWritableState} from 'pinia';
import { defineAsyncComponent } from 'vue';
import {useEditorStore} from '../store/editorStore';

export default {
  name:       'PanelSorting',
  components: {PropertySorting: defineAsyncComponent(() =>
        import('./sorting/PropertySorting.vue')
    ), Tabs, TabList, Tab, TabPanels, TabPanel, ProgressSpinner},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
    }
  },
  computed:   {
    /**
     * Important issue about the panels and stores:
     * The property-sorting elements must not be loaded before the editor store property is set to ready.
     * Reason: the initialisation of the property store fires a bloody high number of update events as
     * more than 1000 properties are being initialized. Avoid loading the store before this initialisation
     * is over under any circumstances, it would take about 10 to 20 seconds otherwise (for a task needing
     * less than a second)
     */
    ...mapWritableState(useEditorStore, {
      ready: 'ready'
    }),
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
