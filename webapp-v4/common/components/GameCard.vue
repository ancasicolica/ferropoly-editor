<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">
  FerroCard(:title="getGpProperty('gamename')")
    table(width="100%")
      tr
        td Spieldatum
        td {{gameDate}}
      tr
        td Start
        td {{getGpProperty('scheduling.gameStart')}}
      tr
        td Ende
        td {{getGpProperty('scheduling.gameEnd')}}
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




</template>
<script>

import FerroCard from './FerroCard.vue';
import {get} from 'lodash';
import {formatGameDate, formatTimestampAsAgo, createLuxonDate} from '../lib/formatters'
import {DateTime} from 'luxon';
import {getMapName} from '../../../editor/webapp/common/lib/mapTypes';

export default {
  name: 'GameCard',
  components: {FerroCard},
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
        edit         : `/gameplay/edit/${this.gameplay.internal.gameId}`,
        viewPricelist: `/pricelist/view/${this.gameplay.internal.gameId}`,
        rules        : `/rules/${this.gameplay.internal.gameId}`,
        editPlayer   : `/player/edit/${this.gameplay.internal.gameId}`,
        editAdmins   : `/admins/edit/${this.gameplay.internal.gameId}`,
        registration : `/registration/${this.gameplay.internal.gameId}`
      }
    }
  },
  computed  : {
    gameDate() {
      return  formatGameDate(this.getGpProperty('scheduling.gameDate'));
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

</style>
