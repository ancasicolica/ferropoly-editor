<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.11.2026
-->

<template>
  <div v-if="challenge" class="challenge-editor">
    <header class="editor-header">
      <h2>Challenge bearbeiten</h2>
    </header>

    <section class="editor-section" aria-labelledby="challenge-details">
      <h3 id="challenge-details">Aufgabe</h3>
      <div class="field">
        <label for="challenge-title">Titel</label>
        <InputText id="challenge-title" v-model="challenge.title" fluid placeholder="Titel der Challenge"
                   :invalid="!!fieldError('title')" aria-describedby="challenge-title-error" />
        <Message v-if="fieldError('title')" id="challenge-title-error" severity="error" size="small" variant="simple">{{ fieldError('title') }}</Message>
      </div>
      <div class="field description-field">
        <label id="challenge-description-label">Beschreibung</label>
        <div role="group" aria-labelledby="challenge-description-label"
             :class="{'invalid-description': !!fieldError('description')}">
          <QuillEditor :key="challenge._id ?? challengesStore.challenges.indexOf(challenge)"
                       v-model="challenge.description" placeholder="Was müssen die Teams tun?"
                       :toolbar="descriptionToolbar" />
        </div>
        <Message v-if="fieldError('description')" severity="error" size="small" variant="simple">{{ fieldError('description') }}</Message>
      </div>
    </section>

    <div class="options-grid">
      <section class="editor-section" aria-labelledby="challenge-schedule">
        <h3 id="challenge-schedule">Zeitraum</h3>
        <div class="field-grid">
          <div class="field">
            <label for="challenge-start">Beginn</label>
            <DatePicker input-id="challenge-start" v-model="start" time-only show-icon
                        hour-format="24" fluid :disabled="!challengesStore.gameDate" :invalid="!!fieldError('schedule.start')" />
            <Message v-if="fieldError('schedule.start')" severity="error" size="small" variant="simple">{{ fieldError('schedule.start') }}</Message>
          </div>
          <div class="field">
            <label for="challenge-end">Ende</label>
            <DatePicker input-id="challenge-end" v-model="end" time-only show-icon
                        hour-format="24" fluid :disabled="!challengesStore.gameDate" :invalid="!!fieldError('schedule.end')" />
            <Message v-if="fieldError('schedule.end')" severity="error" size="small" variant="simple">{{ fieldError('schedule.end') }}</Message>
          </div>
        </div>
      </section>

      <section class="editor-section" aria-labelledby="challenge-proof">
        <h3 id="challenge-proof">Nachweis</h3>
        <div class="proof-options">
          <div class="proof-option">
            <Checkbox v-model="challenge.proof.picture" input-id="proof-picture" binary :invalid="!!fieldError('proof.picture')" />
            <label for="proof-picture">Foto</label>
          </div>
          <div class="proof-option">
            <Checkbox v-model="challenge.proof.call" input-id="proof-call" binary :invalid="!!fieldError('proof.call')" />
            <label for="proof-call">Anruf</label>
          </div>
          <div class="proof-option">
            <Checkbox v-model="challenge.proof.text" input-id="proof-text" binary :invalid="!!fieldError('proof.text')" />
            <label for="proof-text">Text</label>
          </div>
        </div>
        <template v-for="key in ['picture', 'call', 'text']" :key="key">
          <Message v-if="fieldError(`proof.${key}`)" severity="error" size="small" variant="simple">{{ fieldError(`proof.${key}`) }}</Message>
        </template>
        <Message v-if="fieldError('proof')" severity="error" size="small" variant="simple">{{ fieldError('proof') }}</Message>
      </section>

      <section class="editor-section" aria-labelledby="challenge-reward">
        <h3 id="challenge-reward">Belohnung</h3>
        <div class="reward-option">
          <Checkbox :model-value="fixedReward" input-id="reward-fixed" binary @update:model-value="setFixedReward" />
          <label for="reward-fixed">Fixer Betrag</label>
        </div>
        <div class="field-grid" :class="{'fixed-reward': fixedReward}">
          <div v-if="!fixedReward" class="field">
            <label for="reward-min">Minimum</label>
            <InputNumber v-model="challenge.reward.min" input-id="reward-min" :min="0" :max-fraction-digits="0"
                         locale="de-CH" fluid :invalid="!!fieldError('reward.min')" />
            <Message v-if="fieldError('reward.min')" severity="error" size="small" variant="simple">{{ fieldError('reward.min') }}</Message>
          </div>
          <div class="field">
            <label for="reward-max">{{ fixedReward ? 'Betrag' : 'Maximum' }}</label>
            <InputNumber v-model="rewardAmount" input-id="reward-max" :min="0" :max-fraction-digits="0"
                         locale="de-CH" fluid :invalid="!!fieldError('reward.max') || (fixedReward && !!fieldError('reward.min'))" />
            <Message v-if="fieldError('reward.max')" severity="error" size="small" variant="simple">{{ fieldError('reward.max') }}</Message>
            <Message v-if="fixedReward && fieldError('reward.min')" severity="error" size="small" variant="simple">{{ fieldError('reward.min') }}</Message>
          </div>
        </div>
      </section>
    </div>

    <footer class="challenge-meta">
      <span>ID: {{ challenge._id ?? 'Noch nicht gespeichert' }}</span>
      <span>Spiel-ID: {{ challenge.gameId || '–' }}</span>
      <span>Erstellt: {{ formatDateTime(challenge.createdAt) || '–' }}</span>
      <span>Aktualisiert: {{ formatDateTime(challenge.updatedAt) || '–' }}</span>
    </footer>
    <template v-for="key in ['_id', 'gameId', 'createdAt', 'updatedAt', 'schedule', 'reward']" :key="key">
      <Message v-if="fieldError(key)" severity="error" size="small" variant="simple">{{ fieldError(key) }}</Message>
    </template>
    <div class="editor-actions">
      <Button label="Speichern" icon="pi pi-save" :loading="saving" :disabled="!challengesStore.gameDate || !validation.success || saving || deleting"
              @click="saveChallenge" />
      <Button v-if="canDelete" label="Löschen" icon="pi pi-trash" severity="danger" :loading="deleting"
              :disabled="saving || deleting" @click="confirmDelete" />
    </div>
  </div>
  <div v-else class="empty-state">Wähle eine Challenge aus oder erstelle eine neue.</div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useChallengesStore} from '../../store/challengesStore';
import {formatDateTime} from '../../lib/formatters';
import QuillEditor from '../QuillEditor.vue';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Message from 'primevue/message';
import {useToast} from 'primevue/usetoast';
import {useConfirm} from 'primevue/useconfirm';
import {challengeSchema} from '../../schemas/ChallengeSchema';
import {onGameDate, defaultChallengeTime} from '../../lib/challengeSchedule';

const challengesStore = useChallengesStore();
const challenge = computed(() => challengesStore.currentChallenge);
const fixedReward = ref(false);
watch(challenge, value => {
  fixedReward.value = !!value && value.reward.min === value.reward.max;
}, {immediate: true});
const rewardAmount = computed({
  get: () => challenge.value?.reward.max,
  set: value => {
    challenge.value.reward.max = value;
    if (fixedReward.value) challenge.value.reward.min = value;
  }
});
const setFixedReward = value => {
  fixedReward.value = value;
  if (value) challenge.value.reward.min = challenge.value.reward.max;
};
const toast = useToast();
const confirm = useConfirm();
const saving = ref(false);
const deleting = ref(false);
const now = ref(Date.now());
let clock;
onMounted(() => { clock = setInterval(() => { now.value = Date.now(); }, 1000); });
onUnmounted(() => clearInterval(clock));
const canDelete = computed(() => {
  if (!challenge.value) return false;
  if (!challenge.value._id) return true;
  const start = new Date(challenge.value.schedule?.start).getTime();
  return Number.isFinite(start) && now.value < start;
});
const validation = computed(() => challengeSchema.safeParse(challenge.value));
const fieldError = path => validation.value.success ? '' :
  validation.value.error.issues.find(issue => issue.path.join('.') === path)?.message || '';
const descriptionToolbar = [
  ['bold', 'italic', 'underline'],
  [{list: 'ordered'}, {list: 'bullet'}],
  ['link', 'clean']
];

const saveChallenge = async () => {
  if (saving.value || deleting.value || !challengesStore.gameDate || !validation.value.success) return;
  saving.value = true;
  try {
    await challengesStore.saveCurrentChallenge();
    toast.add({severity: 'success', summary: 'Challenge gespeichert', life: 3000});
  } catch (err) {
    toast.add({severity: 'error', summary: 'Speichern fehlgeschlagen',
      detail: err.response?.data?.message || err.message, life: 5000});
  } finally {
    saving.value = false;
  }
};

const deleteChallenge = async target => {
  if (saving.value || deleting.value || challenge.value !== target || !canDelete.value) return;
  deleting.value = true;
  try {
    await challengesStore.deleteCurrentChallenge();
    toast.add({severity: 'success', summary: 'Challenge gelöscht', life: 3000});
  } catch (err) {
    toast.add({severity: 'error', summary: 'Löschen fehlgeschlagen',
      detail: err.response?.data?.message || err.message, life: 5000});
  } finally {
    deleting.value = false;
  }
};

const confirmDelete = () => {
  if (!canDelete.value || saving.value || deleting.value) return;
  const target = challenge.value;
  confirm.require({
    message: `Soll die Challenge "${target.title}" wirklich gelöscht werden?`,
    header: 'Challenge löschen',
    rejectProps: {label: 'Abbrechen', severity: 'secondary'},
    acceptProps: {label: 'Löschen', severity: 'danger'},
    accept: () => deleteChallenge(target)
  });
};

const dateField = key => computed({
  get: () => {
    const value = challenge.value?.schedule?.[key];
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  },
  set: value => {
    if (!challenge.value) return;
    const schedule = challenge.value.schedule;
    schedule[key] = onGameDate(challengesStore.gameDate, value);
    const other = key === 'start' ? 'end' : 'start';
    if (schedule[key] && !schedule[other]) {
      schedule[other] = defaultChallengeTime(challengesStore.gameDate, schedule[key],
        key === 'start' ? 60 : -60, challengesStore.gameStart, challengesStore.gameEnd);
    }
  }
});

const start = dateField('start');
const end = dateField('end');
</script>

<style scoped lang="scss">
.challenge-editor {
  height: 100%;
  overflow-y: auto;
  padding: 0 1rem 1rem 0;
}

.editor-header {
  margin-bottom: 0.5rem;

  h2 { margin: 0; font-size: 1.25rem; }
}

.editor-section {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;

  h3 { margin: 0 0 0.5rem; font-size: 1rem; }
}

.options-grid {
  display: grid;
  //grid-template-columns: minmax(20rem, 2fr) minmax(9rem, 1fr) minmax(17rem, 1.5fr);
  grid-template-columns: minmax(14rem, 1fr) minmax(14rem, 1fr) minmax(17rem, 1fr);
  gap: 0.5rem;

  .editor-section { margin-bottom: 0; }
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  &.fixed-reward { grid-template-columns: 1fr; }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  margin-bottom: 0.5rem;

  &:last-child { margin-bottom: 0; }
}

.challenge-editor .description-field :deep(.ql-editor) {
  min-height: 100px;
  max-height: 130px;
  overflow-y: auto;
}

.description-field :deep(.ql-toolbar) { padding: 4px; }
.invalid-description { outline: 1px solid var(--p-form-field-invalid-border-color); }

.proof-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.proof-option, .reward-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.reward-option { margin-bottom: 0.5rem; }

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.challenge-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  padding: 0.5rem 0;
  color: #6b7280;
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}

@media (max-width: 1100px) {
  .options-grid { grid-template-columns: 1fr; }
}

.empty-state {
  padding: 2rem;
  color: #6b7280;
  text-align: center;
}
</style>
