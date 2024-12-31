<!---
  Root component for tests
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.05.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" :help-url="menubar.helpUrl" :help-text="menubar.helpText" show-user-box show-online-status
  :online="menubar.online")

  // The different test pages
  router-view

</template>
<script>

import MenuBar from '../../../common/components/MenuBar.vue'
import {mapWritableState} from 'pinia';
import {useTestStore} from '../store/testStore';

export default {
  name      : 'TestRoot',
  components: {MenuBar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      menuBarElements: [
        {
          label: 'Components', eventParam: 'components',
          items: [{label: 'Game-Card', route:'game-card'},
                  {label: 'Ferro-Card', route: 'ferro-card'},
                  {label: 'Welcome-Bar', route: 'welcome-bar'},
                  {label: 'Input Text', route: 'input'},
                  {label: 'Text input', route: 'input-text'},
                  {label: 'Number input', route: 'input-number'},
                  {label: 'Sorting', route: 'sorting'},
                  {label: 'Submenu 3', eventParam: 'sub3', items: [
                      {label: 'Goto Ferropoly', url: 'https://www.ferropoly.ch'},
                      {label: 'subsub2', eventParam: 'subsub2'},
                      {label: 'subsub3', eventParam: 'subsub3'},
                      {label: 'subsub4', eventParam: 'subsub1'},
                    ]},
          ]
        },
      ]
    }

  },
  computed  : {
    ...mapWritableState(useTestStore, {
      menubar: 'menubar'
    })
  },
  created   : function () {
  },
  methods   : {
    testClick() {
      console.log('P');
      this.$router.push('/about');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
