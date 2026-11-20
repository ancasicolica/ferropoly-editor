<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.11.2026
-->

<template>
  <div class="challenges-list-content">
    <label class="sort-option">
      <input v-model="sortByStart" type="checkbox" /> Nach Startzeit sortieren
    </label>
    <div class="challenge-entries">
      <challenges-list-entry v-for="(challenge, index) in displayedChallenges" :key="challenge._id ?? index"
                             :challenge="challenge" />
    </div>
  </div>
</template>

<script setup>
import {useChallengesStore} from '../../store/challengesStore';
import {computed, ref} from 'vue';
import ChallengesListEntry from './challengesListEntry.vue';

const challengesStore = useChallengesStore();
const sortByStart     = ref(false);

const displayedChallenges = computed(() => {
  if (!sortByStart.value) {
    return challengesStore.challenges;
  }
  const startTime = challenge => {
    const start = challenge.schedule?.start;
    const time  = start ? new Date(start).getTime() : NaN;
    return Number.isNaN(time) ? Infinity : time;
  };
  return [...challengesStore.challenges].sort((a, b) => startTime(a) - startTime(b));
});
</script>

<style scoped lang="scss">
.challenges-list-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.sort-option {
  flex-shrink: 0;
  padding-bottom: 0.5rem;
}

.challenge-entries {
  min-height: 0;
  overflow-y: auto;
}
</style>
