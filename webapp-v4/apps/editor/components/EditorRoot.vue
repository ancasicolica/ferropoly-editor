<!---
  The Ferropoly editor: editing the parameters of the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements"  show-user-box)

  .ml-3.mr-3
    // the different panels
    router-view
</template>
<script>

import MenuBar from '../../../common/components/MenuBar.vue'
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {useEditorStore} from '../store/editorStore';

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
  computed:   {},
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
