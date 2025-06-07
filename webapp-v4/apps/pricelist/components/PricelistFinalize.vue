<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.01.2025
-->

<template>
  <div>
    <confirm-dialog>
    </confirm-dialog>
    <Toast position="center"/>
    <ferro-card title="Sind alle Daten richtig?">
      <div>Wenn die Preisliste den Vorstellungen entspricht und die Spieldaten alle richtig sind, dann muss das Spiel
        'finalisiert' werden, erst dann kann das Spiel gespielt werden. Konkret heisst das folgendes:
      </div>
      <ul>
        <li>Die Spielparameter werden eingefroren und können nicht mehr verändert werden.</li>
        <li>Die Preisliste ist fix - es können keine Orte hinzugefügt, entfernt oder die Reihenfolge verändert werden.
        </li>
        <li>Der Countdown für den Spielbeginn wird gesetzt, das erste Startgeld wird den dann vorhandenen Gruppen
          automatisch ausbezahlt.
        </li>
        <li>Die Preisliste wird für die Spieler sichtbar.</li>
      </ul>
      <div>Nach diesem Schritt hat man also das endgültige Spiel und die Preisliste wird den Spieler*innen über
        den "Link zur Preisliste für Teams" angezeigt.
      </div>
      <p>Das Spiel muss bis spätestens einer Stunde vor Spielbeginn finalisiert werden.</p>

      <prime-button @click="onFinalize" label="Preisliste finalisieren" class="mt-4"
                    :disabled="finalizing"></prime-button>
      <ProgressBar v-if="finalizing" mode="indeterminate" style="height: 6px" class="mt-4"></ProgressBar>
    </ferro-card>
  </div>
</template>

<script setup>

import ProgressBar from 'primevue/progressbar';
import PrimeButton from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import {useConfirm} from 'primevue/useconfirm';
import {useToast} from 'primevue/usetoast';
import {ref} from 'vue';
import FerroCard from '../../../common/components/FerroCard.vue';
import {usePricelistStore} from '../../../lib/store/pricelistStore';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';

const confirm        = useConfirm();
const finalizing     = ref(false);
const pricelistStore = usePricelistStore();
const gameplayStore = useGameplayStore();
const toast          = useToast();

const onFinalize = function () {
  console.log('finalize it')

  confirm.require({
    header:      'Spiel finalisieren',
    message:     'Ein finalisiertes Spiel kann NICHT mehr bearbeitet werden. Möchtest Du fortfahren?',
    icon:        'pi pi-exclamation-triangle',
    modal:       true,
    rejectProps: {
      label:    'Abbrechen',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Finalisiere mein Spiel!'
    },
    accept:      async () => {
      finalizing.value = true;
      const result = await pricelistStore.finalizeGameplay();
      if (result.success) {
        console.log('all right');
        toast.add({
          severity: 'success',
          summary:  'OK',
          detail:   `Das Spiel wurde erfolgreich finalisiert.`,
          life:     4000
        });
        await gameplayStore.loadGameplay(gameplayStore.gameId);
      } else {
        toast.add({
          severity: 'error',
          summary:  'Fehler',
          detail:   `Die Anfrage lieferte folgenden Fehler: ${result.message}`,
        });
        finalizing.value = false;
      }
    },
    reject:      () => {
      finalizing.value = false;

    },
    onHide:      () => {
      finalizing.value = false;

    }

  })
}
</script>

<style scoped lang="scss">
</style>
