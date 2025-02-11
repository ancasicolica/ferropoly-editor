<!---
  One single entry of the admin list
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.02.2025
-->

<template>
  <div class="flex flex-row" v-if="validEntry">
    <div class="entry">{{ admin?.email }}</div>
    <i class="pi pi-check member controls" v-if="validLogin" v-tooltip="'Das Login dieser Person ist vorhanden'"></i>
    <i class="pi pi-times-circle not-member controls" v-if="!validLogin"
       v-tooltip="'Diese Person hat noch kein Login'"></i>
    <i class="pi pi-trash controls" v-tooltip="'Diese Person aus der Spielleitung entfernen'" @click="onDelete"></i>
  </div>
</template>

<script setup>
const emit = defineEmits(['delete'])
import {computed} from 'vue';

const props = defineProps({
  admin: {
    type:     Object,
    required: true,
    default:  () => {
      return {
        email:    '',
        hasLogin: undefined
      };
    }
  }
})

const onDelete = function () {
  emit('delete', props.admin?.email);
}

const validEntry = computed(() => {
  return props.admin && props.admin.email && props.admin.email.length > 0;
})

const validLogin = computed(() => {
  return props.admin && props.admin.hasLogin;
})
</script>

<style scoped lang="scss">
.entry {
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 5px;
  width: 80%;
  background-color: rgb(240, 238, 240);
  margin-bottom: 8px;
}

.not-member {
  color: red;
}

.member {
  color: green;
}

.controls {
  margin-right: 4px;
  margin-left: 8px;
  margin-top: 4px;
}
</style>
