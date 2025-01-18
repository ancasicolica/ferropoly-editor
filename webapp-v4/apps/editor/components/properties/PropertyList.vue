<!---
  List of the properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.01.2025
-->
<template lang="pug">
  #property-list
    data-table(
      :value="properties"
      v-model:filters="filters"
      ref="dataTable"
      paginator
      :page-link-size="pageLinkSize"
      :rows="rows"
      sort-field="location.name"
      :sort-order="1"
    )
      template(#header)
        .flex
          .flex-1.mr-1
            prime-select(class="md:56" v-model="filterMode" :options="filterModes" option-label="name" option-value="value" size="small" fluid @change="onFilterChanged")

          .flex-1.ml-1(v-if="filterMode==='name'")
            icon-field
              input-icon
                i.pi.pi-search
              input-text(v-model="filters['location.name'].value" placeholder="Suche nach Ort" fluid size="small" )

          .flex-1.ml-1(v-if="filterMode==='access'")
            prime-select(v-model="filters['location.accessibility'].value" placeholder="Alle Orte anzeigen" :options="accessModes" option-label="name" option-value="value" fluid size="small")

          .flex-1.ml-1(v-if="filterMode==='use'")
            prime-select(v-model="filters['pricelist.priceRange'].value" placeholder="Alle Orte anzeigen" :options="priceRanges" option-label="name" option-value="value" fluid size="small")


      column(field = "location.name" sortable header="Ort")
        template(#body="slotProps")
          span.location-name(@click="selectProperty(slotProps.data)") {{slotProps.data.location.name}}
      column(field="location.accessibility" sortable header="Erreichbarkeit")
        template(#body="slotProps")
          span {{formatAccessibility(slotProps.data.location.accessibility)}}
      column(field="pricelist.priceRange" sortable header="Verwendung")
        template(#body="slotProps")
          span {{formatPriceRange(slotProps.data.pricelist.priceRange)}}
</template>
<script>

import $ from 'jquery';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import PrimeSelect from 'primevue/select';

import InputText from 'primevue/inputtext';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';
import {mapWritableState} from 'pinia';
import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';                   // optional
import {FilterMatchMode} from '@primevue/core/api';
import {formatAccessibility, formatPriceRange} from '../../../../common/lib/formatters';
import {toRaw} from 'vue';

export default {
  name:       'PropertyList',
  components: {DataTable, Column, ColumnGroup, Row, IconField, InputIcon, InputText, PrimeSelect},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      rows:         5,
      pageLinkSize: 10,
      filters:      {
        'location.name':          {value: null, matchMode: FilterMatchMode.CONTAINS},
        'location.accessibility': {value: null, matchMode: FilterMatchMode.EQUALS},
        'pricelist.priceRange':   {value: null, matchMode: FilterMatchMode.EQUALS},
      },
      filterMode:   'name',
      filterModes:  [
        {name: 'Alle Orte anzeigen', value: 'all'},
        {name: 'Filtern nach Name', value: 'name'},
        {name: 'Filtern nach Erreichbarkeit', value: 'access'},
        {name: 'Filtern nach Verwendung', value: 'use'},
      ],
      accessModes:  [
        {name: 'Alle Orte anzeigen', value: null},
        {name: 'Bahn', value: 'train'},
        {name: 'Bus', value: 'bus'},
        {name: 'Schiff', value: 'boat'},
        {name: 'Seilbahn / Standseilbahn', value: 'cablecar'},
      ],
      priceRanges:  [
        {name: 'Alle Orte anzeigen', value: null},
        {name: 'unbenutzt', value: -1},
        {name: 'sehr billig', value: 0},
        {name: 'billig', value: 1},
        {name: 'unteres Mittelfeld', value: 2},
        {name: 'oberes Mittelfeld', value: 3},
        {name: 'teuer', value: 4},
        {name: 'sehr teuer', value: 5},
      ],

    }
  },
  computed:   {
    ...mapWritableState(useEditorPropertiesStore, {
      properties: 'properties'
    }),
    selectedProperty: {
      get() {
        return null;
      },
      set(p) {
        console.log(p);
      }
    }
  },
  watch:      {
    /**
     * this one is a watch over the filters field: will be triggered when an element changes
     */
    filters: {
      deep: true,
      handler(newFilters) {
        const rawFilters = toRaw(newFilters);
        // Converting the (primevue-) filter to our internal type
        const f          = {
          filterType: 'none',
          filter:     'none'
        }
        if (rawFilters['location.accessibility']?.value) {
          f.filter     = rawFilters['location.accessibility']?.value;
          f.filterType = 'accessibility';
        } else if (rawFilters['location.name']?.value) {
          f.filter     = rawFilters['location.name']?.value.toLowerCase();
          f.filterType = 'location';
        } else if (rawFilters['pricelist.priceRange']?.value !== null) {
          f.filter     = rawFilters['pricelist.priceRange']?.value
          f.filterType = 'priceRange';
        } else {
          f.filterType = 'all';
        }
        console.log('Filtering changed', rawFilters, f);
        this.$emit('filter-changed', f);
      }
    }
  },
  mounted:    function () {
    this.resizeHandler();
  },
  created:    function () {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    selectProperty(p) {
      this.selected = p;
      this.$emit('property-selected', {uuid: p.uuid, property: p});
    },
    formatPriceRange(r) {
      return formatPriceRange(r);
    },
    formatAccessibility(a) {
      return formatAccessibility(a);
    },
    onFilterChanged() {
      this.filters['location.name'].value          = null;
      this.filters['location.accessibility'].value = null;
      this.filters['pricelist.priceRange'].value   = null;
    },
    /**
     * Creates the maximum Size of the list
     */
    resizeHandler() {
      const element           = $('#property-list');
      const hDoc              = $(window).height();
      const offsetElement     = element.offset();
      const rowHeight         = 40;
      const tableHeaderHeight = 120;
      const paginatorHeight   = 40;

      if (offsetElement) {
        const availableHeight = hDoc - offsetElement.top;
        const contentHeight   = availableHeight - tableHeaderHeight - paginatorHeight; // Space for rows
        const maxRows         = Math.floor(contentHeight / rowHeight); // Max number of visible cells

        element.height(availableHeight);

        // Dynamisch die Anzahl Zeilen setzen
        this.rows = Math.max(maxRows, 1); // show at least one row
      }
    }
  }
}

</script>


<style scoped lang="scss">
#property-list {
  overflow: auto;
  font-size: 12px;
  height: 200px;
}

.location-name {
  color: cornflowerblue;
  cursor: pointer;
}

::v-deep(.p-datatable-hoverable .p-datatable-selectable-row) {
  cursor: default;
}
</style>
