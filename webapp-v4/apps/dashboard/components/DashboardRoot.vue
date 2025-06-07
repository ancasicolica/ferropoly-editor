<!---
  Root element of the dashboard
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <menu-bar :elements="menuBarElements"></menu-bar>
    <div class="m-2">
    <div>
      <h1>Admin Dashboard</h1>
    </div>

    <div class="grid">
      <div class="col">
        <user-info></user-info>
      </div>
      <div class="col">
        <location-info></location-info>
      </div>
      <div class="col">
        <location-downloader></location-downloader>
        <location-uploader></location-uploader>
      </div>
    </div>
    <gameplay-list></gameplay-list>
    </div>
  </div>
</template>

<script setup>
import MenuBar from '../../../common/components/MenuBar.vue';
import {ref} from 'vue';
import UserInfo from './UserInfo.vue';
import LocationInfo from './LocationInfo.vue';
import LocationDownloader from './LocationDownloader.vue';
import LocationUploader from './LocationUploader.vue';
import GameplayList from './GameplayList.vue';
import {useDashboardStore} from '../store/DashboardStore';

const dashboardStore = useDashboardStore();

dashboardStore.fetchData();
const menuBarElements = ref([]);
</script>

<style scoped lang="scss">

</style>
