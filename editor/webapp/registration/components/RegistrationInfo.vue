<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 21.01.2024
-->
<template lang="pug">
#info
  b-container(fluid="true").m-3
    h1 Online-Anmeldung
    b-row
      b-col
        p Die Gruppen können sich online für das Spiel anmelden (
          a(:href="gameUrl") Link &nbsp;
            b-icon-box-arrow-up-right
          | ). Damit sie sie dieses Anmeldeformular benutzen können, müssen sie sich beim Ferrpoly registrieren - genau gleich, wie Du das bereits gemacht hast.
          | Du bekommst bei jeder neuen Anmeldung ein Mail zugeschickt, diese Anmeldung muss unter "Gruppen" dann noch bestätigt werden.



</template>
<script>

import {mapFields} from "vuex-map-fields";
import {BIconBoxArrowUpRight} from 'bootstrap-vue'

export default {
  name      : "RegistrationInfo",
  components: {BIconBoxArrowUpRight},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapFields({
        possibleUntil: 'gameplay.joining.possibleUntil',
        infotext     : 'gameplay.joining.infotext',
        joinUrl      : 'gameplay.joining.url',
        gameDate     : 'gameplay.scheduling.gameDate',

      }
    ),
    gameUrl() {
      return this.joinUrl;
    },
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
