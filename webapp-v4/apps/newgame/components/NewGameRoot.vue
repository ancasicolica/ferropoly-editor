<!---
  Root element of a new game creation
  Author: Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  File: New game setup component
  Created: 23.06.2024
-->
<template>
  <div>
    <menu-bar :elements="newGameStore.menuBarElements"></menu-bar>
    <stepper value="1" linear>
      <step-list>
        <step value="1">Spielname</step>
        <step value="2">Spieltag</step>
        <step value="3">Karte</step>
        <step value="4">Preisliste</step>
        <step value="5">Abschluss</step>
      </step-list>
      <step-panels>
        <step-panel v-slot="{activateCallback}" value="1">
          <div class="block">
            <card>
              <template #content>
                <new-game-name></new-game-name>
              </template>
            </card>
          </div>
          <div class="flex pt-6 justify-end">
            <prime-button label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('2')"
                          iconPos="right"></prime-button>
          </div>
        </step-panel>
        <step-panel v-slot="{activateCallback}" value="2">
          <div class="block">
            <card>
              <template #content>
                <new-game-date></new-game-date>
              </template>
            </card>
          </div>
          <div class="flex pt-6 justify-between">
            <prime-button label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('1')"
                          severity="secondary"></prime-button>
            <prime-button v-if="!newGameStore.importedDataAvailable"
                   label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('3')"
                          iconPos="right"></prime-button>
            <prime-button v-if="newGameStore.importedDataAvailable"
                   label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('5')"
                          iconPos="right"></prime-button>
          </div>
        </step-panel>
        <step-panel v-slot="{activateCallback}" value="3">
          <div class="block">
            <card>
              <template #content>
                <new-game-map></new-game-map>
              </template>
            </card>
          </div>
          <div class="flex pt-6 justify-between">
            <prime-button label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('2')"
                          severity="secondary"></prime-button>
            <prime-button label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('4')"
                          iconPos="right"></prime-button>
          </div>
        </step-panel>
        <step-panel v-slot="{activateCallback}" value="4">
          <div class="block">
            <card>
              <template #content>
                <new-game-pricelist></new-game-pricelist>
              </template>
            </card>
          </div>
          <div class="flex pt-6 justify-between">
            <prime-button label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('3')"
                          severity="secondary"></prime-button>
            <prime-button label="Weiter" icon="pi pi-arrow-right" @click="activateCallback('5')"
                          iconPos="right"></prime-button>
          </div>
        </step-panel>
        <step-panel v-slot="{activateCallback}" value="5">
          <div class="block">
            <!-- Centered spinner area taking ~70% of viewport height -->
            <div class="spinner-area" v-if="gameCreationActive">
              <div class="spinner-center">
                <progress-spinner />
              </div>
            </div>

            <div v-if="!gameCreationActive">
              <card>
                <template #content>
                  <new-game-create></new-game-create>
                </template>
              </card>
            </div>
            <Message severity="error" v-if="errorMessage.length > 0">{{errorMessage}}</Message>
          </div>
          <div class="flex pt-6 justify-between">
            <prime-button v-if="!newGameStore.importedDataAvailable"
                          label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('4')"
                          severity="secondary"></prime-button>
            <prime-button v-if="newGameStore.importedDataAvailable"
                          label="Zurück" icon="pi pi-arrow-left" @click="activateCallback('2')"
                          severity="secondary"></prime-button>
            <prime-button label="Spiel anlegen" @click="createGame"
                          :disabled="gameCreationActive || proposedGameNameInvalid"></prime-button>
          </div>
        </step-panel>

      </step-panels>
    </stepper>
  </div>

</template>

<script setup>
import MenuBar from '../../../common/components/MenuBar.vue'
import {useNewGameStore} from '../store/newGameStore';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import PrimeButton from 'primevue/button';
import Message from 'primevue/message';
import NewGameMap from './NewGameMap.vue';
import NewGameName from './NewGameName.vue';
import NewGameDate from './NewGameDate.vue';
import NewGamePricelist from './NewGamePricelist.vue';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import NewGameCreate from './NewGameCreate.vue';
import {computed, ref} from 'vue';
import {get} from 'lodash';

const newGameStore       = useNewGameStore();
const gameCreationActive = ref(false);
const errorMessage = ref('');

const proposedGameNameInvalid = computed(() => {
  return !newGameStore.proposedGameNameValid;
})

/**
 * Initiates the process of creating a new game. The method handles checking the game ID,
 * creating the game if the ID is valid, and navigating to the game editing page if the
 * game creation is successful. It also ensures proper handling of errors during the process.
 *
 * @return {void} Does not return a value. Handles game creation and navigation tasks internally.
 */
const createGame = function() {
  console.log('Game creation process initiated.');
  errorMessage.value = '';
  gameCreationActive.value = true;
  const newGameStore      = useNewGameStore();
  newGameStore.checkId()
      .then(result => {
        console.log('OK', result);
        if (result) {
          newGameStore.createGame()
              .then(gamename => {
                console.log('New game created:', gamename);
                if (gamename) {
                  window.location.href = `/gameplay/edit/${gamename}`;
                }
              })
              .catch(err => {
                console.error('Error while creating a new game', err);
                errorMessage.value = get(err, 'response.data.message', 'Fehler beim Anlegen des Spiels');
              })
              .finally(() => {
                gameCreationActive.value = false;
              })
        } else {
          gameCreationActive.value = false;
        }
      })
      .catch(function (error) {
        console.error('Did not work', error);
        gameCreationActive.value = false;
      });
}
</script>


<style scoped lang="scss">
/* Center a spinner within a 70vh tall area */
.spinner-area {
  /* Use ~70% of viewport height */
  min-height: 50vh;
  /* Create a flex container to center content */
  display: flex;
  align-items: center;   /* vertical centering */
  justify-content: center; /* horizontal centering */
}

/* Optional: in case you want an inner wrapper for additional styling later */
.spinner-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
