<!---
  Control for a selected property
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.01.2025
-->
<template>
  <div>
    <ferro-card title="Ausgewähltes Ort" condensed>
      <div class="title">{{ name }}</div>
      <div v-if="propertySelected">
        <div>Erreichbarkeit: {{ formatAccessibility(accessibility) }}</div>
        <select-button class="mt-2" v-model="selectedProperty.pricelist.priceRange"
                       :options="priceRanges" option-label="name" :allow-empty="allowEmpty"
                       option-value="value" size="small" @value-change="onPriceRangeChanged"></select-button>
      </div>
      <div v-if="!propertySelected">
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </div>
    </ferro-card>
  </div>
</template>
<script setup>

import FerroCard from '../../../../common/components/FerroCard.vue'
import SelectButton from 'primevue/selectbutton';
import {formatAccessibility} from '../../../../common/lib/formatters';

import {get} from 'lodash';

import {storeToRefs} from 'pinia';
import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';

import {computed, defineProps} from 'vue'

const props = defineProps({
  property: {
    type:    Object,
    default: () => {
      return null;
    }
  }
})

const allowEmpty = false;

const priceRanges = [
  {name: 'unbenutzt', value: -1},
  {name: 'sehr billig', value: 0},
  {name: 'billig', value: 1},
  {name: 'unteres Mittelfeld', value: 2},
  {name: 'oberes Mittelfeld', value: 3},
  {name: 'teuer', value: 4},
  {name: 'sehr teuer', value: 5}
]

const name = computed(
    () => {
      return get(props.property, 'location.name', 'Bitte Ort auswählen');
    }
);

const editorPropertiesStore = useEditorPropertiesStore();
const {selectedProperty}    = storeToRefs(editorPropertiesStore);

const propertySelected = computed(() => {
  return props.property !== null;
});

const accessibility = computed(() => {
  return get(props.property, 'location.accessibility', 'Bitte Ort auswählen');
});


const emit = defineEmits(['save-selected-property']);

function onPriceRangeChanged() {
  emit('save-selected-property')
}



</script>


<style scoped lang="scss">
.title {
  font-weight: bold;
}
</style>
