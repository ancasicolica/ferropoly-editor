<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <h2>Benutzer</h2>
    <p>Anzahl registrierte Benutzer: {{dashboardStore.registeredUsers}}</p>
  </div>
</template>

<script setup>
import {useDashboardStore} from '../store/DashboardStore';

const dashboardStore = useDashboardStore();


</script>

<style scoped lang="scss">

</style>
