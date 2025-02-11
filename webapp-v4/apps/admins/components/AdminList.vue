<!---
  List with all admins
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.02.2025
-->

<template>
  <ferro-card class="mr-2 ml-2" title="Spielleiter*innen Liste">
    <Toast position="center"/>
    <div v-if="!emptyList">
      <admin-list-entry v-for="admin in admins" :key="admin" :admin="admin"
                        @delete="onDelete"></admin-list-entry>
    </div>
    <div v-if="emptyList">Bisher sind keine Spielleiter*innen registriert.</div>
  </ferro-card>
</template>

<script setup>
import {useAdminStore} from '../store/adminStore';
import {computed} from 'vue';
import Toast from 'primevue/toast';
import AdminListEntry from './AdminListEntry.vue';
import FerroCard from '../../../common/components/FerroCard.vue';
import {useToast} from 'primevue/usetoast';

const toast      = useToast();
const adminStore = useAdminStore();
const admins     = computed(() => {
  return adminStore.adminList;
})

const emptyList = computed(() => {
  return adminStore.adminList.length === 0;
})

const onDelete = async function (email) {
  const result = await adminStore.deleteAdmin(email);
  if (!result.success) {
    toast.add({
      severity: 'error',
      summary:  'Fehler',
      detail:   result.message,
      life:     6000
    });
  }
}
</script>

<style scoped lang="scss">

</style>
