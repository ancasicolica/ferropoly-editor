<!---
  Name of a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template>
  <div class="block">
    <h1>Spielname</h1>
    <div class="block">
      <p>Gib Deinem Spiel einen passenden Namen, diesen sehen später auch die Teilnehmer*innen. Der Name kann jederzeit
        geändert werden.</p>
    </div>
    <div class="block">
      <input-text type="text"
                  v-model="name"
                  min-length="3"
                  max-length="60"></input-text>
    </div>
    <h2>Spiel importieren</h2>
    <p class="mb-4">Falls Du ein neues Spiel aus gespeicherten Spieldaten erstellen willst, dann lade diese Datei hoch,
      andernfalls direkt auf "Weiter".</p>

    <file-upload @select="handleFileUpload"
                 mode="basic"
                 :maxFileSize="500000"
                 custom-upload
                 accept=".ferropoly"
                 invalid-file-limit-message="Es kann nur eine Datei hochgeladen werden."
                 invalid-file-size-message="Die hochgeladene Datei ist zu hoch, muss kleiner als 500kB sein."
                 invalid-file-type-message="{0}: ungültiges Dateiformat."></file-upload>
    <message v-if="errorMessage" severity="error" class="mt-3">{{ errorMessage }}</message>
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

import {useNewGameStore} from '../store/newGameStore';
import InputText from '../../../common/components/InputText.vue'
import {kebabCase} from 'lodash';
import {computed, ref} from 'vue';
import Message from 'primevue/message';
import FileUpload from 'primevue/fileupload';
import {GameplayImporter} from '../../../common/lib/GameplayImporter';
import {formatDateTime, formatMap} from '../../../common/lib/formatters';
import {usePrimeVue} from 'primevue/config';

const primevue                             = usePrimeVue();
primevue.config.locale.noFileChosenMessage = 'Keine Datei ausgewählt';

const newGameStore = useNewGameStore();

const name = computed({
  get() {
    return newGameStore.gameName;
  },
  set(value) {
    newGameStore.proposedGameName = kebabCase(value.substring(0, 60));
    newGameStore.gameName         = value;
  }
})

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
