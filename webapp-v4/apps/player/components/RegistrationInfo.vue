<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div>
    <Card>
      <template #title>Online Anmeldung</template>
      <template #content>
        <p class="m-0">
          Die Gruppen können sich unter folgendem Link selbst für das Spiel anmelden:
          <a :href="registrationUrl" target="_blank">https://spiel.ferropoly.ch/anmelden/ferropoly-spiel</a>
          <br/>
          Angemeldete Gruppen müssen anschliessend mit dieser App bestätigt werden.
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup>

import Card from 'primevue/card';
import {ref} from 'vue';

const registrationUrl = ref('/');

</script>

<style scoped lang="scss">

</style>
