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
      router-link.no-underline.menu-item(v-if="item.route" v-slot="{ href, navigate }" :to="{name: item.route}" :id="item.key")
        a.v-ripple(:href="href" v-bind="props.action" @click="navigate")
          span(:class='item.icon')
          span {{ item.label }}
      a(v-else).v-ripple.flex.align-items-center.menu-item(v-bind='props.action' :id="item.key")
        span(:class='item.icon')
        span {{ item.label }}
        span.ml-auto.border-1.surface-border.border-round.surface-100.text-xs.p-1(v-if='item.shortcut') {{ item.shortcut }}
        i(v-if='hasSubmenu' :class="['pi pi-angle-down text-primary', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]")

    template(#end)
      .flex.align-items-center.gap-2
        .flex(v-if="showOnlineStatus && online")
          i.pi.pi-cloud.online(style="font-size:  2.3rem" v-tooltip.left="'Online Status OK!'")
        .flex(v-if="showOnlineStatus && !online")
          i.pi.pi-times-circle.offline(style="font-size:  2rem" v-tooltip.left="'Keine Verbindung zum Server!'")
        .flex(v-if="helpUrl")
          a.help-button(:href="helpUrl" target="_blank")
            i.pi.pi-question-circle(style="font-size:  2rem")
        .flex(v-if="showUserBox")
          prime-button(type='button' severity="secondary" size="small" rounded icon='pi pi-user' @click='toggle' aria-haspopup='true' aria-controls='overlay_menu')
          tiered-menu#overlay_menu(ref='menu' :model='menuUser' :popup='true')

</template>
<script>
import PrimeMenubar from 'primevue/menubar';
import PrimeMenu from 'primevue/menu';
import PrimeButton from 'primevue/button';
import TieredMenu from 'primevue/tieredmenu';
import { useRoute } from 'vue-router'

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
        return undefined;
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
      menuItems    : [],
      menuUser     : [
        {label: 'Mein Account', command: this.onMyAccount},
        {label: 'Abmelden', command: this.onLogout}
      ],
      activeElement: null,
    }
  },
  computed  : {},
  created   : function () {
    let self          = this;
    const itemCreator = function (item) {
      if (!item.event) {
        item.event = 'panel-change';
      }

      item.key = item.key || `menu-${kebabCase(item.eventParam || item.route)}`

      if (item.active) {
        self.activeElement = item.key;
      }

      let newItem = {
        label  : item.title,
        url    : item.href,
        visible: get(item, 'hide', true),
        key    : item.key,
        parent : item.parent,
        route  : item.route,
        command: (f) => {
          // OnClick Handler: fires event
          if (item.eventParam) {
            console.log(`Menubar event "${item.event}" with param "${item.eventParam}"`);
            self.$emit(item.event, item.eventParam);
          }
          // This sets the right class for the active menu
          $(`.menu-item`).removeClass('menu-selected');
          self.activeElement = f.item.key;
          if (item.parent) {
            console.log('PARENT', f.item.parent)
            $(`#${f.item.parent}`).addClass('menu-selected');
          } else {
            $(`#${f.item.key}`).addClass('menu-selected');
          }

        }
      }
      // Submenu
      if (item.items) {
        newItem.items = newItem.items || [];
        item.items.forEach(e => {
          e.parent = item.parent || item.key;
          newItem.items.push(itemCreator(e));
        })
      }
      return newItem;
    }

    // Create the menu items
    this.elements.forEach(e => {
      self.menuItems.push(itemCreator(e))
    })



    // Set initial menu item to bold
    $(document).ready(function()  {
      let element = get(self, '$route.name', null);
        if (element) {
          self.activeElement = `menu-${kebabCase(element)}`
        }

      $(`#${self.activeElement}`).addClass('menu-selected');

      console.log(self.$router);
      console.log(self.$router.currentRoute);
      console.log(self.$route.name);
      console.log(self.$route);
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
    onMyAccount() {
      window.location.href = '/account';
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
  color: black;

}

.start-logo {
  height: 2rem;
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
  width: 100%;
  padding-left: 8px;
  padding-bottom: 0;
  padding-top: 0;
  border-radius: 0;
  background-color: lightgray;
}

.online {
  color: green;
}

.offline {
  color: red;
}

.no-underline {
  text-decoration: none;
}

.help-button {
  color: black;
}

</style>
