<!---
  Setting the price list
-->
<template lang="pug">
#new-game-pricelist
  h2 Preisliste
  p Wie gut kennt ihr das Spiel schon? Die Gestaltung der Preisliste hat einen grossen Einfluss auf den Spielverlauf. Wähle hier die Variante aus, welche am Besten zu Euch passt, Du kannst später die Einstellungen noch nach Belieben verändern.
  b-form-radio-group.mb-2(v-model="settings.presets", :options="priceListOptions" stacked)
  h2 Zufallspreisliste
  p Auf Wunsch werden zufällig Orte der Preisliste zugewiesen. Damit ist ein einfacher Start möglich, die Lage der Orte muss trotzdem noch kritisch überprüft werden!
  b-form-select(v-model="settings.random", :options="randomPropertyOptions")
  b-button.mt-2(@click="onBack()") Zurück
  b-button.mt-2.ml-2(variant="primary" @click="onNext()") Weiter
</template>

<script>
export default {
  name      : "new-game-pricelist",
  props     : {settings: Object},
  data      : function () {
    return {
      priceListOptions: [
        {
          html : '<b>Einfach</b>: Die Preisspanne zwischen dem günstigsten und teuersten Ort ist klein. Es kommt im Spiel mehr darauf an wie viele Orte man kauft und weniger welche es sind. Diese Art von Preisliste ist gut geeignet für wenig erfahrene Spieler.<br/>&nbsp;',
          value: 'easy',
        },
        {
          html : '<b>Mittel</b>: Das teuerste Ort ist vier mal so teuer wie das billigste und der Häuserbau wird wichtig. Eine Routenplanung beginnt sich für die Gruppen zu lohnen, doch auch günstige Orte bleiben attraktiv. Diese Preisliste ist eine gute Wahl für Gelegenheitsspieler.<br/>&nbsp;',
          value: 'moderate'
        },
        {
          html : '<b>Schwierig (Original Ferropoly)</b>: Die Preisspanne zwischen dem günstigsten und teuersten Ort ist gross: das teuerste Ort kostet achtmal mehr als das günstigste! Es wird das Team gewinnen, welches die meisten teuersten Orte oder Paare kaufen kann, ohne Planung hat man als Spieler keine Chance. Als Spielleiter musst Bei der Gestaltung der Preisliste darauf achten, dass die teuersten Orte gut verteilt und nicht so einfach erreichbar sind.',
          value: 'classic'
        }
      ],
      randomPropertyOptions: [
        {
          text: 'Keine Orte der Preisliste zuweisen',
          value : 0
        },
        {text: '60', value: 60},
        {text: '80', value: 80},
        {text: '100', value: 100},
        {text: '120', value: 120},
        {text: '150', value: 150},
        {text: '200', value: 200},
      ]
    };
  },
  model     : {},
  methods   : {
    onNext: function () {
      this.$emit('change-view', 'name')
    },
    onBack: function () {
      this.$emit('change-view', 'date')
    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
