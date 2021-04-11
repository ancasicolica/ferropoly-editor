<!---
  The menu bar of the game-selector

  Could be a generic bar??

  11.4.21 KC
-->
<template lang="pug">
  #ferropoly-navbar
    b-navbar(toggleable='lg' type='dark' variant='dark')
      b-navbar-brand(href='/')
        img(src='/favicon/apple-touch-icon-180x180.png' height="24" width="24")
        | &nbsp; Ferropoly
      b-navbar-toggle(target='nav-collapse')
      b-collapse#nav-collapse(is-nav='')
        b-navbar-nav(v-if="newGameEnabled")
          b-nav-item(href='/newgame') Neues Spiel
        // Right aligned nav items
        b-navbar-nav.ml-auto
          b-nav-item-dropdown(right='')
            template(#button-content='')
              em Benutzer
            b-dropdown-item(href='/account') Mein Account
            b-dropdown-item(href='/logout') Abmelden
</template>

<script>
export default {
  name      : "menu-bar",
  props     : ['new-game-enabled'],
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {},
  components: {}
}
</script>

<style scoped>

</style>
