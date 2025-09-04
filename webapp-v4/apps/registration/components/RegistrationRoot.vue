<!---
  All about registration
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.01.2025
-->

<template>
  <menu-bar :elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/registration/"></menu-bar>
  <Toast/>
  <div class="ml-3 mr-3">
    <registration-header></registration-header>
    <registration-deadline></registration-deadline>
    <registration-deadline-status></registration-deadline-status>
    <registration-info-editor></registration-info-editor>
    <Button class="mt-2" label="Speichern" @click="saveData"></Button>
  </div>

</template>

<script setup>
import MenuBar from '../../../common/components/MenuBar.vue'
import RegistrationDeadline from './RegistrationDeadline.vue';
import {onBeforeMount, ref} from 'vue';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';
import {last, split} from 'lodash';
import RegistrationDeadlineStatus from './RegistrationDeadlineStatus.vue';
import RegistrationInfoEditor from './RegistrationInfoEditor.vue';
import RegistrationHeader from './RegistrationHeader.vue';
import Button from 'primevue/button';

const gamePlayStore   = useGameplayStore();
const gameId          = ref('');
const menuBarElements = [];

const toast = useToast();

onBeforeMount(() => {
  // Retrieve GameId for this page
  const elements = split(window.location.pathname, '/');
  gameId.value   = last(elements);
  gamePlayStore.loadGameplay(gameId.value)
});

const saveData = function () {
  gamePlayStore.saveGameplay()
      .then(info => {
        if (info.success) {
          toast.add({
            severity: 'success',
            summary:  'OK',
            detail:   `Die Anmeldedaten wurden gespeichert.`,
            life:     2000
          });
        }
        else {
          toast.add({
            severity: 'error',
            summary:  'OK',
            detail:   info.message,
            life:     4000
          });
        }
      })
      .catch(err => {
        toast.add({
          severity: 'error',
          summary:  'OK',
          detail:   'Interner Fehler: ' + err.message,
          life:     4000
        });
        console.error(err);
      })
}
</script>

<style scoped lang="scss">

</style>
