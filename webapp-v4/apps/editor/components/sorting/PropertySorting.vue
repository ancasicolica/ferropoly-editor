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
            a(:href="createLink(p)" target="_blank")
              i.right-icon(class="pi pi-external-link")
    .col-8
      div(v-if="selectedProperty")
        h1 {{selectedPropertyName}}
        div Orte in Ortsgruppe:&nbsp;
          span(v-for="(p, i) in selectedPropertyGroup" :key="p" :index="i") {{p.location.name}};&nbsp;
</template>
<script>

import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';
import {mapWritableState} from 'pinia';
import PrimeButton from 'primevue/button';
import {SlickList, SlickItem, DragHandle} from 'vue-slicksort'
import $ from 'jquery';
import {get} from 'lodash'

export default {
  name:       'PropertySorting',
  components: {PrimeButton, SlickList, SlickItem, DragHandle},
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
      editorStore: useEditorPropertiesStore()
    }
  },
  computed:   {
    ...mapWritableState(useEditorPropertiesStore, {
      selectedProperty: 'selectedProperty'
    }),
    selectedPropertyName() {
      if (this.selectedProperty === null) {
        return 'Kein Ort ausgewählt';
      }
      return get(this.selectedProperty, 'location.name', 'Ortsname fehlt');
    },
    selectedPropertyGroup() {
      if (this.selectedProperty === null) {
        return [];
      }
      return this.editorStore.getPropertiesOfGroup(this.selectedProperty.pricelist.propertyGroup);
    },
    properties: {
      get() {
        return this.editorStore.getPropertiesOfRange(parseInt(this.range));
      },
      set(properties) {
        for (let i = 0; i < properties.length; i++) {
          properties[i].pricelist.positionInPriceRange = i;
        }
        this.editorStore.updateProperties(properties);
        this.editorStore.createPriceList();
      }
    }
  },
  created:    function () {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  },
  mounted() {
    this.resizeHandler();
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    test() {
      this.editorStore.createPriceList();
    },
    createLink(property) {
      return `https://www.google.ch/maps/place/${property.location.position.lat}+${property.location.position.lng}/@${property.location.position.lat},${property.location.position.lng},12.00z`
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
    selectProperty(property) {
      console.log('Selected property', property);
      this.selectedProperty = property;
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
</style>
