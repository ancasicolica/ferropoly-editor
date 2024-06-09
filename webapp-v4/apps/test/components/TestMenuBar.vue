<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.06.2024
-->
<template lang="pug">
  h1 Menubar Test
  .grid
    .col-4
      div Online
      Checkbox(v-model="menubar.online" :binary="true")
    .col-4
      div Helptext
      InputText(type="text" v-model="menubar.helpText" )


</template>
<script>

import {mapWritableState} from 'pinia';
import {useTestStore} from '../store/testStore';
import Checkbox from 'primevue/checkbox';

import InputText from 'primevue/inputtext';

export default {
  name      : 'TestMenuBar',
  components: {Checkbox, InputText},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapWritableState(useTestStore, {
      menubar: 'menubar'
    })
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
