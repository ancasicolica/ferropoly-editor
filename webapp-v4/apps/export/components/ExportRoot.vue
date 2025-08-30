<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 13.04.2025
-->

<template>
  <div>
    <menu-bar :elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/spiel-exportieren/"></menu-bar>
    <div class="flex justify-center">
      <div class="flex align-items-center justify-content-center m-2">
        <ferro-card title="Spiel exportieren">
          <div>Du kannst hier deine erstellten Spieldaten downloaden und später wieder für ein neues Spiel importieren.</div>
          <div class="mt-2">Folgende Daten werden exportiert:</div>
          <ul>
            <li>Allgemeine Spiel-Parameter</li>
            <li>Orte in der Preisliste und deren Position darin</li>
            <li>Die verwendete Karte</li>
          </ul>
          <div>NICHT exportiert werden:</div>
          <ul>
            <li>Spieldatum</li>
            <li>Deine persönlichen Daten (ausser Deinem Namen als Ersteller)</li>
            <li>Anpassungen an Spielregeln</li>
            <li>Angemeldete Gruppen</li>
            <li>Spielleiter*innen</li>
          </ul>
          <Button label="Spieldaten auf PC speichern" icon="pi pi-download" @click="onDownload" ></Button>
        </ferro-card>
      </div>
    </div>
  </div>
</template>

<script setup>

import MenuBar from '../../../common/components/MenuBar.vue';
import FerroCard from '../../../common/components/FerroCard.vue'
import Button from 'primevue/button';
import {gameIdExtractor} from '../../../common/lib/gameIdExtractor';

const menuBarElements = [];
const {gameId}        = gameIdExtractor();


function onDownload() {
  window.location.href = `/export/${gameId.value}`;
}

</script>

<style scoped lang="scss">

</style>
