<!---
  Shows Infos about a property and gives the user the possibility to select the property
  for the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 11.08.21
-->
<template lang="pug">
  div
    ferro-card(title="Ausgewähltes Ort" size="sm")
      div#property-name {{propertyName}}
      div#accessibility Erreichbarkeit: {{propertyAccess}}
      div#usage Verwendung:
        b-form-select(
          size="sm"
          :value="propertyUsage"
          :options="usageOptions"
          @change="onUsageChange"
        )

</template>

<script>
import FerroCard from '../../../common/components/ferro-card/ferro-card.vue';
import {get} from 'lodash';
import {formatAccessibility, formatPriceRange} from '../../../common/lib/formatters'

export default {
  name      : 'property-selected',
  props     : {
    property: {
      type   : Object,
      default: () => {
        return {
          location : {
            name         : '',
            accessibility: ''
          },
          pricelist: {
            priceRange: -1
          }
        }
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    propertyName() {
      return get(this.property, 'location.name', '');
    },
    propertyAccess() {
      return formatAccessibility(get(this.property, 'location.accessibility', ''));
    },
    propertyUsage: {
      get() {
        return get(this.property, 'pricelist.priceRange');
      }
    },
    usageOptions() {
      return ([
        {text: formatPriceRange(-1), value: -1},
        {text: formatPriceRange(0), value: 0},
        {text: formatPriceRange(1), value: 1},
        {text: formatPriceRange(2), value: 2},
        {text: formatPriceRange(3), value: 3},
        {text: formatPriceRange(4), value: 4},
        {text: formatPriceRange(5), value: 5},
      ]);
    }
  },
  methods   : {
    onUsageChange(u) {
      this.$emit('usage-changed', {property: this.property, usage: u});
    }
  },
  components: {FerroCard},
  filters   : {},
  mixins    : []
}
</script>

<style lang="scss" scoped>
#property-name {
  font-weight: bold;
}
</style>
