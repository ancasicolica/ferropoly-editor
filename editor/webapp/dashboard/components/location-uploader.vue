<!---
  Uploader component for Location.json files
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.04.22
-->
<template lang="pug">
  b-form(@submit="onSubmit" action)
    b-form-file(
      v-model="fileToUpload"
      :state="Boolean(fileToUpload)"
      accept=".json"
      placeholder="location.json auswählen oder ablegen"
      drop-placeholder="Datei hier ablegen")
    b-button.mt-3(type="submit" v-if="uploadEnabled") Orte hochladen
    b-alert.mt-3(variant="danger" show v-if="errorMessage") {{errorMessage}}
    b-alert.mt-3(variant="success" show v-if="uploadSucceeded")
      div Neue Orte: {{uploadInfo.newLocations}}
      div Unveränderte Orte: {{uploadInfo.unalteredLocations}}
      div Veränderte Orte: {{uploadInfo.changedLocations}}
      div(v-if="uploadInfo.errorLocations.length === 0") Keine Fehler
      div(v-if="uploadInfo.errorLocations.length > 0") Fehler:
        ul
          li(v-for="location in uploadInfo.errorLocations" :key="location") {{location}}


</template>

<script>
import {postLocations} from '../adapter/dashboard';
import {get} from 'lodash';

export default {
  name      : 'LocationUploader',
  components: {},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      fileToUpload    : undefined,
      uploadInProgress: false,
      errorMessage    : undefined,
      uploadSucceeded : false,
      uploadInfo      : {
        newLocations      : -1,
        unalteredLocations: -1,
        changedLocations  : -1,
        errorLocations    : []
      }
    };
  },
  computed  : {
    uploadEnabled() {
      return Boolean(this.fileToUpload);
    }
  },
  created   : function () {
  },
  methods   : {
    onSubmit(event) {
      if (this.uploadInProgress) {
        console.warn('Already uploading');
        return;
      }
      event.preventDefault()
      // This is important for file upload, was hard to learn...
      const formData = new FormData();
      formData.append('locations', this.fileToUpload);

      this.uploadInProgress = true;
      this.errorMessage     = undefined;
      this.uploadSucceeded  = false;

      // Post data, show info whether success or not.
      postLocations(formData, (err, res) => {
        this.uploadInProgress = false;
        if (err) {
          console.error(err);
          this.errorMessage = get(err, 'message', 'Fehler beim Upload');
        } else {
          this.uploadSucceeded = true;
          this.uploadInfo      = res;
        }
        this.$forceUpdate();
      })
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
