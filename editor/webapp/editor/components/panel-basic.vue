<!---
  Panel in the editor with basic data
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-basic
    h1 Spieldaten
    b-row
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        contact-info
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        game-timing
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        game-info
        b-button(
          variant="primary"
          :disabled="!$store.getters.basicFormValid"
          v-on:click="saveAndContinue") Speichern und weiter
</template>

<script>
import {mapFields} from 'vuex-map-fields';
import ContactInfo from './basic/contact-info.vue';
import GameInfo from './basic/game-info.vue';
import GameTiming from './basic/game-timing.vue';
import FormValidatorMixin from '../../common/components/form-controls/formValidatorMixin';

export default {
  name      : 'panel-basic',
  props     : {
    authToken: {
      type   : String,
      default: () => {
        return 'none';
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {

  },
  computed  : {
    ...mapFields([
      'formValid.basic',
      'api.requestPending'
    ]),
    requestPending() {
      return this.$store.getters.requestPending;
    }
  },
  methods   : {
    saveAndContinue() {
      this.$store.dispatch({type: 'saveData', authToken: this.authToken, targetPanel: 'panel-player'});
    }
  },
  components: {ContactInfo, GameInfo, GameTiming},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
