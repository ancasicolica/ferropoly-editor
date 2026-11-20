<!---
  A Single entry in the challenges List
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.11.2026
-->

<template>
  <div class="challenge-entry">
    <div class="challenge-title">{{ challenge.title }}</div>
    <div v-if="challenge.schedule?.start" class="challenge-time">
      {{ formatGameTime(challenge.schedule.start) }} –
      {{ formatGameTime(challenge.schedule?.end) }}
    </div>
    <div v-if="status" class="challenge-status">
      <i class="pi pi-exclamation-triangle" aria-hidden="true"></i> {{ status }}
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {formatGameTime} from '../../lib/formatters';
import {challengeSchema} from '../../schemas/ChallengeSchema';
import {useChallengesStore} from '../../store/challengesStore';

const props = defineProps({
  challenge: {
    type:     Object,
    required: true,
  },
});

const challengesStore = useChallengesStore();
const status = computed(() => {
  if (!challengeSchema.safeParse(props.challenge).success) return 'Ungültige Daten – nicht gespeichert';
  return challengesStore.isChallengeUnsaved(props.challenge) ? 'Noch nicht gespeichert' : '';
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

.challenge-status {
  color: #dc2626;
}
</style>
