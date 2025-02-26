<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 15.02.2025
-->

<template>
  <div>
    <Toast/>
    <h2>Veröffentlichung</h2>
    <p>Für die angemeldeten Gruppen sind die Spielregeln sichtbar, sobald Du eine Version freigibst, spätestens jedoch
      nach der Finalisierung des Spiels.
    </p>
    <message v-if="noRulesYet" severity="warn">Aktuell gibt es keine Spielregeln für die Teams. Finalisiere das Spiel
      oder
      gib die aktuellen Regeln frei.
    </message>
    <message v-if="outdatedRules" severity="error">Die für die Teams freigegebenen Spielregeln sind älter als die
      bearbeitete Version. Gib die bearbeiteten
      Regeln frei, sobald Du mit den Änderungen fertig bist.
    </message>
    <message v-if="rulesUpToDate" severity="success">Die aktuellen Spielregeln wurden den Teams freigegeben.</message>

    <Button :disabled="releaseInProcess" label="Spielregeln freigeben" v-if="outdatedRules || noRulesYet" class="mt-4"
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

const noRulesYet = computed(() => {
  return !rulesStore.released || rulesStore.released.length === 0;
})

const outdatedRules = computed(() => {
  return rulesStore.released && rulesStore.released.length > 0 && rulesStore.released !== rulesStore.text;
})

const rulesUpToDate = computed(() => {
  return rulesStore.released && rulesStore.text === rulesStore.released;
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
