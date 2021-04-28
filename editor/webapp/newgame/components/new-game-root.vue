<!---
  Root view for a new game
-->
<template lang="pug">
  #new-game
    menu-bar(show-user-box=false)
    b-container(fluid=true)
      b-row
        b-col
          h1 Neues Spiel anlegen
      new-game-map(v-if="currentView === 'map'" :settings="gameSettings" @change-view="onChangeView"
        @form-validation="onFormValidation")
      new-game-date(v-if="currentView === 'date'" :settings="gameSettings" @change-view="onChangeView")
      new-game-pricelist(v-if="currentView === 'pricelist'" :settings="gameSettings" @change-view="onChangeView")
      new-game-name(v-if="currentView === 'name'" :settings="gameSettings" :validation-state="validationState"
        @change-view="onChangeView" @form-validation="onFormValidation")
</template>


<script>
import NewGameDate from './new-game-date.vue'
import NewGameMap from './new-game-map.vue'
import NewGameName from './new-game-name.vue'
import NewGamePricelist from './new-game-pricelist.vue'
import MenuBar from '../../common/components/menu-bar.vue'
import {getDefaultMap} from '../../common/lib/mapTypes'
import {DateTime} from "luxon";
import {forOwn} from "lodash";

export default {
  name      : "new-game-root",
  props     : {},
  data      : function () {
    return {
      currentView     : 'map',
      gameSettings    : {
        name      : 'Ferropoly Spiel',
        map       : getDefaultMap(),
        date      : DateTime.now().plus({days: 7}).toISODate(),
        presets   : 'moderate',
        random    : 0,
        selectedId: ''
      },
      validationState : true,
      validationObject: {}
    };
  },
  model     : {},
  methods   : {
    /**
     * Event Handler: a "back" or "next" button was clicked
     */
    onChangeView: function (view) {
      this.currentView = view;
    },
    /**
     * Validation function: collects the status for all sub forms and sets the one and
     * only validation status. Didn't find a built in functionality in bootstrap-vue
     * but this generic pattern does the job quite well.
     * @param data is an object which must have an id (unique for each part) and a boolan
     * flag named valid
     */
    onFormValidation(data) {
      let self                       = this;
      self.validationObject[data.id] = data.valid;
      let dataSetValid               = true;
      forOwn(self.validationObject, (value, key) => {
        if (!self.validationObject[key]) {
          dataSetValid = false;
        }
      });
      self.validationState = dataSetValid;
      // console.log('validated', self.validationState);
    }
  },
  components: {MenuBar, NewGameDate, NewGameMap, NewGameName, NewGamePricelist},
  filters   : {}
}
</script>

<style scoped>

</style>
