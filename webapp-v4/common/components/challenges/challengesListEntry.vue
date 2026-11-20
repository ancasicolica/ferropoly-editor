<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.11.2026
-->

<template>
  <div class="challenge-entry">
    <div class="challenge-title">{{ challenge.title }}</div>
    <div v-if="challenge.schedule?.start">
      <div class="challenge-time">{{ formatGameTime(challenge.schedule?.start) }} –
        {{ formatGameTime(challenge.schedule?.end) }}
      </div>
    </div>
    <div v-else>
      Noch nicht gespeichert
    </div>
  </div>
</template>

<script setup>
import {formatGameTime} from '../../lib/formatters';

defineProps({
  challenge: {
    type:     Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.challenge-entry {
  padding: 0.75rem 0;
  border-bottom: 1px solid #d1d5db;
}

.challenge-title {
  font-weight: 600;
  overflow-wrap: anywhere;
}

.challenge-time {
  color: #6b7280;
}
</style>
