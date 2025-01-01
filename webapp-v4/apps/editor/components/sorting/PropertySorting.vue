<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.12.2024
-->
<template lang="pug">
  div.flex.justify-content-left.align-items-center
    slick-list(axis="y" v-model:list="properties" useDragHandle)
      slick-item.property(:class="`group-${(p.pricelist.propertyGroup % 2) || 0}`"  v-for="(p, i) in properties" :key="p" :index="i")
        div.slick-item-content.flex.justify-content-between.align-items-center
          drag-handle.draghandle
            i(class="pi pi-bars")
          | &nbsp;{{p.location.name}}
          a(:href="createLink(p)" target="_blank")
            i.right-icon(class="pi pi-external-link")
</template>
<script>

import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';
import {mapWritableState} from 'pinia';
import PrimeButton from 'primevue/button';
import {SlickList, SlickItem, DragHandle} from 'vue-slicksort'

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
      ready: 'ready'
    }),
    properties: {
      get() {
        if (!this.ready) {
          console.log('not ready yet')
          return [];
        }
        return this.editorStore.getPropertiesOfRange(parseInt(this.range));
      },
      set(properties) {
        console.log(properties);
        for (let i = 0; i < properties.length; i++) {
          properties[i].pricelist.positionInPriceRange = i;
        }
        this.editorStore.updateProperties(properties);
        this.editorStore.createPriceList();
      }

    }
  },
  created:    function () {
    console.log('created', this.range, this.ready);
  },
  mounted() {
    console.log('mounted', this.range, this.ready);
  },
  methods: {
    test() {
      this.editorStore.createPriceList();
    },
    createLink(property) {
      return `https://www.google.ch/maps/place/${property.location.position.lat}+${property.location.position.lng}/@${property.location.position.lat},${property.location.position.lng},12.00z`
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
  width: 120%;
}

.draghandle {
  cursor: grab;
}
.slick-item-content {
  padding-left: 4px;
  padding-right: 2px;
  padding-top: 2px;
}

.property-list {
  width: 400px;
}
.group-0 {
  background-color: #b8f8a3;
}
.group-1 {
  background-color: #faec76;
}

</style>
