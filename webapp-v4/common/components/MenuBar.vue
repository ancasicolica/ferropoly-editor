<!---
  A Generic menu bar using PrimeVue Menu elements
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.05.2024

-->
<template lang="pug">
  prime-menubar(:model="elements" exact=false)
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
      a(v-else :href="item.url").v-ripple.flex.align-items-center.menu-item(v-bind='props.action' :id="item.key" @click="onItem(item)")
        span(:class='item.icon')
        span {{ item.label }}
        span.ml-auto.border-1.surface-border.border-round.surface-100.text-xs.p-1(v-if='item.shortcut') {{ item.shortcut }}
        i(v-if='hasSubmenu' :class="['pi pi-angle-down text-primary', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]")

    template(#end)
      .flex.align-items-center.gap-2
        .flex(v-if="showOnlineStatus && online")
          i.pi.pi-cloud.online(style="font-size:  2rem" v-tooltip.left="'Online Status OK!'")
        .flex(v-if="showOnlineStatus && !online")
          i.pi.pi-times-circle.offline(style="font-size:  1.8rem" v-tooltip.left="'Keine Verbindung zum Server!'")
        .flex(v-if="helpUrl")
          a.help-button(v-if="!helpText" :href="helpUrl" target="_blank")
            i.pi.pi-question-circle(style="font-size:  1.6rem")
          a.no-underline(v-if="helpText" :href="helpUrl")
            span {{helpText}}
        .flex(v-if="showUserBox")
          prime-button(type='button' severity="secondary" size="small" rounded icon='pi pi-user' @click='toggle' aria-haspopup='true' aria-controls='overlay_menu')
          tiered-menu#overlay_menu(ref='menu' :model='menuUser' :popup='true')

</template>
<script>
import PrimeMenubar from 'primevue/menubar';
import PrimeMenu from 'primevue/menu';
import PrimeButton from 'primevue/button';
import TieredMenu from 'primevue/tieredmenu';

export default {
  name:       'MenuBar',
  components: {PrimeMenubar, PrimeMenu, PrimeButton, TieredMenu},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {
    favicon:          {
      // Fav-Icon displayed in the menu bar
      type:    String,
      default: function () {
        return '/favicon/apple-touch-icon-180x180.png';
      }
    },
    title:            {
      // Title of the menu bar which is the name of the app
      type:    String,
      default: function () {
        return 'Ferropoly';
      }
    },
    elements:         {
      // Elements of the menu bar. Contains different types of elements
      type:    Array,
      default: function () {
        return [];
      }
    },
    elementsRight:    {
      // Elements of the menu bar on the right side
      type:    Array,
      default: function () {
        return [];
      }
    },
    helpUrl:          {
      // URL to help, shows (?)
      type:    String,
      default: function () {
        return undefined;
      }
    },
    helpText:         {
      // Text to be shown instead of (?)
      type:    String,
      default: function () {
        return undefined;
      }
    },
    showUserBox:      {
      // show logout box / about user
      type:    Boolean,
      default: false
    },
    showOnlineStatus: {
      // show cloud symbol
      type:    Boolean,
      default: false
    },
    online:           {
      // Status of the connection if online
      type:    Boolean,
      default: false
    }
  },
  data:       function () {
    return {
      menuItems:     [],
      menuUser:      [
        {label: 'Mein Account', command: this.onMyAccount},
        {label: 'Abmelden', command: this.onLogout}
      ],
      activeElement: null,
    }
  },
  computed:   {},
  created:    function () {
  },
  methods:    {
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
    },
    onItem(item) {
      console.log('item', item);
      this.$emit('item-selected', item.key);
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
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}

.start-title {
  font-weight: bold;
  padding-right: 5px;
  padding-left: 5px;
  cursor: pointer;

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
