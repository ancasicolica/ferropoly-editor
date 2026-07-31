<!---
  Card element for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template>
  <div :class="cardClass">
    <Panel :header="title" :toggleable="toggleable" :class="cardClass">
      <slot></slot>
      <template #icons>
        <slot name="controls"></slot>

      </template>
    </Panel>
  </div>


</template>
<script setup>
import Panel from 'primevue/panel';
import {computed} from 'vue';

const emit  = defineEmits(['download']);
const props = defineProps({
  title:            {
    type:    String,
    default: function () {
      return 'Ferropoly';
    }
  },
  size:             {
    type:    String,
    default: function () {
      return 'md';
    }
  },
  toggleable:       {
    type:    Boolean,
    default: function () {
      return false;
    }
  },
  fullSize:         {
    type:    Boolean,
    default: function () {
      return false;
    }
  },
  condensed:        {
    type:    Boolean,
    default: function () {
      return false;
    }
  },
  showDownloadIcon: {
    type:    Boolean,
    default: false
  }
})

const cardClass = computed(() => {
  const classes = [];
  // Basis-Klassen
  if (props.fullSize) {
    classes.push('full-size');
  } else {
    classes.push('normal-size');
  }
  // Optionales Hinzufügen von 'is-condensed'
  if (props.condensed) {
    classes.push('is-condensed');
  }
  return classes;
})
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
  padding-top: 8px;
  padding-bottom: 8px;
}

::v-deep(.is-condensed  .p-panel-content) {
  padding-top: 8px;
  padding-bottom: 8px;
}

</style>
