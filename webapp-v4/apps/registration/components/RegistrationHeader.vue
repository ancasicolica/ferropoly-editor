<!---
  Header for the registration
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.01.2025
-->

<template>
  <div>
    <h1>Online-Anmeldung</h1>
    <p>Die Gruppen können sich online für das Spiel anmelden (<a :href="registerUrl" target="_blank">Link <i
        class="pi pi-external-link"></i></a>). Damit
      sie dieses Anmeldeformular benutzen können, müssen sie sich beim Ferrpoly registrieren - genau gleich, wie Du das
      bereits gemacht hast. Du bekommst
      bei jeder neuen Anmeldung ein Mail zugeschickt, diese Anmeldung muss unter "Gruppen" dann noch bestätigt werden.
    </p>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';

const gamePlayStore = useGameplayStore();
const {joining}     = storeToRefs(gamePlayStore);

const registerUrl   = computed(() => {
  return joining.value?.url;
});

</script>

<style scoped lang="scss">

</style>
