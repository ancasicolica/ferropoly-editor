<!---
  A single card with infos about a game
-->
<template lang="pug">
  div
    ferro-card(:title="getGpProperty('gamename')")
      b-row
        b-col Spieldatum
        b-col {{getGpProperty('scheduling.gameDate') | formatDate}}
      b-row
        b-col Start
        b-col {{getGpProperty('scheduling.gameStart')}}
      b-row
        b-col Ende
        b-col {{getGpProperty('scheduling.gameEnd')}}
      b-row
        b-col Anmeldeschluss
        b-col.registration-active(v-if="registrationActive") {{joiningPossibleDate(getGpProperty('joining.possibleUntil'))}}
        b-col.registration-soon(v-if="registrationEndingSoon") {{joiningPossibleDate(getGpProperty('joining.possibleUntil'))}}
        b-col.registration-finished(v-if="registrationFinished") {{joiningPossibleDate(getGpProperty('joining.possibleUntil'))}}
      b-row
        b-col Karte
        b-col {{getMapName()}}
      b-row
        b-col Spielbereit
        b-col(v-if="getGpProperty('internal.finalized')") Ja
        b-col(v-if="!getGpProperty('internal.finalized')" :href="url.viewPricelist") Nein (noch nicht finalisiert)
      b-row
        b-col Löschdatum
        b-col {{getGpProperty('scheduling.deleteTs') | formatDate}}
      b-row
        b-col.id Id: {{getGpProperty('internal.gameId')}}
      b-row
        b-col
          b-button.btn-gameplay(size="sm" variant="primary" v-if="!getGpProperty('internal.finalized') && getGpProperty('isOwner')" :href="url.edit") Bearbeiten &nbsp;
            b-icon-pencil

          b-button.btn-gameplay(size="sm" :href="url.registration" v-if="getGpProperty('isOwner')") Anmeldung &nbsp;
            b-icon-file-post

          b-button.btn-gameplay(size="sm" v-if="getGpProperty('log.priceListVersion') > 0" :href="url.viewPricelist") Preisliste &nbsp;
            b-icon-eye

          b-button.btn-gameplay(size="sm" v-if="getGpProperty('isOwner') && getGpProperty('internal.finalized')" :href="url.rules") Spielregeln &nbsp;
            b-icon-pencil

          b-button.btn-gameplay(size="sm" v-if="getGpProperty('isOwner')" :href="url.editPlayer") Gruppen &nbsp;
            b-icon-people

          b-button.btn-gameplay(size="sm" v-if="getGpProperty('isOwner')" :href="url.editAdmins") Spielleiter*innen
            b-icon-person

          b-button.btn-gameplay(size="sm" v-if="getGpProperty('isOwner') && !getGpProperty('internal.isDemo')" v-on:click="deleteGameplay") Löschen
            b-icon-trash

</template>

<script>
import {BIconTrash, BIconPerson, BIconPeople, BIconEye, BIconPencil, BIconFilePost} from 'bootstrap-vue';
import {get} from 'lodash';
import {getMapName} from '../../common/lib/mapTypes'
import FerroCard from '../../common/components/ferro-card/ferro-card.vue'
import {DateTime} from 'luxon';
import {formatTimestampAsAgo, relativeDate} from '../../common/lib/formatters';

export default {
  name      : 'GameCard',
  components: {FerroCard, BIconTrash, BIconPerson, BIconPeople, BIconEye, BIconPencil, BIconFilePost},
  model     : {},
  props     : {
    gameplay: {
      type   : Object,
      default: function () {
        return {};
      }
    }

  },
  data      : function () {
    return {
      url: {
        edit         : `/gameplay/edit/${this.gameplay.internal.gameId}`,
        viewPricelist: `/pricelist/view/${this.gameplay.internal.gameId}`,
        rules        : `/rules/${this.gameplay.internal.gameId}`,
        editPlayer   : `/player/edit/${this.gameplay.internal.gameId}`,
        editAdmins   : `/admins/edit/${this.gameplay.internal.gameId}`,
        registration : `/registration/${this.gameplay.internal.gameId}`
      }
    };
  },
  computed  : {
    registrationActive() {
      const limit = DateTime.fromISO(this.gameplay.joining.possibleUntil).startOf('day').minus({days: 1});
      return DateTime.local() <= limit.startOf('day');
    },
    registrationFinished() {
      return DateTime.local() > DateTime.fromISO(this.gameplay.joining.possibleUntil);
    },
    registrationEndingSoon() {
      return !(this.registrationActive || this.registrationFinished);
    }

  },
  methods   : {
    /**
     * Gameplay shall be deleted: raise an event
     */
    deleteGameplay: function () {
      console.log('deleting');
      this.$emit('delete-gameplay', get(this.gameplay, 'internal.gameId', 'none'));
    },
    /**
     * Get the property of the gameplay object
     * @param id
     */
    getGpProperty(id) {
      return get(this.gameplay, id, '');
    },
    /**
     * Returns the name of the map
     * @returns {string|string}
     */
    getMapName() {
      console.log('getMapName', this.getGpProperty('internal.map'), getMapName(this.getGpProperty('internal.map')));
      return getMapName(this.getGpProperty('internal.map'));
    },

    joiningPossibleDate(isoDateString) {
      return formatTimestampAsAgo(DateTime.fromISO(isoDateString));
    }
  }
}
</script>

<style scoped>

.btn-gameplay {
  margin-top: 8px;
  margin-right: 8px;
}

.id {
  color: rgba(115, 115, 115, 0.73);
  font-size: x-small;
}

.registration-active {
  color: darkgreen;
}

.registration-soon {
  color: darkorange;
}

.registration-finished {
  color: red;
}
</style>
