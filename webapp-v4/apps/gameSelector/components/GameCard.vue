<!---
  A Card for a single game in the EDITOR
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">
  FerroCard(:title="getGpProperty('gamename')")
    table(width="100%")
      tbody
        tr
          td Spieldatum
          td {{gameDate || 'Kein Datum angegeben'}}
        tr
          td Start
          td {{gameStart}}
        tr
          td Ende
          td {{gameEnd}}
        tr
          td Anmeldeschluss &nbsp;&nbsp;
          td
            span.registration-active(v-if="registrationActive") {{joiningPossibleDate(getGpProperty('joining.possibleUntil'))}}
            span.registration-soon(v-if="registrationEndingSoon") {{joiningPossibleDate(getGpProperty('joining.possibleUntil'))}}
            span.registration-finished(v-if="registrationFinished") {{joiningPossibleDate(getGpProperty('joining.possibleUntil'))}}
        tr
          td Karte
          td {{getMapName()}}
        tr
          td Spielbereit
          td
            span(v-if="getGpProperty('internal.finalized')") Ja
            a.no-underline(v-if="!getGpProperty('internal.finalized')" :href="url.viewPricelist") Nein (noch nicht finalisiert)
        tr
          td Löschdatum
          td {{deletionDate}}

    p.id  Id: {{getGpProperty('internal.gameId')}}

    prime-button.btn-gameplay(label="Bearbeiten" icon="pi pi-pencil" severity="primary" v-if="!getGpProperty('internal.finalized') && getGpProperty('isOwner')" @click="gotoUrl(url.edit)")

    prime-button.btn-gameplay(label="Anmeldung" icon="pi pi-file-edit" severity="secondary"  @click="gotoUrl(url.registration)" v-if="getGpProperty('isOwner')")

    prime-button.btn-gameplay(label="Preisliste" icon="pi pi-list" severity="secondary"  @click="gotoUrl(url.viewPricelist)" v-if="getGpProperty('log.priceListVersion') > 0")

    prime-button.btn-gameplay(label="Spielregeln" icon="pi pi-pencil"  severity="secondary" @click="gotoUrl(url.rules)" v-if="getGpProperty('isOwner') && getGpProperty('internal.finalized')")

    prime-button.btn-gameplay(label="Gruppen" icon="pi pi-users" severity="secondary" @click="gotoUrl(url.editPlayer)" v-if="getGpProperty('isOwner')")

    prime-button.btn-gameplay(label="Spielleiter*innen" icon="pi pi-user" @click="gotoUrl(url.editAdmins)" severity="secondary" v-if="getGpProperty('isOwner')")

    prime-button.btn-gameplay(label="Löschen" icon="pi pi-trash" @click="deleteGameplay" severity="danger" v-if="getGpProperty('isOwner') && !getGpProperty('internal.isDemo')")

</template>
<script>

import FerroCard from '../../../common/components/FerroCard.vue';
import {get} from 'lodash';
import {formatGameDate, formatGameTime, formatTimestampAsAgo, createLuxonDate} from '../../../common/lib/formatters'
import {DateTime} from 'luxon';
import {getMapName} from '../../../common/lib/mapTypes';
import PrimeButton from 'primevue/button';

export default {
  name      : 'GameCard',
  components: {FerroCard, PrimeButton},
  filters   : {},
  mixins    : [],
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
        edit         : `/gameplay/edit/${this.gameplay.internal.gameId || 'undefined'}`,
        viewPricelist: `/pricelist/view/${this.gameplay.internal.gameId || 'undefined'}`,
        rules        : `/rules/${this.gameplay.internal.gameId || 'undefined'}`,
        editPlayer   : `/player/edit/${this.gameplay.internal.gameId || 'undefined'}`,
        editAdmins   : `/admins/edit/${this.gameplay.internal.gameId || 'undefined'}`,
        registration : `/registration/${this.gameplay.internal.gameId || 'undefined'}`
      }
    }
  },
  computed  : {
    gameDate() {
      return formatGameDate(this.getGpProperty('scheduling.gameDate'));
    },
    gameStart() {
      return formatGameTime(this.getGpProperty('scheduling.gameStart'));
    },
    gameEnd() {
      return formatGameTime(this.getGpProperty('scheduling.gameEnd'));
    },
    deletionDate() {
      return createLuxonDate(this.getGpProperty('scheduling.deleteTs')).toLocaleString(DateTime.DATE_MED);
    },
    registrationActive() {
      const limit = createLuxonDate(this.gameplay.joining.possibleUntil).startOf('day').minus({days: 1});
      return DateTime.local() <= limit.startOf('day');
    },
    registrationFinished() {
      return DateTime.local() > createLuxonDate(this.gameplay.joining.possibleUntil);
    },
    registrationEndingSoon() {
      return !(this.registrationActive || this.registrationFinished);
    }
  },
  created   : function () {
  },
  methods   : {
    /**
     * Get the property of the gameplay object
     * @param id
     */
    getGpProperty(id) {
      return get(this.gameplay, id, '');
    },
    /**
     * Returns a formatted timestamp as an "ago" string representing the time elapsed since the given ISO date string.
     *
     * @param {string} isoDateString - The ISO date string to be converted.
     * @return {string} The formatted "ago" string representing the time elapsed.
     */
    joiningPossibleDate(isoDateString) {
      return formatTimestampAsAgo(createLuxonDate(isoDateString));
    },
    /**
     * Returns the name of the map
     * @returns {string|string}
     */
    getMapName() {
      return getMapName(this.getGpProperty('internal.map'));
    },
    /**
     * Redirects the current window to the specified URL.
     *
     * @param {string} url - The URL to redirect to.
     */
    gotoUrl(url) {
      window.location.href = url;
    },
    /**
     * Gameplay shall be deleted: raise an event
     */
    deleteGameplay() {
      console.log('deleting');
      this.$emit('delete-gameplay', get(this.gameplay, 'internal.gameId', 'none'));
    }
  }
}

</script>


<style scoped lang="scss">
.registration-active {
  color: darkgreen;
}

.registration-soon {
  color: darkorange;
}

.registration-finished {
  color: red;
}

.no-underline {
  text-decoration: none;
}

.btn-gameplay {
  margin-top: 8px;
  margin-right: 8px;
  font-size: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
}

.id {
  color: rgba(115, 115, 115, 0.73);
  font-size: x-small;
}

</style>
