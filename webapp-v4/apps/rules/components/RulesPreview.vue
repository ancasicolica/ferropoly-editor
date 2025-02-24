<!---
  Preview of the rules
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.02.2025
-->

<template>
  <div v-html="rulesStore.text"></div>
</template>

<script setup>

import {useRulesStore} from '../store/RulesStore';

const rulesStore = useRulesStore();

</script>

<style scoped lang="scss">

</style>
