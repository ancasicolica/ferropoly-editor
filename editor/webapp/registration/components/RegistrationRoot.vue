<!---
  Root Element for the registration
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 21.01.2024
-->
<template lang="pug">
#registration
  menu-bar(:elements="menuElements" show-user-box=true
    @show-info="showInfo"
    @show-editor="showEditor"
    help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/spielregeln/")

  registration-editor(v-if="currentView==='edit'")


</template>
<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import {mapFields} from "vuex-map-fields";
import RegistrationInfo from "./RegistrationInfo.vue";
import RegistrationEditor from "./RegistrationEditor.vue";

export default {
  name      : "RegistrationRoot",
  components: {RegistrationEditor, RegistrationInfo, MenuBar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapFields({
      menuElements: 'menuElements',
      currentView : 'currentView',
      rules       : 'rules',
      gameId      : 'gameId',
      editAllowed : 'editAllowed'
    }),
  },
  created   : function () {
  },
  methods   : {
    showEditor() {
      this.$store.commit('setActiveMenu', 'edit');
    },
    showInfo() {
      this.$store.commit('setActiveMenu', 'info');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
