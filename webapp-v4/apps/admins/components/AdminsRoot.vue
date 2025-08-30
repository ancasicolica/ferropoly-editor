<!---
  The root element for the admins
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.02.2025
-->

<template>
  <div>
    <menu-bar :elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/admins/"></menu-bar>
    <div class="ferropoly-container">
      <h1>Spielleiter*innen</h1>
      <p>Mit zusätzlichen Spielleiter*innen kannst Du dir die Arbeit in der Zentrale auf verschiedene Personen
        aufteilen:
        jeder Spielleiter*in hat während des Spiels vollen Zugriff auf das Spielgeschehen und kann so für die Gruppen
        Orte
        kaufen und Häuser bauen.</p>
      <p>Die hier definierten Spielleiter*innen können jedoch die Preisliste nicht modifizieren und auch keine Gruppen
        hinzufügen, das ist Dir als Organisator*in vorbehalten.</p>
      <p>Es sind maximal drei weitere Spielleiter*innen möglich. Gib deren Email-Adresse in die Textfelder ein und
        speichere diese. Für den Zugriff auf das Spiel müssen sich die Spielleiter*innen im Ferropoly mit derselben
        Email-Adresse registriert haben.</p>
      <div class="flex mt-2">
        <add-admin class="flex-1"></add-admin>
        <admin-list class="flex-1"></admin-list>
      </div>
    </div>
  </div>
</template>

<script setup>

import MenuBar from '../../../common/components/MenuBar.vue'
import AddAdmin from './AddAdmin.vue';
import AdminList from './AdminList.vue';
import {onBeforeMount, ref} from 'vue';
import {last, split} from 'lodash';
import {useAdminStore} from '../store/adminStore';

const adminStore      = useAdminStore();
const menuBarElements = [];
const gameId          = ref('');

onBeforeMount(() => {
  const elements = split(window.location.pathname, '/');
  gameId.value   = last(elements);
  adminStore.loadAdmins(gameId.value);
})
</script>

<style scoped lang="scss">

</style>
