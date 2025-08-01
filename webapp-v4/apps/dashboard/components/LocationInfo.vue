<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <h2>Locations</h2>
    <table class="table-fixed border-spacing-[7px]">
      <tbody>
      <tr>
        <td>Version</td>
        <td>{{ locationInfo.version }}</td>
      </tr>
      <tr>
        <td>Anzahl Orte total</td>
        <td>{{ locationInfo.all }}</td>
      </tr>
      <tr v-for="map in enabledMaps" :key="map.name">
        <td class="pr-5">{{ map.name }}</td>
        <td>{{ map.locationNb }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {useDashboardStore} from '../store/DashboardStore';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';

const dashboardStore = useDashboardStore();
const {locationInfo} = storeToRefs(dashboardStore);

const enabledMaps = computed(() => {
  return dashboardStore.locationInfo.maps.filter(map => map.enabled !== false);
})
</script>

<style scoped lang="scss">

</style>
