<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 15.02.2025
-->

<template>
  <div>
    <Toast/>
    <h2>Veröffentlichung</h2>
    <p>Mit der aktuellen Ferropoly Spiel-Version sind die Spielregeln für die Gruppen erst nach der Finalisierung des Spiels sichtbar, dann werden sie ein erstes Mal automatisch freigegeben. Wenn Du danach
      Änderungen machst, musst Du die Spielregeln wieder explizit hier freigeben!
    </p>
    <message v-if="notFinalizedYet" severity="warn">Das Spiel muss für die ersten Spielregeln zuerst finalisiert werden.
    </message>
    <message v-if="noRulesYet" severity="warn">Aktuell gibt es keine Spielregeln für die Teams. Finalisiere das Spiel
      oder gib die aktuellen Regeln frei.
    </message>
    <message v-if="outdatedRules" severity="error">Die Spielregeln wurden verändert und noch nicht für die Teams freigegeben. Bitte kontrolliere die Spielregeln und gib sie dann mit "Spielregeln freigeben" den teilnehmenden Personen frei.
    </message>
    <message v-if="rulesUpToDate" severity="success">Die aktuellen Spielregeln wurden den Teams freigegeben.</message>

    <Button :disabled="releaseInProcess" label="Spielregeln freigeben" v-if="showReleaseButton" class="mt-4"
            @click="onReleaseClicked"></Button>
  </div>
</template>

<script setup>
import {useRulesStore} from '../../store/RulesStore';
import {computed, ref} from 'vue';
import Button from 'primevue/button';
import Message from 'primevue/message';
import {useToast} from 'primevue/usetoast';
import Toast from 'primevue/toast';

const rulesStore       = useRulesStore();
const releaseInProcess = ref(false);
const toast            = useToast();

const showReleaseButton = computed(()=> {
  return rulesStore.gamePlayFinalized && (noRulesYet.value || outdatedRules.value);
})

const notFinalizedYet = computed(()=> {
  return !rulesStore.gamePlayFinalized;
})

const noRulesYet = computed(() => {
  return rulesStore.gamePlayFinalized && (!rulesStore.released || rulesStore.released.length === 0);
})

const outdatedRules = computed(() => {
  return rulesStore.gamePlayFinalized && (rulesStore.released && rulesStore.released.length > 0 && rulesStore.released !== rulesStore.text);
})

const rulesUpToDate = computed(() => {
  return rulesStore.gamePlayFinalized && (rulesStore.released && rulesStore.text === rulesStore.released);
})

const onReleaseClicked = function () {
  releaseInProcess.value = true;
  rulesStore.releaseRules()
      .then(() => {
        toast.add({
          severity: 'info',
          summary:  'Spielregeln',
          detail:   'Die Spielregeln wurden veröffentlicht.',
          life:     4000
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
      })
      .finally(() => {
        releaseInProcess.value = false;
      });
}
</script>

<style scoped lang="scss">

</style>
