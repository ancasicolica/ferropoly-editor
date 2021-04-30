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
      p Die Regeln kannst Du immer anpassen, selbst wenn sich schon Teams angemeldet haben oder sogar das Spiel läuft.&nbsp;
        strong Stelle in diesem Fall aber sicher, dass sämtliche Teams über die Anpassungen informiert werden!

      h2 Änderungs-Historie
      b-table(striped small :items="rules.changelog" :fields="fields" responsive="sm")
        template(#cell(rules.changelog.version)="data") {{data.item.version}}
        template(#cell(rules.changelog.ts)="data") {{data.item.ts | formatDateTime}}
        template(#cell(rules.changelog.changes)="data") {{data.item.changes}}

</template>

<script>
import {formatDateTime} from "../../common/lib/formatters";

export default {
  name      : "rules-info",
  props     : {
    rules: Object
  },
  data      : function () {
    return {
      fields: [
        {key: 'rules.changelog.version', label: '#'},
        {key: 'rules.changelog.ts', label: 'Datum'},
        {key: 'rules.changelog.changes', label: 'Änderungen'},
      ]
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {

  },
  components: {},
  filters   : {formatDateTime}
}
</script>

<style scoped>

</style>
