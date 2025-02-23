<!---
  Editor help about place holders
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.02.2025
-->

<template>
  <div>
    <h3>Platzhalter</h3>
    <p>Die Platzhalter werden beim Generieren der Spielregeln durch die Werte aus den Spieleigenschaften automatisch
      gesetzt. Es wird empfohlen, diese Platzhalter zu verenden und diese nicht durch eigenen Text zu ersetzen.</p>
    <div class="mb-3">Folgende Platzhalter sind definiert:</div>
    <div v-for="p in placeholders" v-bind:key="p.tag" class="mb-2">
      <span>&#123;&#123; {{ p.tag }} &#125;&#125;</span>
      <span>: {{ p.description }}</span>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

import ph from '../../../../../editor/lib/rulesTranslation.json';

const placeholders = ref(ph);
console.log(placeholders.value);
</script>

<style scoped lang="scss">

</style>
