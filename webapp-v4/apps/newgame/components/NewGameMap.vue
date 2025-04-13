<!---
  Chooses a name and a map for a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template>
<div class="block">
  <div class="block">
    <h1>Karte</h1>
    <p>Es stehen verschiedene Karten zur Auswahl, diese unterscheiden sich in der Grösse und damit auch in der benötigten Spieldauer und dem Billetpreis:
    </p>
  </div>
  <div class="block">
    <div class="ml-5 mr-5" v-for="entry in maps" :key="entry.map">
      <radio-button class="mt-4" v-model="newGameStore.gameMap" :input-id="entry.map" :value="entry.map"></radio-button>
      <label class="ml-3" :for="entry.map">
        <span class="title">{{entry.name}}</span>
        <span>&nbsp; {{ entry.description}}</span>
      </label>
    </div>
  </div>
</div>

</template>
<script setup>

import RadioButton from 'primevue/radiobutton';
import {useNewGameStore} from '../store/newGameStore';
import mapDefs from '../../../../common/lib/maps.json';
import {filter} from 'lodash';
import {computed} from 'vue';

const newGameStore = useNewGameStore();

const maps = computed(()=> {
  return filter(mapDefs.maps, {enabled: true});
})
</script>


<style scoped lang="scss">
.title {
  font-weight: bold;
}
</style>
