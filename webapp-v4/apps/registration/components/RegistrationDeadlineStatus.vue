<!---
  Info message about deadline
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.01.2025
-->

<template>
  <div class="mt-3">
    <message severity="error" v-if="registrationFinished">Die Anmeldefrist ist abgelaufen, Online-Anmeldungen sind nicht
      mehr möglich.
    </message>
    <message severity="warn" v-if="registrationEndingSoon">Die Anmeldefrist endet bald!</message>
    <message severity="success" v-if="registrationActive">Die Online-Anmeldung läuft, Anmeldungen können online
      eingereicht werden.
    </message>
  </div>

</template>

<script setup>

import Message from 'primevue/message';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {storeToRefs} from 'pinia';

const gamePlayStore = useGameplayStore();

const {registrationFinished, registrationActive, registrationEndingSoon} = storeToRefs(gamePlayStore);

</script>

<style scoped lang="scss">

</style>
