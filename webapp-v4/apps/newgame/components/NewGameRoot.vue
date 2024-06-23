<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/newgame/" )
  stepper
    stepper-panel(header="Karte")
      template(#content="{nextCallback}")
        new-game-map
        prime-button(label="Weiter" @click="nextCallback")

    stepper-panel(header="Spieldatum")
      h1 Datum
    stepper-panel(header="Preisliste")
      h1 Preisliste
    stepper-panel(header="Abschluss")
      h1 Abschluss
</template>
<script>
import MenuBar from '../../../common/components/MenuBar.vue'
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import PrimeButton from 'primevue/button';
import NewGameMap from './NewGameMap.vue';

export default {
  name      : 'NewGameRoot',
  components: {NewGameMap, MenuBar, Stepper, StepperPanel,PrimeButton},
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
