<!---
  The root component of the account app
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.06.2024
-->
<template>
  <div>
    <menu-bar :elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/general/3-0/account/"
              show-user-box />
    <div class="ferropoly-container">
      <div class="flex flex-col md:flex-row gap-2">
        <div :class="columnClass">
          <account-general :info="getElement('personalData', {})" :avatarUrl="avatarUrl" />
        </div>
        <div v-if="showGoogle" :class="columnClass">
          <account-google :info="getElement('google', {})" />
        </div>
        <div v-if="showMicrosoft" :class="columnClass">
          <account-microsoft :info="getElement('microsoft', {})" />
        </div>
      </div>
      <panel v-if="!dataValid" header="Fehler" lead="Benutzerdaten konnten nicht geladen werden:">
        <h2> Die Benutzerdaten konnten nicht gelesen werden</h2>
        <p> {{ errorMessage }}</p>
        <prime-button @click="goToMain()" label="Zurück zur Hauptseite" />
      </panel>
    </div>
  </div>
</template>

<script setup>
import MenuBar from '../../common/components/MenuBar.vue'
import AccountGoogle from './AccountGoogle.vue';
import AccountMicrosoft from './AccountMicrosoft.vue';
import AccountGeneral from './AccountGeneral.vue';
import {get} from 'lodash';
import {getUserInfo} from '../adapters/userInfo';

import PrimeButton from 'primevue/button';
import Panel from 'primevue/panel';
import {computed, onBeforeMount, ref} from 'vue';

const menuBarElements = ref([]);
const userInfo        = ref({});
const avatarUrl       = ref('');
const dataValid       = ref(true);
const errorMessage    = ref('');

const showGoogle    = computed(() => {
  return get(userInfo.value, 'google.valid', false);
})
const showMicrosoft = computed(() => {
  return get(userInfo.value, 'microsoft.valid', false);
})

// Compute the number of visible columns
const visibleColumns = computed(() => {
  let count = 1; // AccountGeneral is always visible
  if (showGoogle.value) {
    count++;
  }
  if (showMicrosoft.value) {
    count++;
  }
  return count;
})

// Compute the CSS class based on number of visible columns
const columnClass = computed(() => {
  if (visibleColumns.value === 1) {
    return 'w-full';
  }
  if (visibleColumns.value === 2) {
    return 'w-full md:w-1/2';
  }
  return 'w-full md:w-1/3';
})

onBeforeMount(() => {
  getUserInfo((err, info) => {
    if (err) {
      console.error('Error while reading user info', err);
      errorMessage.value = `Status: ${err.status}, Status-Text: ${err.statusText}`;
      dataValid.value    = false;
      return;
    }
    avatarUrl.value = get(info, 'personalData.avatar', '');
    console.log('avatar', avatarUrl.value, info);
    if (avatarUrl.value.length === 0) {
      avatarUrl.value = get(info, 'personalData.generatedAvatar', '');
    }

    userInfo.value = info;
    console.log(info);
  })
})

const getElement = function (e, def) {
  let d = def || '';
  return get(userInfo.value, e, d);
}

const goToMain = function () {
  window.location.href = '/'
}


</script>


<style scoped lang="scss">

</style>
