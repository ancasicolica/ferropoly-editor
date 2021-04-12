<!---
  The menu bar of the game-selector

  Could be a generic bar??

  11.4.21 KC
-->
<template lang="pug">
  #menu
    b-navbar(toggleable='lg' type='dark' variant='dark')
      b-navbar-brand(href='/')
        img(:src='favicon' height="24" width="24")
        | &nbsp; Ferropoly
      b-navbar-toggle(target='nav-collapse')
      b-collapse#nav-collapse(is-nav='')
        b-navbar-nav(v-for="el in elements" :key="el.title" v-if="!el.hide")
          b-nav-item(:href="el.href" v-on:click="onClick(el.event)") {{el.title}}
        // Right aligned nav items
        b-navbar-nav.ml-auto
          b-nav-item-dropdown(right='' v-if="showUserBox")
            template(#button-content='')
              em Benutzer
            b-dropdown-item(href='/account') Mein Account
            b-dropdown-item(href='/logout') Abmelden
</template>

<script>

export default {
  name      : "menu-bar",
  props     : {
    favicon    : {
      // Fav-Icon displayed in the menu bar
      type   : String,
      default: function () {
        return '/favicon/apple-touch-icon-180x180.png';
      }
    },
    elements   : {
      // Elements of the menu bar
      type   : Array,
      default: function () {
        return [];
      }
    },
    showUserBox: {
      // show logout box / about user
      type   : Boolean,
      default: false
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {
    /**
     * Click handler for a menu
     * @param event
     */
    onClick: function (event) {
      if (event) {
        this.$emit(event);
      }
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
