<!---
  The Pricelist root tag
-->
<template lang="pug">
  #pricelist
    menu-bar(:elements="menuElements" show-user-box=true @pricelist-clicked="onPricelistClicked"
    @game-info-clicked="onGameInfoClicked")
</template>

<script>
import MenuBar from '../../common/components/menu-bar.vue'

export default {
  name      : "pricelist-root",
  props     : [],
  data      : function () {
    return {
      menuElements: [
        {title: 'Preisliste', href: '#', event:'pricelist-clicked'},
        {title: 'Spiel', href: '#', event:'game-info-clicked'},
      ]
    };
  },
  model     : {},
  methods   : {
    onPricelistClicked: function() {
      console.log('Preisliste!')
    },
    onGameInfoClicked: function() {
      console.log('Info!')
    }
  },
  components: {MenuBar}
}
</script>

<style scoped>

</style>
