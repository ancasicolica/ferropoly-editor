<!---
  A Generic menu bar
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.05.2024

  The menu elements are not PrimeVue menu elements. Structure of one element:

  title: M: String containing the name
  href: O: URL to be opened when clicked
  hide: O: Boolean, hide entry when true
  event: O: Event to be raised when clicked, default is undefined (no event)
  eventParam: O: Parameter of the event raised when clicked,
  active: O: Element is THE active element in the bar

-->
<template lang="pug">
  prime-menubar(:model="menuItems" exact=false)
    template(#start)
      .flex.flex-row.flex-wrap.start
        .flex.justify-content-center.align-items-center
          img.start-logo(v-if="favicon" :src="favicon" @click="goToRoot")
        .flex.justify-content-center.align-items-center
          div.start-title(@click="goToRoot") {{title}}
    template(#item="{ item, props, root, hasSubmenu }")
      a.v-ripple.flex.align-items-center(v-bind='props.action' :id="item.key")
        span(:class='item.icon')
        span.ml-2 {{ item.label }}
        span.ml-auto.border-1.surface-border.border-round.surface-100.text-xs.p-1(v-if='item.shortcut') {{ item.shortcut }}
        i(v-if='hasSubmenu' :class="['pi pi-angle-down text-primary', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]")

    template(#end)
      .flex.align-items-center.gap-2
        prime-button(type='button' severity="secondary" size="small" rounded icon='pi pi-cog' @click='toggle' aria-haspopup='true' aria-controls='overlay_menu')
        tiered-menu#overlay_menu(ref='menu' :model='settings' :popup='true')
        div.menu-item(@click="onLogout") Logout

</template>
<script>
import PrimeMenubar from 'primevue/menubar';
import PrimeMenu from 'primevue/menu';
import PrimeButton from 'primevue/button';
import TieredMenu from 'primevue/tieredmenu';

import {kebabCase, get} from 'lodash';
import $ from 'jquery';

export default {
  name      : 'MenuBar',
  components: {PrimeMenubar, PrimeMenu, PrimeButton, TieredMenu},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    favicon         : {
      // Fav-Icon displayed in the menu bar
      type   : String,
      default: function () {
        return '/favicon/apple-touch-icon-180x180.png';
      }
    },
    title           : {
      // Title of the menu bar which is the name of the app
      type   : String,
      default: function () {
        return 'Ferropoly';
      }
    },
    elements        : {
      // Elements of the menu bar. Contains different types of elements
      type   : Array,
      default: function () {
        return [];
      }
    },
    elementsRight   : {
      // Elements of the menu bar on the right side
      type   : Array,
      default: function () {
        return [];
      }
    },
    helpUrl         : {
      // URL to help, shows (?)
      type   : String,
      default: function () {
        return '';
      }
    },
    showUserBox     : {
      // show logout box / about user
      type   : Boolean,
      default: false
    },
    showOnlineStatus: {
      // show cloud symbol
      type   : Boolean,
      default: false
    },
    online          : {
      // Status of the connection if online
      type   : Boolean,
      default: false
    }
  },
  data      : function () {
    return {
      menuItems: [],
      settings : [],
      activeElement : null,
    }
  },
  computed  : {},
  created   : function () {
    let self = this;
    // Create the menu items
    this.elements.forEach(e => {
      if (!e.event) {
        e.event = 'panel-change';
      }

      let key = `menu-${kebabCase(e.eventParam)}`

      if (e.active) {
        self.activeElement = key;
      }

      self.menuItems.push({
        label  : e.title,
        url    : e.href,
        visible: get(e, 'hide', true),
        focused: get(e, 'active', false),
        key    : key,
        command: (f) => {
          // OnClick Handler: fires event
          console.log(`Menubar event "${e.event}" with param "${e.eventParam}"`);
          self.$emit(e.event, e.eventParam);
          // This sets the right class for the active menu
          self.menuItems.forEach(menuItem => {
            $(`#${menuItem.key}`).removeClass('menu-selected');
          })
          self.activeElement = f.item.key;
          $(`#${f.item.key}`).addClass('menu-selected');
          console.log($(`#${f.item.key}`).addClass('menu-selected'));
        }
      })
    })

    // Set initial menu item to bold
    $(document).ready(() => {
      $(`#${self.activeElement}`).addClass('menu-selected');
    })
  },
  methods   : {
    /**
     * Redirects the user to the logout page.
     *
     * @returns {void}
     */
    onLogout() {
      window.location.href = '/logout';
    },
    goToRoot() {
      window.location.href = '/';
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    }
  }
}

</script>


<style scoped lang="scss">
.menu-item {
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;

}

.start-logo {
  height: 24px;
}

.start-title {
  font-weight: bold;
  padding-right: 5px;
  padding-left: 5px;
}

.menu-selected {
  font-weight: bold;
  color: black;
}

.p-menubar {
  //background-color: grey;
  width: 100%;
  padding-left: 8px;
  padding-bottom: 0;
  padding-top: 0;
}
</style>
