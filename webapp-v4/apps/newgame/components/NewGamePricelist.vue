<!---
  Selects the pricelist of a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template>
  <div class="block">
    <h1>Preisliste</h1>
    <p>Wie gut kennt ihr das Spiel schon? Die Gestaltung der Preisliste hat einen grossen Einfluss auf den Spielverlauf.
      Wähle hier die Variante aus, welche am Besten zu Euch passt, Du kannst später die Einstellungen noch nach Belieben
      verändern.
    </p>
    <div class="flex">
      <div class="flex">
        <radio-button class="ml-5 mr-5" v-model="newGameStore.presets" inputId="easy" name="presets" value="easy"></radio-button>
      </div>
      <div class="flex">
        Einfach: Die Preisspanne zwischen dem günstigsten und teuersten Ort ist klein. Es kommt im Spiel mehr darauf an
        wie viele Orte man kauft und weniger welche es sind. Diese Art von Preisliste ist gut geeignet für wenig
        erfahrene Spieler.
      </div>
    </div>
    <div class="flex mt-4">
      <div class="flex">
        <radio-button class="ml-5 mr-5" v-model="newGameStore.presets" inputId="moderate" name="presets"
                      value="moderate"></radio-button>
      </div>
      <div class="flex">
        Mittel: Das teuerste Ort ist vier mal so teuer wie das billigste und der Häuserbau wird wichtig. Eine
        Routenplanung beginnt sich für die Gruppen zu lohnen, doch auch günstige Orte bleiben attraktiv. Diese
        Preisliste ist eine gute Wahl für Gelegenheitsspieler.

      </div>
    </div>
    <div class="flex mt-4">
      <div class="flex">
        <radio-button class="ml-5 mr-5" v-model="newGameStore.presets" inputId="classic" name="presets"
                      value="classic"></radio-button>
      </div>
      <div class="flex">
        Anspruchsvoll: Die Preisspanne zwischen dem günstigsten und teuersten Ort ist gross: das teuerste Ort kostet
        achtmal mehr als das günstigste! Es wird das Team gewinnen, welches die meisten teuersten Orte oder Paare kaufen
        kann, ohne Planung hat man als Spieler keine Chance. Als Spielleiter musst Bei der Gestaltung der Preisliste
        darauf achten, dass die teuersten Orte gut verteilt und nicht so einfach erreichbar sind.
      </div>
    </div>
    <h2>Zufällige Orte</h2>
    <p>Auf Wunsch werden zufällig Orte der Preisliste zugewiesen. Damit ist ein einfacher Start möglich, die Lage der Orte muss trotzdem noch kritisch überprüft werden!
    </p>
    <div class="block">
      <prime-select v-model="newGameStore.randomNb" :options="randomPropertyOptions" optionValue="value" optionLabel="text"></prime-select>
    </div>
  </div>

</template>
<script setup>

import {useNewGameStore} from '../store/newGameStore';
import RadioButton from 'primevue/radiobutton';
import PrimeSelect from 'primevue/select';
import {ref} from 'vue';

const newGameStore = useNewGameStore();

const randomPropertyOptions = ref( [
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
]);

</script>


<style scoped lang="scss">
.title {
  font-weight: bold;
}
</style>
