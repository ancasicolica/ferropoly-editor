<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-info
    b-list-group-item.d-flex.d-flex-row(@click="onClick" href="#")
      b-avatar(:src="getAdvatar()" size="60px")
      div.pl-2
        h5 {{player.data.name}}
        div {{player.data.organization}}
          span(v-if="player.data.teamLeader.name") &nbsp; ({{player.data.teamLeader.name}})
        div.new-team(v-if="playerToBeConfirmed")
          b-icon-person-plus-fill
          span &nbsp;Neue Anmeldung, bitte bestätigen
        div.not-ready(v-if="playerDataInvalid")
          b-icon-exclamation-triangle
          span &nbsp;Die Daten sind noch nicht vollständig!

</template>

<script>
import {get} from 'lodash';
import {checkPlayer} from '../../common/lib/playerValidator'
import {BIconExclamationTriangle, BIconPersonPlusFill} from 'bootstrap-vue';

export default {
  name      : 'PlayerInfo',
  components: {BIconExclamationTriangle, BIconPersonPlusFill},
  filters   : {},
  model     : {},
  props     : {
    player: {
      type   : Object,
      default: () => {
        return {
          data : {
            confirmed         : false, // They're joining the party!
            onlineRegistration: false,
            name              : '',
            organization      : '',
            teamLeader        : {
              name: ''
            },
            remarks           : '',
          },
          login: {
            personalData: {
              avatar: ''
            }
          }
        };
      }
    }

  },
  data      : function () {
    return {};
  },
  computed  : {
    playerDataInvalid() {
      return !checkPlayer(this.player);
    },
    playerToBeConfirmed() {
      return this.player.data.onlineRegistration && !this.player.data.confirmed;
    }
  },
  created   : function () {
    console.log(this.player);
  },
  methods   : {
    onClick() {
      this.$emit('click', this.player);
    },
    getAdvatar() {
      console.log('player', this.player);
      return get(this.player, 'login.personalData.avatar', '')
    }
  }
}
</script>

<style scoped>
.not-ready {
  color: red;
}

.new-team {
  color: blue
}
</style>
