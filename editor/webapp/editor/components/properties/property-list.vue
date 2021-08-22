<!---
  List with the properties for the editor
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  #property-list
    b-table(
      striped
      small
      :items="properties"
      :fields="fields"
      responsive="sm"
      sort-by="location.name"
      :filter="filter"
      :filter-function="filterFunction"
      @filtered="onFiltered"
    )
      template(#cell(location.name)="data")
        a(href='#' @click="onLocationClick(data.item)") {{data.item.location.name}}
      template(#cell(location.accessibility)="data") {{data.item.location.accessibility | formatAccessibility}}
      template(#cell(pricelist.priceRange)="data") {{data.item.pricelist.priceRange | formatPriceRange}}

</template>

<script>

import {formatAccessibility, formatPriceRange} from '../../../common/lib/formatters';
import $ from 'jquery';

export default {
  name   : 'property-list',
  props  : {
    properties: {
      type   : Array,
      default: function () {
        return [];
      }
    },
    filter    : {
      type   : String,
      default: function () {
        return '';
      }
    },
    filterType: {
      type   : String,
      default: function () {
        return null;
      }
    }
  },
  data   : function () {
    return {
      fields: [
        {key: 'location.name', label: 'Ort', sortable: true},
        {key: 'location.accessibility', label: 'Erreichbarkeit', sortable: true},
        {key: 'pricelist.priceRange', label: 'Preisklasse', sortable: true}
      ]
    };
  },
  model  : {},
  mounted: function () {
    this.resizeHandler();
  },
  created: function () {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  computed  : {},
  methods   : {
    /**
     * Property was clicked, fire property-selected event
     * @param p Property
     */
    onLocationClick(p) {
      console.log(`selected ${p.location.name}`);
      this.$emit('property-selected', p);
    },
    /**
     * Filters the rows accorting to the filter type (passed in the props). See the function
     * for valid types
     * @param row
     * @param filter is the string (!!) provided by the filter property
     * @returns {boolean}
     */
    filterFunction(row, filter) {
      if (this.filterType) {
        if (this.filterType === 'accessibility') {
          return row.location.accessibility === filter;
        }
        if (this.filterType === 'priceRange') {
          if (filter === 'allInList') {
            return row.pricelist.priceRange >= 0;
          }
          return row.pricelist.priceRange.toString() === filter;
        }
        if (this.filterType === 'location') {
          return row.location.name.toLowerCase().includes(filter);
        }
      }
      return true;
    },
    /**
     * Creates the maximum Size of the list
     */
    resizeHandler() {
      let element       = $('#property-list');
      let hDoc          = $(window).height();
      let offsetElement = element.offset();
      console.log('rh', hDoc, offsetElement);
      if (offsetElement) {
        element.height(hDoc - offsetElement.top);
      }
    },
    /**
     * Only forwarding the internal 'filtered' event
     * @param f
     */
    onFiltered(f) {
      this.$emit('filtered', f);
    }
  },
  components: {},
  filters   : {formatAccessibility, formatPriceRange}
}
</script>

<style scoped>
#property-list {
  overflow: auto;
  font-size: 12px;
  height: 200px;
}
</style>
