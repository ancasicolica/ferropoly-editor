<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
  #admins-root
    menu-bar(show-user-box=true
      help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/admins/")
    b-container(fluid=true)
      b-row
        b-col
          h1 Spielleiter*innen
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
  name      : 'AdminsRoot',
  components: {MenuBar, AdminsEditor, AdminsInfo},
  data      : function () {
    return {gameId: 'not yet',};
  },
  computed  : {},
  created   : function () {
    let self = this;

    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);

  }
}
</script>

<style scoped>

</style>
