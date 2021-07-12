<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
#admins-info
  b-card(title="Info")
    b-card-text
      p Mit zusätzlichen Spielleitern kannst Du dir die Arbeit in der Zentrale auf verschiedene Personen aufteilen: jeder Spielleiter hat während des Spiels vollen Zugriff auf das Spielgeschehen und kann so für die Teams Orte kaufen und Häuser bauen.
      p Die hier definierten Spielleiter können jedoch die Preisliste nicht modifizieren und auch keine Teams hinzufügen, das ist Dir als Organisator vorbehalten.
      p Es sind maximal drei weitere Spielleiter möglich. Gib deren Email-Adresse in die Textfelder ein und speichere diese. Für den Zugriff auf das Spiel müssen die Spielleiter sich im Ferropoly mit derselben Email-Adresse registriert haben.

</template>

<script>
export default {
  name      : 'admins-info',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
