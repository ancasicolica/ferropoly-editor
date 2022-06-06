<!---
  Information about the rules
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.04.21
-->
<template lang="pug">
  #rules-info
    b-col
      h1 Infos / Hilfe
      p Dies sind die Spielregeln Deines Ferropolys. Passe sie Deinen Bedürfnissen an, lies dazu auch die Tipps auf &nbsp;
        a(href='http://www.ferropoly.ch') www.ferropoly.ch
        | .
      p Die Regeln können bis zum Spielstart angepasst werden.&nbsp;
        strong Stelle immer sicher, dass sämtliche Teams über die Anpassungen informiert werden!

      h2 Änderungs-Historie
      b-table(striped small :items="rules.changelog" :fields="fields" responsive="sm")
        template(#cell(rules.changelog.version)="data") {{data.item.version}}
        template(#cell(rules.changelog.ts)="data") {{data.item.ts | formatDateTime}}
        template(#cell(rules.changelog.changes)="data") {{data.item.changes}}

</template>

<script>
import {formatDateTime} from '../../common/lib/formatters';
import {mapFields} from 'vuex-map-fields';

export default {
  name      : 'RulesInfo',
  components: {},
  filters   : {formatDateTime},
  model     : {},
  props     : {},
  data      : function () {
    return {
      fields: [
        {key: 'rules.changelog.version', label: '#'},
        {key: 'rules.changelog.ts', label: 'Datum'},
        {key: 'rules.changelog.changes', label: 'Änderungen'},
      ]
    };
  },
  computed  : {
    ...mapFields({
      rules: 'rules'
    }),
  },
  created   : function () {
  },
  methods: {},
}
</script>

<style scoped>

</style>
