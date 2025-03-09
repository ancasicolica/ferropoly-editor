<!---
  Info about a single player
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.03.2025
-->

<template>
  <div>
    <Card>
      <template #content>
        <div class="flex">
          <div class="flex mr-5">
            <Avatar :image="avatar" size="xlarge" shape="circle"></Avatar>
          </div>
          <div class="flex flex-column">
            <div class="team-name">{{ teamName }}</div>
            <div>{{ teamLeaderName }} ({{ organization }})</div>
            <Message severity="warn" v-if="playerToBeConfirmed">
              <i class="pi pi-user-plus mr-1"></i>Neue Anmeldung, bitte bestätigen
            </Message>
            <Message severity="error" v-if="playerDataInvalid">
              <i class="pi pi-exclamation-triangle mr-1"></i>Die Daten sind noch nicht vollständig!
            </Message>
          </div>

        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import {computed, defineProps} from 'vue';
import {get} from 'lodash';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';

import Message from 'primevue/message';
import {playerSchema} from '../../../common/schemas/PlayerSchema';

const props = defineProps({
  player: {
    type:    Object,
    default: () => {
      return null;
    }
  }
})

const avatar              = computed(() => {
  return get(props, 'player.login.personalData.avatar', '/');
})
const teamName            = computed(() => {
  return get(props, 'player.data.name');
})
const teamLeaderName      = computed(() => {
  return get(props, 'player.data.teamLeader.name');
})
const organization        = computed(() => {
  return get(props, 'player.data.organization');
})
const playerToBeConfirmed = computed(() => {
  return get(props, 'player.data.onlineRegistration', false) && !get(props, 'player.data.confirmed', true);
})
const playerDataInvalid   = computed(() => {
  const res = playerSchema.safeParse(props.player.data);
  console.log('RES', res);
  return !res.success;
})


</script>

<style scoped lang="scss">
.team-name {
  font-size: large;
  font-weight: bold;
  margin-bottom: 3px;
}
</style>
