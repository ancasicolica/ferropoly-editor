<!---
  Selecting the properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid
    prime-toast
    .col-6
      ferropoly-map(ref="map"
        :map-options="mapOptions"
        @map="onNewMap")
    .col-6
      property-count.mt-1
      property-selected.mt-1(:property="selectedProperty" @save-selected-property="onSaveSelectedProperty")
      property-list.mt-1(ref="list" @filter-changed="onFilterChanged" @property-selected="onPropertySelected")
</template>
<script>

import PrimeToast from 'primevue/toast';

import PropertySelected from './properties/PropertySelected.vue';
import PropertyList from './properties/PropertyList.vue';
import FerropolyMap from '../../../common/components/FerropolyMap.vue';
import {useEditorPropertiesStore} from '../../../lib/store/EditorPropertiesStore';
import {mapWritableState} from 'pinia';
import PropertyCount from './properties/PropertyCount.vue';

export default {
  name:       'PanelProperties',
  components: {PropertyCount, FerropolyMap, PropertyList, PropertySelected, PrimeToast},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      map:         null,
      editorStore: useEditorPropertiesStore(),

    }
  },
  computed:   {
    ...mapWritableState(useEditorPropertiesStore, {
      selectedProperty: 'selectedProperty'
    }),
    mapOptions() {
      let opts = {
        zoom: 14
      }
      return opts;
    },
  },
  created:    function () {
  },
  mounted() {
    this.editorStore.getPropertyList().on('property-selected', this.onPropertyOnMapSelected);
  },
  unmounted() {
    this.editorStore.getPropertyList().removeListener('property-selected', this.onPropertyOnMapSelected);
  },
  methods: {
    /**
     * A new map instance was created, we're using this one now
     */
    onNewMap(map) {
      console.log('new Map!', map);
      this.map           = map;
      const propertyList = this.editorStore.getPropertyList();
      propertyList.showAllPropertiesOnMap(map);
      //this.$store.dispatch({type: 'applyFilter', gameId: this.gameId});
      this.$refs.map.setCenter(propertyList.getCenter());
      this.$refs.map.fitBounds(propertyList.getBounds());

      this.editorStore.applyFilter({filterType: 'all'});
    },
    /**
     * Filter changed in list view
     * @param filters
     */
    onFilterChanged(filters) {
      useEditorPropertiesStore().applyFilter(filters);
    },
    onPropertySelected(options) {
      this.$refs.map.setFocusOnProperty(useEditorPropertiesStore().selectPropertyAsActive(options?.uuid));
      this.selectedProperty = options.property;
    },
    onPropertyOnMapSelected(property) {
      console.log('Property selected', property);
      const store = useEditorPropertiesStore();
      store.selectPropertyAsActive(property?.uuid);
      this.selectedProperty = store.getPropertyByUuid(property?.uuid);
    },
    onSaveSelectedProperty() {
      useEditorPropertiesStore().saveSelectedProperty()
          .then(info => {
            if (!info.success) {
              this.$toast.add({
                    severity: 'error',
                    summary:  'Fehler beim Speichern der Daten',
                    detail:   info.message,
                    life:     5000
                  },
              )
            }
          });
    }
  }
}

</script>


<style scoped lang="scss">

</style>
