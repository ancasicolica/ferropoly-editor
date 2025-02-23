<!---
  The Editor page for the rules
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 15.02.2025
-->

<template>
  <div class="grid">
    <Toast/>
    <div class="col-12 md:col-7 lg:col-7 xl:col-8">
      <Editor v-model="rulesStore.raw"></Editor>
    </div>
    <div class="col-12 md:col-5 lg:col-5 xl:col-4">
      <Button label="Speichern" :disabled="!rulesStore.editAllowed" @click="onSaveRules"></Button>
      <Divider/>
      <editor-help></editor-help>
    </div>
  </div>

</template>

<script setup>
import Button from 'primevue/button';
import Editor from 'primevue/editor';
import Divider from 'primevue/divider';
import {useRulesStore} from '../store/RulesStore';
import EditorHelp from './editor/EditorHelp.vue';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';

const rulesStore = useRulesStore();
const toast      = useToast();

const onSaveRules = function () {
  rulesStore.saveRules()
      .then(() => {
        toast.add({
          severity: 'info',
          summary:  'Spielregeln',
          detail:   'Die Spielregeln wurden gespeichert.',
          life:     2000
        })
      })
      .catch(err => {
        console.warn(err);
        toast.add({
          severity: 'error',
          summary:  'Spielregeln',
          detail:   err.response.data,
          life:     6000
        })
      });
}
</script>

<style scoped lang="scss">

</style>
