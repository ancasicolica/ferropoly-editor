<!---
  Root component for tests
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.05.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" help-url="https://www.ferropoly.ch" show-user-box show-online-status
  :online="online")

  // The different test pages
  router-view
</template>
<script>

import MenuBar from '../../../common/components/MenuBar.vue'

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
        {title: 'Test 1', route:'root'},
        {title: 'Test 2', route:'about'},
        {
          title: 'Components', eventParam: 'components',
          items: [{title: 'Game-Card', route:'game-card'},
                  {title: 'Submenu 2', eventParam: 'sub2'},
                  {title: 'Submenu 3', eventParam: 'sub3', items: [
                      {title: 'subsub1', eventParam: 'subsub1'},
                      {title: 'subsub2', eventParam: 'subsub2'},
                      {title: 'subsub3', eventParam: 'subsub3'},
                      {title: 'subsub4', eventParam: 'subsub1'},
                    ]},
          ]
        },
      ],
      // Some Test data
      online: true
    }

  },
  computed  : {},
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
