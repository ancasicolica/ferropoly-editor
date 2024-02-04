<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 21.01.2024
-->
<template lang="pug">
  #edit
    b-container(fluid="true").m-3
      h1 Online-Anmeldung
      b-row
        b-col
          p Die Gruppen können sich online für das Spiel anmelden (
            a(:href="gameUrl" target="blank") Link &nbsp;
              b-icon-box-arrow-up-right
            | ). Damit sie sie dieses Anmeldeformular benutzen können, müssen sie sich beim Ferrpoly registrieren - genau gleich, wie Du das bereits gemacht hast.
            | Du bekommst bei jeder neuen Anmeldung ein Mail zugeschickt, diese Anmeldung muss unter "Gruppen" dann noch bestätigt werden.
          input-date-time(
            v-model="possibleUntil"
            label="Anmeldeschluss"
            :max="latestJoiningDate"
          )
          div.info.expired(v-if="registrationFinished") Die Anmeldefrist ist abgelaufen, Online-Anmeldungen sind nicht mehr möglich.
          div.info.expiring-soon(v-if="registrationEndingSoon") Die Anmeldefrist endet bald!
          div.info.active(v-if="registrationActive") Die Online-Anmeldung läuft.
          p Infotext für die anmeldenen Personen:
          vue-editor#editor(
            v-model="infotext"
            :editorToolbar="toolbar"
          )
          b-button.mt-4(variant="primary" @click="onSave" :disabled="savePending") Speichern

</template>
<script>

import {mapFields} from 'vuex-map-fields';
import {BIconBoxArrowUpRight} from 'bootstrap-vue';
import InputDateTime from '../../common/components/form-controls/input-date-time.vue';
import {VueEditor} from 'vue2-editor';
import {DateTime} from 'luxon';
import editorToolbar from '../../editor/lib/editorToolbar';

export default {
  name      : 'RegistrationEditor',
  components: {BIconBoxArrowUpRight, InputDateTime, VueEditor},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      toolbar    : editorToolbar,
      savePending: false
    }
  },
  computed  : {
    ...mapFields({
      joinUrl      : 'gameplay.joining.url',
      possibleUntil: 'gameplay.joining.possibleUntil',
      infotext     : 'gameplay.joining.infotext',
      gameDate     : 'gameplay.scheduling.gameDate',
    }),
    gameUrl() {
      return this.joinUrl;
    },
    latestJoiningDate() {
      return DateTime.fromISO(this.gameDate).minus({day: 1}).toISO();
    },
    registrationActive() {
      const limit = DateTime.fromISO(this.possibleUntil).startOf('day').minus({days: 1});
      return DateTime.local() <= limit.startOf('day');
    },
    registrationFinished() {
      return DateTime.local() > DateTime.fromISO(this.possibleUntil);
    },
    registrationEndingSoon() {
      return !(this.registrationActive || this.registrationFinished);
    }
  },
  created   : function () {
  },
  methods   : {
    onSave() {
      let self         = this;
      this.savePending = true;
      this.$store.dispatch('saveRegistrationData')
          .then(() => {
            console.log('done');
          })
          .catch(err => {
            console.error('Nun den Fehler anzeigen', err);
          })
          .finally(()=>{
            self.savePending = false;
          })
    }
  }
}

</script>


<style scoped lang="scss">
.info {
  width: 100%;
  padding-left: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.expired {
  background: red;
  color: white;
}

.expiring-soon {
  background: yellow;
  color: black;
}

.active {
  background: darkgreen;
  color: white;
}

</style>
