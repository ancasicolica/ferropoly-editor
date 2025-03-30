<!---
  Info about a player
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.03.2025
-->

<template>
  <div>
    <Card>
      <template #title>{{ teamName }}</template>
      <template #content>
        <data-table :value="[
            { title: 'Kontaktperson', content: teamLeaderName},
            { title: 'Organisation', content: organization},
            { title: 'Telefonnummer', content: teamLeaderPhone},
            { title: 'Email', content: teamLeaderEmail},
            { title: 'Bemerkungen', content: remarks}
        ]">
          <column field="title"></column>
          <column field="content">
            <template #body="slotProps">
              <div>{{ slotProps.data.content }}</div>
            </template>
          </column>
        </data-table>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {usePlayerStore} from '../store/PlayerStore';
import {computed} from 'vue';
import {get} from 'lodash';


const playerStore = usePlayerStore();

const confirmationRequired = computed(() => {
  return !get(playerStore.currentTeam, 'data.confirmed', false);
})

const teamName = computed(() => {
  return get(playerStore.currentTeam, 'data.name', '');
})

const teamLeaderName = computed(() => {
  return get(playerStore.currentTeam, 'data.teamLeader.name', '');
})

const organization = computed(() => {
  return get(playerStore.currentTeam, 'data.organization', '');
})

const teamLeaderPhone = computed(() => {
  return get(playerStore.currentTeam, 'data.teamLeader.phone', '');
})

const teamLeaderEmail = computed(() => {
  return get(playerStore.currentTeam, 'data.teamLeader.email', '');
})

const remarks = computed(() => {
  return get(playerStore.currentTeam, 'data.remarks', '');
})


</script>

<style scoped lang="scss">

</style>
