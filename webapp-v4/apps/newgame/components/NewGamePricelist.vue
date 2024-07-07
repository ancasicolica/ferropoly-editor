<!---
  Selects the pricelist of a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template lang="pug">
  .block
    h1 Preisliste
  .block
    p Wie gut kennt ihr das Spiel schon? Die Gestaltung der Preisliste hat einen grossen Einfluss auf den Spielverlauf. Wähle hier die Variante aus, welche am Besten zu Euch passt, Du kannst später die Einstellungen noch nach Belieben verändern.
  .flex
    .flex
      radio-button.ml-5.mr-5(v-model="presets" inputId="easy" name="presets" value="easy")
    .flex Einfach: Die Preisspanne zwischen dem günstigsten und teuersten Ort ist klein. Es kommt im Spiel mehr darauf an wie viele Orte man kauft und weniger welche es sind. Diese Art von Preisliste ist gut geeignet für wenig erfahrene Spieler.
  .flex.mt-2
    .flex
      radio-button.ml-5.mr-5(v-model="presets" inputId="moderate" name="presets" value="moderate")
    .flex Mittel: Das teuerste Ort ist vier mal so teuer wie das billigste und der Häuserbau wird wichtig. Eine Routenplanung beginnt sich für die Gruppen zu lohnen, doch auch günstige Orte bleiben attraktiv. Diese Preisliste ist eine gute Wahl für Gelegenheitsspieler.
  .flex.mt-2
    .flex
      radio-button.ml-5.mr-5(v-model="presets" inputId="classic" name="presets" value="classic") Classic
    .flex Anspruchsvoll: Die Preisspanne zwischen dem günstigsten und teuersten Ort ist gross: das teuerste Ort kostet achtmal mehr als das günstigste! Es wird das Team gewinnen, welches die meisten teuersten Orte oder Paare kaufen kann, ohne Planung hat man als Spieler keine Chance. Als Spielleiter musst Bei der Gestaltung der Preisliste darauf achten, dass die teuersten Orte gut verteilt und nicht so einfach erreichbar sind.
  .block
    h2 Zufällige Orte
  .block
    p Auf Wunsch werden zufällig Orte der Preisliste zugewiesen. Damit ist ein einfacher Start möglich, die Lage der Orte muss trotzdem noch kritisch überprüft werden!
  .block
    prime-select(v-model="randomNb" :options="randomPropertyOptions" optionValue="value" optionLabel="text")


</template>
<script>

import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import RadioButton from 'primevue/radiobutton';
import PrimeSelect from 'primevue/select';

export default {
  name: 'NewGamePricelist',
  components: {RadioButton, PrimeSelect},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {   
      randomPropertyOptions: [
        {
          text : 'Keine Orte der Preisliste zuweisen',
          value: 0
        },
        {text: '40', value: 40},
        {text: '60', value: 60},
        {text: '80', value: 80},
        {text: '100', value: 100},
        {text: '120', value: 120},
        {text: '150', value: 150},
        {text: '200', value: 200},
      ]}
  },
  computed  : {
    ...mapWritableState(useNewGameStore, {
      presets: 'presets',
      randomNb: 'randomNb',
    }),
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
