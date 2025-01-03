<!---
  Card element for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">
  div(:class="class")
    Panel(:header="title" :toggleable="toggleable" :class="class")
      slot

</template>
<script>

import Card from 'primevue/card';

import Panel from 'primevue/panel';

export default {
  name:       'FerroCard',
  components: {Card, Panel},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {
    title:      {
      type:    String,
      default: function () {
        return 'Ferropoly';
      }
    },
    size:       {
      type:    String,
      default: function () {
        return 'md';
      }
    },
    toggleable: {
      type:    Boolean,
      default: function () {
        return false;
      }
    },
    fullSize:   {
      type:    Boolean,
      default: function () {
        return false;
      }
    },
    condensed: {
      type:    Boolean,
      default: function () {
        return false;
      }
    },
  },
  data:       function () {
    return {}
  },
  computed:   {
    class() {
      const classes = [];
      // Basis-Klassen
      if (this.fullSize) {
        classes.push('full-size');
      } else {
        classes.push('normal-size');
      }
      // Optionales Hinzufügen von 'is-condensed'
      if (this.condensed) {
        classes.push('is-condensed');
      }
      console.log('classes', classes);
      return classes;
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">
.full-size {
  width: 100%;
  height: 100%;
}

.normal-size {
  width: 100%;
}

::v-deep(.is-condensed  .p-panel-header) {
  background-color: #2aabd2;
  padding-top: 8px;
  padding-bottom: 8px;
}
::v-deep(.is-condensed  .p-panel-content) {
  background-color: rgba(245, 244, 239, 0.99);
  padding-top: 8px;
  padding-bottom: 8px;
}

</style>
