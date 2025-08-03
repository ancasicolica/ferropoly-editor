<!---
  The Editor page for the rules
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 15.02.2025
-->

<template>
  <div>
    <Toast/>
    <ConfirmDialog></ConfirmDialog>
    <div class="grid grid-cols-12 gap-4">
      <div class="sm:col-span-12 lg:col-span-8">
        <Editor v-model="rulesStore.raw" :readonly="!rulesStore.editAllowed">
        </Editor>
      </div>
      <div class="sm:col-span-12 lg:col-span-4">
        <div v-if="rulesStore.editAllowed">
          <Button label="Speichern" :disabled="saveDisabled" @click="onSaveRules"></Button>
          <Button label="Spielregeln zurücksetzen" severity="secondary" @click="onResetRules" class="ml-5"></Button>
          <Divider/>
          <editor-help></editor-help>
        </div>
        <div v-if="!rulesStore.editAllowed">
          <message severity="error">Die Spielregeln können nicht mehr bearbeitet werden.</message>
        </div>
      </div>

    </div>
  </div>


</template>

<script setup>
import Button from 'primevue/button';
import Editor from 'primevue/editor';
import Divider from 'primevue/divider';
import Message from 'primevue/message';
import {useRulesStore} from '../store/RulesStore';
import EditorHelp from './editor/EditorHelp.vue';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';
import {computed} from 'vue';
import {useRouter} from 'vue-router'; // Vue Router
import ConfirmDialog from 'primevue/confirmdialog';
import {useConfirm} from 'primevue/useconfirm';

const rulesStore = useRulesStore();
const toast      = useToast();
const router     = useRouter();
const confirm    = useConfirm();

const saveDisabled = computed(() => {
  return !rulesStore.editAllowed || (rulesStore.raw === rulesStore.rawOriginal)
})

const onResetRules = function () {
  confirm.require({
    message:     'Dies setzt die Spielregeln auf die Originalversion zurück, bist Du sicher?',
    header:      'Spielregeln zurücksetzen',
    icon:        'pi pi-exclamation-triangle',
    rejectProps: {
      label:    'Nein, abbrechen',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Ja'
    },
    accept:      () => {
      rulesStore.resetRules().then(() => {
        toast.add({
          severity: 'info',
          summary:  'Spielregeln zurücksetzen',
          detail:   'Die Spielregeln wurden zurückgesetzt',
          life:     4000
        });
      })

    },
    reject:      () => {
      // toast.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000});
    }
  });
}

const onSaveRules = function () {
  rulesStore.saveRules()
      .then(() => {
        // Won't be displayed actually, as we go to the preview screen immediately. But
        // as this could change, leave it here.
        toast.add({
          severity: 'info',
          summary:  'Spielregeln',
          detail:   'Die Spielregeln wurden gespeichert.',
          life:     2000
        })
        router.push('/preview');
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
