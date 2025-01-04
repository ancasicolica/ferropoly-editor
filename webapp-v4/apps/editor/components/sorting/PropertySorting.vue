<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.12.2024
-->
<template lang="pug">
  .grid
    .col-4
      slick-list#property-list(axis="y" v-model:list="properties" useDragHandle)
        slick-item.property(:class="`group-${(p.pricelist.propertyGroup % 2) || 0}`"  v-for="(p, i) in properties" :key="p" :index="i")
          div.slick-item-content.flex.justify-content-between.align-items-center
            drag-handle.draghandle
              i(class="pi pi-bars")
            span(@click="selectProperty(p)") &nbsp;{{p.location.name}}
            span &nbsp;
    .col-8
      div
        .title.mb-2(v-if="selectedProperty") {{selectedPropertyGroupItemCaption}}
        .title.mb-2(v-if="!selectedProperty") Bitte Ort aus Liste auswählen

        ferropoly-map(ref="map"
          :map-options="mapOptions"
          @map="onNewMap")
</template>
<script>

import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';
import {mapWritableState} from 'pinia';
import PrimeButton from 'primevue/button';
import {SlickList, SlickItem, DragHandle} from 'vue-slicksort'
import $ from 'jquery';
import FerropolyMap from '../../../../common/components/FerropolyMap.vue';
import Property from '../../../../common/lib/Property';
let activeMap = null;

export default {
  name:       'PropertySorting',
  components: {FerropolyMap, PrimeButton, SlickList, SlickItem, DragHandle},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {
    range: {
      type:    String,
      default: () => {
        return '0';
      }
    }
  },
  data:       function () {
    return {
      editorPropertyStore:   useEditorPropertiesStore(),
      activePropertiesOnMap: []
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
    selectedPropertyGroupItemCaption() {
      if (this.selectedProperty === null) {
        return '';
      }
      const props = this.editorPropertyStore.getPropertiesOfGroup(this.selectedProperty.pricelist.propertyGroup);
      let retVal  = `Orte in Gruppe: ${props[0].location.name}`;
      for (let i = 1; i < props.length; i++) {
        retVal += ` / ${props[i].location.name}`;
      }
      return retVal;
    },
    selectedPropertyGroup() {
      if (this.selectedProperty === null) {
        return [];
      }
      return this.editorPropertyStore.getPropertiesOfGroup(this.selectedProperty.pricelist.propertyGroup);
    },
    properties: {
      get() {
        return this.editorPropertyStore.getPropertiesOfRange(parseInt(this.range));
      },
      async set(properties) {
        // Saving the property data online
        await this.editorPropertyStore.savePositionsInPricelist(properties);
        this.selectProperty(this.selectedProperty);
      }
    }
  },
  created:    function () {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
   },
  mounted() {
    this.resizeHandler();
    this.editorPropertyStore.getPropertyList().on('property-selected', this.propertySelected);
  },
  unmounted() {
    Property.closeInfoWindow();
    this.editorPropertyStore.getPropertyList().removeListener('property-selected', this.propertySelected);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    test() {
      this.editorPropertyStore.createPriceList();
    },
    /**
     * Creates the maximum Size of the list
     */
    resizeHandler() {
      let element       = $('#property-list');
      let hDoc          = $(window).height();
      let offsetElement = element.offset();
      if (offsetElement) {
        element.height(hDoc - offsetElement.top);
      }
    },
    /**
     * A property was selected
     * @param property
     */
    selectProperty(property) {
      console.log('Selected property', property);
      if (property === null) {
        return;
      }
      const self            = this;
      const propertyList    = this.editorPropertyStore.getPropertyList();
      this.selectedProperty = property;

      self.activePropertiesOnMap.forEach(p => {
        propertyList.showPropertyOnMap(p.uuid, null);
      })
      self.activePropertiesOnMap = [];

      const props = this.editorPropertyStore.getPropertiesOfGroup(this.selectedProperty.pricelist.propertyGroup);
      props.forEach(p => {
        propertyList.showPropertyOnMap(p.uuid, activeMap);
        self.activePropertiesOnMap.push(p);
      })
    },
    /**
     * A new map instance was created, we're using this one now
     */
    onNewMap(map) {
      console.log('new Map!', map);
      activeMap = map;
      const propertyList = this.editorPropertyStore.getPropertyList();
      this.$refs.map.setCenter(propertyList.getCenter());
      this.$refs.map.fitBounds(propertyList.getBounds());
    },
    propertySelected(property) {
      property.showInfoWindow(property.location.name);
    }
  }
}

</script>


<style scoped lang="scss">
.property {
  margin-bottom: 4px;
  border-width: thin;
  border-color: #a6a6aa;
  border-bottom: solid;

}

.draghandle {
  cursor: grab;
}

.slick-item-content {
  padding-left: 4px;
  padding-right: 2px;
  padding-top: 2px;
}


.group-0 {
  background-color: #b8f8a3;
}

.group-1 {
  background-color: #faec76;
}

#property-list {
  overflow: auto;
  font-size: 12px;
  height: 200px;
}

.title {
  font-size: large;
}
</style>
