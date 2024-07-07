<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/newgame/" )
  stepper(value="4" linear)
    step-list
      step(value="1") Spielname
      step(value="2") Karte
      step(value="3") Spieltag
      step(value="4") Preisliste
      step(value="5") Abschluss
    step-panels
      step-panel(v-slot="{activateCallback}" value="1")
        .block
          card
            template(#content)
              new-game-name
        .flex.pt-6.justify-content-end
          prime-button(label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('2')" iconPos="right")
      step-panel(v-slot="{activateCallback}" value="2")
        .block
          card
            template(#content)
              new-game-map
        .flex.pt-6.justify-content-between
          prime-button(label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('1')" severity="secondary" )
          prime-button(label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('3')" iconPos="right")
      step-panel(v-slot="{activateCallback}" value="3")
        .block
          card
            template(#content)
              new-game-date
        .flex.pt-6.justify-content-between
          prime-button(label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('2')" severity="secondary" )
          prime-button(label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('4')" iconPos="right")
      step-panel(v-slot="{activateCallback}" value="4")
        .block
          card
            template(#content)
              new-game-pricelist
        .flex.pt-6.justify-content-between
          prime-button(label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('3')" severity="secondary" )
          prime-button(label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('5')" iconPos="right")
      step-panel(v-slot="{activateCallback}" value="5")
        .flex.flex-col
          h1 Abschluss
        .flex.pt-6.justify-content-between
          prime-button(label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('4')" severity="secondary" )
          prime-button(label="Spiel anlegen" @click="activateCallback('5')")

</template>
<script>
import MenuBar from '../../../common/components/MenuBar.vue'
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import PrimeButton from 'primevue/button';
import NewGameMap from './NewGameMap.vue';
import NewGameName from './NewGameName.vue';
import NewGameDate from './NewGameDate.vue';
import NewGamePricelist from './NewGamePricelist.vue';
import Card from 'primevue/card';
import FerroCard from '../../../../editor/webapp/common/components/ferro-card/ferro-card.vue';

export default {
  name      : 'NewGameRoot',
  components: {
    FerroCard,
    NewGameDate,
    Card,
    NewGamePricelist,
    NewGameName, NewGameMap, MenuBar, Stepper, StepPanels, StepList, StepItem, Step, StepPanel, PrimeButton
  },
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapWritableState(useNewGameStore, {
      menuBarElements: 'menuBarElements'
    })
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
