<!---
  Filter for properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 11.08.21
-->
<template lang="pug">
  div
    ferro-card(:title="title" size="sm")
      b-form-select(
        size="sm"
        v-model="filterType"
        :options="filterOptions"
        @input="filterTypeUpdated"
      )
      div.selector(v-if="noFilterActive")
        b-form-input(
          size="sm"
          disabled=true
        )
      div.selector(v-if="locationFilterActive")
        b-form-input(
          v-model="locationFilter"
          size="sm"
          placeholder="Name des Ortes"
          @input="locationFilterUpdated"
        )
      div.selector(v-if="accessibilityFilterActive")
        b-form-select(
          v-model="accessibilityFilter"
          :options="accessOptions"
          size="sm"
          @input="accessibilityFilterUpdated"
        )
      div.selector(v-if="priceRangeFilterActive")
        b-form-select(
          v-model="priceRangeFilter"
          :options="usageOptions"
          size="sm"
          @input="priceRangeFilterUpdated"
        )

</template>

<script>
import FerroCard from '../../../common/components/ferro-card/ferro-card.vue';
import {formatPriceRange, formatAccessibility} from '../../../common/lib/formatters';

export default {
  name      : 'property-filter',
  props     : {
    nbSelected: 0,
    nbTotal   : 0
  },
  data      : function () {
    return {
      locationFilter     : '',
      accessibilityFilter: 'train',
      priceRangeFilter   : '-1',
      filterType         : 'all'
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    /**
     * Title containing some additional information
     */
    title() {
      return `Ortfilter (${this.nbSelected} / ${this.nbTotal})`;
    },
    /**
     * Options for the combo
     * @returns {[{text: string, value: string}, {text: string, value: string}, {text: string, value: string}, {text: string, value: string}]}
     */
    filterOptions() {
      return ([
        {text: 'alle Orte anzeigen', value: 'all'},
        {text: 'Filtern nach Name', value: 'location'},
        {text: 'Filtern nach Erreichbarkeit', value: 'accessibility'},
        {text: 'Filtern nach Verwendung', value: 'priceRange'},
      ])
    },
    locationFilterActive() {
      return (this.filterType === 'location');
    },
    accessibilityFilterActive() {
      return (this.filterType === 'accessibility');
    },
    noFilterActive() {
      return (this.filterType === 'all');
    },
    priceRangeFilterActive() {
      return (this.filterType === 'priceRange');
    },
    /**
     * Options for the usage
     * @returns {[{text: string, value: string}, {text: string, value: string}, {text: string, value: string}, {text: string, value: string}, {text: string, value: string}, null, null, null]}
     */
    usageOptions() {
      return ([
        {text: formatPriceRange(-1), value: '-1'},
        {text: 'Alle in Preisliste', value: 'allInList'},
        {text: formatPriceRange(0), value: '0'},
        {text: formatPriceRange(1), value: '1'},
        {text: formatPriceRange(2), value: '2'},
        {text: formatPriceRange(3), value: '3'},
        {text: formatPriceRange(4), value: '4'},
        {text: formatPriceRange(5), value: '5'},
      ]);
    },
    /**
     * Options for the access
     * @returns {[{text: string, value: string}, {text: string, value: string}, {text: string, value: string}, {text: string, value: string}, {text: string, value: string}]}
     */
    accessOptions() {
      return ([
        {text: formatAccessibility('train'), value: 'train'},
        {text: formatAccessibility('bus'), value: 'bus'},
        {text: formatAccessibility('boat'), value: 'boat'},
        {text: formatAccessibility('cablecar'), value: 'cablecar'},
        {text: formatAccessibility('other'), value: 'other'},
      ]);
    }
  },
  methods   : {
    /**
     * Event when filter is updated
     * @returns {}
     */
    filterTypeUpdated() {
      if (this.filterType === 'accessibility') {
        return this.accessibilityFilterUpdated();
      } else if (this.filterType === 'priceRange') {
        return this.priceRangeFilterUpdated();
      } else if (this.filterType === 'location') {
        return this.locationFilterUpdated();
      } else {
        return this.$emit('filter', {filterType: this.filterType, filter: ''});
      }
    },
    priceRangeFilterUpdated() {
      this.$emit('filter', {filterType: this.filterType, filter: this.priceRangeFilter});
    },
    accessibilityFilterUpdated() {
      this.$emit('filter', {filterType: this.filterType, filter: this.accessibilityFilter});
    },
    locationFilterUpdated() {
      this.$emit('filter', {filterType: this.filterType, filter: this.locationFilter.toLowerCase()});
    }
  },
  components: {FerroCard},
  filters   : {},
  mixins    : []
}
</script>

<style lang="scss" scoped>
.selector {
  margin-top: 5px;
}
</style>
