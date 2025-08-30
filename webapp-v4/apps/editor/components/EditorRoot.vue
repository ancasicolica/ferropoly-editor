<!---
  The Ferropoly editor: editing the parameters of the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div>
    <menu-bar :elements="menuBarElements"  :help-url="currentHelpUrl" show-user-box></menu-bar>
    <div>
      <router-view v-if="ready"></router-view>
    </div>
  </div>
</template>
<script>

import MenuBar from '../../../common/components/MenuBar.vue'
import {useEditorStore} from '../store/editorStore';
import {mapWritableState} from 'pinia';

export default {
  name:       'EditorRoot',
  components: {MenuBar},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      menuBarElements: [
        {
          label: 'Spielparameter', eventParam: 'params',
          items: [{label: 'Spieldaten', route: 'basic'},
                  {label: 'Preisliste', route: 'pricelist'},
                  {label: 'Startgeld & Zins', route: 'rent'},
                  {label: 'Häuser & Hotel', route: 'houses'},
                  {label: 'Chance & Kanzlei', route: 'chance'}
          ]
        },
        {label: 'Ortsauswahl', route: 'properties'},
        {label: 'Reihenfolge', route: 'sorting'},
        {label: 'Preisliste erstellen', route: 'create'},
      ]
    }
  },
  computed:   {
    ...mapWritableState(useEditorStore, {
      ready: 'ready'
    }),
    // Compute help URL based on current route name
    // Keep this mapping in sync with your router's route names
    currentHelpUrl() {
      const base = 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/';
      const map = {
        basic:       `${base}basic/`,
        pricelist:   `${base}pricelist/`,
        rent:        `${base}rent/`,
        houses:      `${base}houses/`,
        chance:      `${base}chance/`,
        properties:  `${base}properties/`,
        sorting:     `${base}sorting/`,
        create:      `${base}create/`
      };
      // Prefer route name; fall back to default base if unknown
      const name = this.$route && this.$route.name ? String(this.$route.name) : '';
      if (name && map[name]) return map[name];

      // Optional: try to infer from path if names differ
      const path = this.$route && this.$route.path ? this.$route.path : '';
      const entry = Object.entries(map).find(([key]) => path.includes(key));
      return entry ? entry[1] : base;
    }

  },
  created:    function () {

    const pathPart = window.location.pathname.split('#')[0]; // before '#'
    const segments = pathPart.split('/'); // split at '/'
    const gameId = segments.pop(); // last element
    console.log(`Welcome to the ${gameId} editor!`);
    useEditorStore().loadData(gameId)
        .finally(()=>{
          console.log('ready');
        });
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
