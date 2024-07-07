<!---
  Chooses a name and a map for a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  .block
    .block
      h1 Karte
      p Es stehen verschiedene Karten zur Auswahl, diese unterscheiden sich in der Grösse und damit auch in der benötigten Spieldauer und dem Billetpreis:
    .block
      div.ml-5.mr-5(v-for="entry in maps" :key="entry.map")
        radio-button.mt-2(v-model="gameMap" :input-id="entry.map" :value="entry.map")
        label.ml-2(:for="entry.map")
          span.title {{entry.name}}:
          span &nbsp; {{entry.description}}

</template>
<script>

import RadioButton from 'primevue/radiobutton';
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import mapDefs from '../../../../common/lib/maps.json';
import {filter} from 'lodash';

export default {
  name      : 'NewGameMap',
  components: {RadioButton},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapWritableState(useNewGameStore, {
      gameMap: 'gameMap'
    }),
    maps() {
      return filter(mapDefs.maps, {enabled: true});
    }
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">
.title {
  font-weight: bold;
}
</style>
