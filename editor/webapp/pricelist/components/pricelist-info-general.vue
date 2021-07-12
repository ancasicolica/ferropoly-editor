<!---
  General Info of the pricelist / Game
-->
<template lang="pug">
#pricelist-info-general
  table.table.table-sm
    tr
      td Organisator
      td {{getGpProperty('owner.organisatorName')}}
    tr
      td Organisation
      td {{getGpProperty('owner.organisation')}}
    tr
      td E-Mail Organisator
      td {{getGpProperty('owner.organisatorEmail')}}
    tr
      td Telefon Organisator
      td {{getGpProperty('owner.organisatorPhone')}}
    tr
      td Spieldatum
      td {{getGpProperty('scheduling.gameDate') | formatGameDate}}
    tr
      td Spielstart
      td {{getGpProperty('scheduling.gameStart')}}
    tr
      td Spielende
      td {{getGpProperty('scheduling.gameEnd')}}

  b-button(variant="dark" :href="getDownloadLink()" target="blank") Preisliste als Excel-Datei laden&nbsp;
    b-icon-download

</template>

<script>
import {get} from 'lodash'
import {BIconDownload} from 'bootstrap-vue';
import {formatGameDate} from '../../common/lib/formatters'

export default {
  name      : "pricelist-info-general",
  props     : {
    gameplay: {
      type   : Object,
      default: function () {
        return {};
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {
    /**
     * Get the property of the gameplay object
     * @param id
     */
    getGpProperty(id) {
      return get(this.gameplay, id, '');
    },
    /**
     * Returns the download link
     * @returns {string}
     */
    getDownloadLink() {
      return `/pricelist/download/${this.getGpProperty('internal.gameId')}`;
    }
  },
  components: {BIconDownload},
  filters   : {
    formatGameDate
  }
}
</script>

<style scoped>


</style>
