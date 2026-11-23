<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.11.2026
-->

<template>
  <div>
    <h1>Import</h1>
    <p>Hier kannst Du eine bestehende Preisliste als Vorlage laden. Entweder aus einer Datei auf deinem PC oder aus
      einem bereits gespielten Spiel. Deine Preisliste wird nach dem Spiel für andere Teams verfügbar sein, damit hilfst
      anderen Spieler*innen beim Einstieg ins Ferropoly!
    </p>
    <p>Falls Du die Preisliste von Grund auf neu erstellen willst, dann clicke einfach auf "Weiter".</p>
  </div>
  <div class="grid gap-4 grid-cols-1 xl:grid-cols-3">
    <Card v-if="newGameStore.templates && newGameStore.templates.length > 0" class="xl:col-span-2">
      <template #title>Vorlagen</template>
      <template #content>
        <GameTemplates />
      </template>
    </Card>
    <Card class="md:col-span-1">
      <template #title>Datei importieren</template>
      <template #content>
        <p class="mb-4">Lade eine zuvor exportierte Preisliste aus deinem PC als Vorlage.</p>

        <file-upload @select="handleFileUpload"
                     mode="basic"
                     :maxFileSize="500000"
                     custom-upload
                     accept=".ferropoly"
                     invalid-file-limit-message="Es kann nur eine Datei hochgeladen werden."
                     invalid-file-size-message="Die hochgeladene Datei ist zu hoch, muss kleiner als 500kB sein."
                     invalid-file-type-message="{0}: ungültiges Dateiformat."></file-upload>
        <message v-if="errorMessage" severity="error" class="mt-3">{{ errorMessage }}</message>
       </template>
    </Card>

  </div>
  <div>
    <Card v-if="newGameStore.importedDataAvailable">
      <template #title>Import erfolgreich</template>
      <template #content>
        <p>Diese Daten werden als Grundlage für ein neues Spiel verwendet:</p>
        <p>Ersteller: {{ newGameStore.importedGpCreator }}</p>
        <p>Erstellt am: {{ importedGpDate }}</p>
        <p>Karte: {{ importedGpMap }}</p>
        <p>Anzahl Orte: {{ newGameStore.importedGpPropertyNb }}</p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import GameTemplates from './GameTemplates.vue';
import Message from 'primevue/message';
import FileUpload from 'primevue/fileupload';
import {GameplayImporter} from '../../../common/lib/GameplayImporter';
import {formatDateTime, formatMap} from '../../../common/lib/formatters';
import {computed, ref} from 'vue';

import {usePrimeVue} from 'primevue/config';
import {useNewGameStore} from '../store/newGameStore';

const primevue                             = usePrimeVue();
primevue.config.locale.noFileChosenMessage = 'Keine Datei ausgewählt';

const newGameStore = useNewGameStore();

const importedGpMap = computed(() => {
  return formatMap(newGameStore.importedGpMap);
})

const errorMessage     = ref(null);
const importedGpDate   = computed(() => {
  return formatDateTime(newGameStore.importedGpDate);
})
/**
 * Handles the file upload event and processes the uploaded file.
 *
 * This function is triggered when a file is selected for upload. It reads the
 * content of the uploaded file using the FileReader API and processes the data
 * with GameplayImporter. If the file is valid, it attempts to parse and handle
 * the data. If an error occurs during this process, it logs the error and
 * updates the error message value.
 *
 * @param {Event} event - The file upload event containing information about the
 *                        uploaded file(s).
 */
const handleFileUpload = function (event) {
  console.log(event, event.files, event.files[0]);
  const file = event.files[0]; // Die ausgewählte Datei
  if (file) {
    const reader = new FileReader();

    // Event, when reading file finished
    reader.onload = (e) => {
      try {
        const gi = new GameplayImporter();
        gi.loadData(e.target.result)
            .then(info => {
              console.log('Data loaded', info);
              newGameStore.importData = info;
              errorMessage.value      = gi.error;
            })
            .catch(err => {
              console.error(err, gi);
              errorMessage.value      = err;
              newGameStore.importData = null;
            })
      }
      catch (error) {
        console.warn('Fehler beim Lesen der JSON-Datei:', error);
        newGameStore.importData = null;
      }
    };
    reader.readAsText(file);
  } else {
    console.warn('No or invalid file selected');
    newGameStore.importData = null;
  }

}
</script>

<style scoped lang="scss">

</style>
