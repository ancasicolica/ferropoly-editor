<!---
  The Editor page for the rules
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 15.02.2025
-->

<template>
<Editor v-model="rulesStore.raw"></Editor>
</template>

<script setup>


import Editor from 'primevue/editor';
import {useRulesStore} from '../store/RulesStore';

const rulesStore = useRulesStore();
</script>

<style scoped lang="scss">

</style>
