<!---
  List with all games
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 12.09.21
-->
<template lang="pug">
  div
    b-table(:items="gameplays" :fields="fields" )
      template(#cell(scheduling.gameDate)="data") {{data.item.scheduling.gameDate | formatDate }}
      template(#cell(scheduling.countdown)="data") {{data.item.scheduling.countdown | formatCountdown }}
      template(#cell(owner.organisatorName)="data")
        a(:href="emailLink(data.item.owner.organisatorEmail)") {{data.item.owner.organisatorName }}

</template>

<script>
import {DateTime} from 'luxon';

/**
 * Filter for date
 * @param d
 * @returns {string}
 */
function formatDate(d) {
  let date = DateTime.fromISO(d);
  return date.toISODate();
}

/**
 * Filter for countdown
 * @param c
 * @returns {string}
 */
function formatCountdown(c) {
  if (c === 0) {
    return 'HEUTE';
  }
  if (c === 1) {
    return 'MORGEN';
  }
  if (c === -1) {
    return 'GESTERN'
  }
  if (c > 0) {
    return `in ${c} Tagen`;
  }
  return `vor ${c} Tagen`;
}

export default {
  name      : 'dashboard-gp-list',
  props     : {
    gameplays: {
      type   : Array,
      default: () => {
        return [];
      }
    }
  },
  data      : function () {
    return {
      fields: [
        {key: 'internal.gameId', label: 'ID', sortable: true},
        {key: 'internal.map', label: 'Karte', sortable: true},
        {key: 'teamNb', label: 'Teams', sortable: true},
        {key: 'propertyNb', label: 'Orte', sortable: true},
        {key: 'scheduling.gameDate', label: 'Datum', sortable: true},
        {key: 'scheduling.countdown', label: 'Countdown', sortable: true},
        {key: 'internal.finalized', label: 'Finalisiert', sortable: true},
        {key: 'owner.organisatorName', label: 'Organisator', sortable: true},
        {key: 'owner.organisation', label: 'Organisation', sortable: true},
      ]
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    emailLink(mail) {
      return `mailto:${mail}`;
    }
  },
  components: {},
  filters   : {formatDate, formatCountdown},
  mixins    : []
}
</script>

<style lang="scss" scoped>

</style>
