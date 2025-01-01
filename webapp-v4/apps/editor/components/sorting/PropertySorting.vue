<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.12.2024
-->
<template lang="pug">
  h1 Range {{range}}
  prime-button(@click="test") Preisliste erstellen
  slick-list(axys="y" v-model:list="properties")
    slick-item.property(v-for="(p, i) in properties" :key="p" :index="i") {{p.location.name}} {{p.pricelist.positionInPriceRange}} {{p.pricelist.position}}
</template>
<script>

import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';
import {mapWritableState} from 'pinia';
import PrimeButton from 'primevue/button';
import {SlickList, SlickItem} from 'vue-slicksort'

export default {
  name:       'PropertySorting',
  components: {PrimeButton, SlickList, SlickItem},
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
    }
  }
}

</script>


<style scoped lang="scss">
.property {
  width: 200px;
  height: 48px;
  margin-bottom: 4px;
  margin-right: 4px;
  padding-left: 3px;
  border-style: solid;
  border-width: thin;
  border-color: #a6a6aa;
}
</style>
