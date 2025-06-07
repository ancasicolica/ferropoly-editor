<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <h3>Upload Ortsdaten</h3>
    <div  v-if="!uploadFinished">
      <file-upload ref="fileupload"
                   @upload="onUpload"
                   mode="basic"
                   :maxFileSize="1000000"
                   accept=".json"
                   url="/locations"
                   name="locations"
                   show-upload-button
                   invalid-file-limit-message="Es kann nur eine Datei hochgeladen werden."
                   invalid-file-size-message="Die hochgeladene Datei ist zu hoch, muss kleiner als 1MB sein."
                   invalid-file-type-message="{0}: ungültiges Dateiformat."></file-upload>
      <Button label="Upload" @click="upload" severity="secondary" />
    </div>
    <Message severity="info" v-if="uploadFinished">
      <div> Neue Orte: {{uploadInfo.newLocations}}</div>
      <div> Unveränderte Orte: {{uploadInfo.unalteredLocations}}</div>
      <div> Veränderte Orte: {{uploadInfo.changedLocations}}</div>
      <div v-if="uploadInfo.errorLocations.length === 0"> Keine Fehler</div>
      <div v-if="uploadInfo.errorLocations.length > 0"> Fehler:
      <ul>
      <li>(v-for="location in uploadInfo.errorLocations" :key="location")></li> {{location}}
      </ul>
      </div>
    </Message>

  </div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload';
import axios from 'axios';
import Button from 'primevue/button';
import Message from 'primevue/message';
import {ref} from 'vue';
const fileupload = ref();

const uploadFinished = ref(false);
const uploadInfo = ref({});

const onUpload = function(data) {
  console.log('uploaded', data)

  uploadInfo.value = JSON.parse(data.xhr.response);
  console.log('uploaded', uploadInfo)
  uploadFinished.value = true;
}

const upload = () => {
  console.log('UPLOAD', fileupload.value)
  fileupload.value.upload();
};

const handleFileUpload = function (event) {
  console.log(event, event.files, event.files[0]);
  const file = event.files[0]; // Die ausgewählte Datei
  if (file) {
    const reader = new FileReader();

    // Event, when reading file finished
    reader.onload = (e) => {
      try {
        axios.post('/locations', e, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          console.log('Status', resp.status);

        }).catch(err => {
          console.error(err);
        });
      }
      catch (error) {
        console.warn('Fehler beim Lesen der JSON-Datei:', error);

      }
    };
    reader.readAsText(file);
  } else {
    console.warn('No or invalid file selected');

  }

}
</script>

<style scoped lang="scss">

</style>
