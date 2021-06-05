<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
  #admins-root
    menu-bar(show-user-box=true help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/admins/")
    b-container(fluid=true)
      b-row
        b-col
          h1 Spielleiter
      b-row
        b-col
          admins-editor(:game-id="gameId")
        b-col
          admins-info

</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue'
import AdminsEditor from './admins-editor.vue'
import AdminsInfo from './admins-info.vue'
import {last, split} from 'lodash';

export default {
  name      : 'admins-root',
  props     : {},
  data      : function () {
    return {gameId: 'not yet',};
  },
  model     : {},
  created   : function () {
    let self = this;

    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);

  },
  computed  : {},
  methods   : {},
  components: {MenuBar, AdminsEditor, AdminsInfo},
  filters   : {}
}
</script>

<style scoped>

</style>
