<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <h2>Locations</h2>
    <div class="grid">
        <div class="col-6">Version</div>
        <div class="col-6">{{locationInfo.version}}</div>
    </div>
    <div class="grid">
        <div class="col-6">Anzahl Orte total</div>
        <div class="col-6">{{locationInfo.all}}</div>
    </div>
    <div v-for="map in enabledMaps" :key="map.name"  class="grid">

        <div class="col-6"> {{map.name}}</div>
        <div class="col-6"> {{map.locationNb}}</div>

    </div>

  </div>
</template>

<script setup>
import {useDashboardStore} from '../store/DashboardStore';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';

const dashboardStore = useDashboardStore();
const {locationInfo} = storeToRefs(dashboardStore);

const enabledMaps = computed(()=> {
  return dashboardStore.locationInfo.maps.filter(map => map.enabled !== false);
})
</script>

<style scoped lang="scss">

</style>
