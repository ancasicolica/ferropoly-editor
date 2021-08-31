<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-sorting
    h1 Reihenfolge
    b-tabs(content-class="mt-3")
      b-tab(title="Sehr billig")
        property-sorting(:properties="veryCheapProperties" @update="updateProperties")
      b-tab(title="Billig")
        property-sorting(:properties="cheapProperties" @update="updateProperties")
      b-tab(title="Unteres Mittelfeld")
        property-sorting(:properties="lowerMidProperties" @update="updateProperties")
      b-tab(title="Oberes Mittelfeld")
        property-sorting(:properties="upperMidProperties" @update="updateProperties")
      b-tab(title="Teuer")
        property-sorting(:properties="expensiveProperties" @update="updateProperties")
      b-tab(title="Sehr Teuer")
        property-sorting(:properties="veryExpensiveProperties" @update="updateProperties")

</template>

<script>
import PropertySorting from '../components/sorting/property-sorting.vue'
import {mapFields} from 'vuex-map-fields';
import {filter, find, sortBy} from 'lodash';

export default {
  name      : 'panel-sorting',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'authToken',
      'gameId',
      'properties.propertyList'
    ]),
    veryCheapProperties() {
      return this.getPropertiesOfRange(0);
    },
    cheapProperties() {
      return this.getPropertiesOfRange(1);
    },
    lowerMidProperties() {
      return this.getPropertiesOfRange(2);
    },
    upperMidProperties() {
      return this.getPropertiesOfRange(3);
    },
    expensiveProperties() {
      return this.getPropertiesOfRange(4);
    },
    veryExpensiveProperties() {
      return this.getPropertiesOfRange(5);
    }
  },
  methods   : {
    /**
     * Returns all properties of a given range, takes care of unique positions in the
     * range and sorts them
     * @param range
     */
    getPropertiesOfRange(range) {
      // First get all properties of the given range
      let f = filter(this.propertyList.getProperties(), {'pricelist': {'priceRange': range}});
      // First get all properties of the given range
      let sorted = sortBy(f, 'pricelist.positionInPriceRange');

      let i = 0;
      sorted.forEach(e => {
        e.setPositionInPriceRange(i++);
      });
      // save them!
      this.updateProperties(sorted);

      // Finally sort and return array
      return sorted;
    },
    getPropertiesOfRangerr(range) {
      // First get all properties of the given range
      let f = filter(this.propertyList.getProperties(), {'pricelist': {'priceRange': range}});
      // Then check if we have invalid entries (below zero)
      if (find(f, {'pricelist': {'positionInPriceRange': -1}})) {
        // if so, reindex all
        console.log('resorting range:', range);
        let i = 0;
        f.forEach(e => {
          e.setPositionInPriceRange(i++);
        });
        // save them!
        this.updateProperties(f);
      }
      // Finally sort and return array
      return sortBy(f, 'pricelist.positionInPriceRange');
    },
    /**
     * Updates the changed properties
     * @param props
     */
    updateProperties(props) {
      this.$store.dispatch({type: 'updatePositionInPricelist', properties: props});
    }
  },
  components: {PropertySorting},
  filters   : {}
}
</script>

<style scoped>

</style>
