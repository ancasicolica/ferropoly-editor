<!---
  A Card for a single game in the EDITOR
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template>
  <FerroCard :title="getGpProperty('gamename')">
    <table width="100%">
      <tbody>
      <tr>
        <td>Spieldatum</td>
        <td>{{ gameDate || 'Kein Datum angegeben' }}</td>
      </tr>
      <tr>
        <td>Start</td>
        <td>{{ gameStart }}</td>
      </tr>
      <tr>
        <td>Ende</td>
        <td>{{ gameEnd }}</td>
      </tr>
      <tr>
        <td>Anmeldeschluss &nbsp;&nbsp;</td>
        <td>
          <span v-if="registrationActive"
                class="registration-active">{{ joiningPossibleDate(getGpProperty('joining.possibleUntil')) }}</span>
          <span v-if="registrationEndingSoon"
                class="registration-soon">{{ joiningPossibleDate(getGpProperty('joining.possibleUntil')) }}</span>
          <span v-if="registrationFinished"
                class="registration-finished">{{ joiningPossibleDate(getGpProperty('joining.possibleUntil')) }}</span>
        </td>
      </tr>
      <tr>
        <td>Karte</td>
        <td>{{ getMapName() }}</td>
      </tr>
      <tr>
        <td>Spielbereit</td>
        <td>
          <span v-if="getGpProperty('internal.finalized')">Ja</span>
          <a v-if="!getGpProperty('internal.finalized')" class="no-underline" :href="url.viewPricelist">Nein (noch nicht
            finalisiert)</a>
        </td>
      </tr>
      <tr>
        <td>Löschdatum</td>
        <td>{{ deletionDate }}</td>
      </tr>
      </tbody>
    </table>

    <p class="id">Id: {{ getGpProperty('internal.gameId') }}</p>

    <prime-button v-if="editAllowed" class="btn-gameplay" label="Bearbeiten" icon="pi pi-pencil" severity="primary"
                  @click="gotoUrl(url.edit)"></prime-button>

    <prime-button v-if="getGpProperty('isOwner')" class="btn-gameplay" label="Anmeldung" icon="pi pi-file-edit"
                  severity="secondary" @click="gotoUrl(url.registration)"></prime-button>

    <prime-button v-if="getGpProperty('log.priceListVersion') > 0" class="btn-gameplay" label="Preisliste"
                  icon="pi pi-list" severity="secondary" @click="gotoUrl(url.viewPricelist)"></prime-button>

    <prime-button v-if="getGpProperty('isOwner')" class="btn-gameplay" label="Spielregeln" :badge="badge"
                  badge-severity="danger" icon="pi pi-pencil" severity="secondary"
                  @click="gotoUrl(url.rules)"></prime-button>

    <prime-button v-if="getGpProperty('isOwner')" class="btn-gameplay" label="Gruppen" icon="pi pi-users"
                  severity="secondary" @click="gotoUrl(url.editPlayer)" :badge="nbTeamsToConfirm"
                  badgeSeverity="contrast"></prime-button>

    <prime-button v-if="getGpProperty('isOwner')" class="btn-gameplay" label="Spielleiter*innen" icon="pi pi-user"
                  @click="gotoUrl(url.editAdmins)" severity="secondary"></prime-button>

    <prime-button v-if="getGpProperty('isOwner')" class="btn-gameplay" label="Challenges" icon="pi pi-trophy"
                  :disabled="challengesDisabled"
                  @click="gotoUrl(url.challenges)" severity="secondary"></prime-button>

    <prime-button v-if="getGpProperty('isOwner')" class="btn-gameplay" label="Export" icon="pi pi-download"
                  @click="gotoUrl(url.export)" severity="secondary"></prime-button>

    <prime-button v-if="deletingAllowed" class="btn-gameplay" label="Löschen" icon="pi pi-trash" @click="deleteGameplay"
                  severity="danger"></prime-button>
  </FerroCard>
</template>
<script setup>

import FerroCard from '../../../common/components/FerroCard.vue';
import {computed} from 'vue';
import {get} from 'lodash';
import {formatGameDate, formatGameTime, formatTimestampAsAgo, createLuxonDate} from '../../../common/lib/formatters'
import {DateTime} from 'luxon';
import {getMapName as getMapTypeName} from '../../../common/lib/mapTypes';
import PrimeButton from 'primevue/button';

const props = defineProps({
  gameplay: {
    type:    Object,
    default: () => ({})
  }
});
const emit  = defineEmits(['delete-gameplay']);

const url = computed(() => {
  const gameId = props.gameplay.internal.gameId || 'undefined';
  return {
    edit:          `/gameplay/edit/${gameId}`,
    viewPricelist: `/pricelist/view/${gameId}`,
    rules:         `/rules/${gameId}`,
    editPlayer:    `/player/edit/${gameId}`,
    editAdmins:    `/admins/edit/${gameId}`,
    registration:  `/registration/${gameId}`,
    export:        `/export/info/${gameId}`,
    challenges:    `/challenges/${gameId}`,
  };
});

/**
 * Get the property of the gameplay object
 * @param id
 * @param proposed
 */
function getGpProperty(id, proposed = '') {
  return get(props.gameplay, id, proposed);
}

const gameDate               = computed(() => formatGameDate(getGpProperty('scheduling.gameDate')));
const gameStart              = computed(() => formatGameTime(getGpProperty('scheduling.gameStart')));
const gameEnd                = computed(() => formatGameTime(getGpProperty('scheduling.gameEnd')));
const deletionDate           = computed(() => createLuxonDate(getGpProperty('scheduling.deleteTs')).toLocaleString(DateTime.DATE_MED));
const registrationActive     = computed(() => {
  const limit = createLuxonDate(props.gameplay.joining.possibleUntil).startOf('day').minus({days: 1});
  return DateTime.local() <= limit.startOf('day');
});
const registrationFinished   = computed(() => DateTime.local() > createLuxonDate(props.gameplay.joining.possibleUntil));
const registrationEndingSoon = computed(() => !(registrationActive.value || registrationFinished.value));
const badge                  = computed(() => props.gameplay?.rulesUpdateNeeded ? '!' : null);
const nbTeamsToConfirm       = computed(() => props.gameplay.teamsToConfirm ? `${props.gameplay.teamsToConfirm}` : null);
const editAllowed            = computed(() => {
  if (getGpProperty('internal.finalized')) {
    return false;
  }
  if (!getGpProperty('isOwner')) {
    return false;
  }
  return getGpProperty('scheduling.gameDate', new Date()) >= new Date();
});
const deletingAllowed        = computed(() => {
  // At the time of playing, we do not delete gameplays
  const gameDate  = getGpProperty('scheduling.gameDate');
  const finalized = getGpProperty('internal.finalized');
  if (finalized && DateTime.now().hasSame(gameDate, 'day')) {
    console.log('Today we do not delete a finalized game');
    return false;
  }

  //  Must be owner and not a demo game
  return getGpProperty('isOwner') && !getGpProperty('internal.isDemo')
});
const challengesDisabled = computed(()=> {
  // At the time of playing, we do not delete gameplays
  const gameDate  = getGpProperty('scheduling.gameDate');
  if (DateTime.now().hasSame(gameDate, 'day')) {
    console.log('Today we use the main prog for challenges');
    return true;
  }

  if (DateTime.now() > gameDate) {
    console.log('Game expired, no challenges');
    return true;
  }
  return false;
})

/**
 * Returns a formatted timestamp as an "ago" string representing the time elapsed since the given ISO date string.
 *
 * @param {string} isoDateString - The ISO date string to be converted.
 * @return {string} The formatted "ago" string representing the time elapsed.
 */
function joiningPossibleDate(isoDateString) {
  return formatTimestampAsAgo(createLuxonDate(isoDateString));
}

/**
 * Returns the name of the map
 * @returns {string|string}
 */
function getMapName() {
  return getMapTypeName(getGpProperty('internal.map'));
}

/**
 * Redirects the current window to the specified URL.
 *
 * @param {string} url - The URL to redirect to.
 */
function gotoUrl(url) {
  window.location.href = url;
}

/**
 * Gameplay shall be deleted: raise an event
 */
function deleteGameplay() {
  console.log('deleting');
  emit('delete-gameplay', get(props.gameplay, 'internal.gameId', 'none'));
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
