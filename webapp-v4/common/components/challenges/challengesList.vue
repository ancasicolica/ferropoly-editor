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
      <button v-for="(challenge, index) in displayedChallenges" :key="challenge._id ?? index"
              type="button" class="challenge-select"
              :class="{selected: challengesStore.currentChallenge === challenge}"
              :aria-pressed="challengesStore.currentChallenge === challenge"
              @click="challengesStore.currentChallenge = challenge">
        <challenges-list-entry :challenge="challenge" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {useChallengesStore} from '../../store/challengesStore';
import {computed, ref} from 'vue';
import ChallengesListEntry from './challengesListEntry.vue';

const challengesStore = useChallengesStore();
const sortByStart     = ref(true);

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

.challenge-select {
  display: block;
  width: 100%;
  padding: 0 0.75rem;
  border: 0;
  background: transparent;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.challenge-select:hover, .challenge-select.selected {
  background: var(--p-primary-50, #eff6ff);
}

.challenge-select:focus-visible {
  outline: 2px solid var(--p-primary-color, #3b82f6);
  outline-offset: -2px;
}
</style>
