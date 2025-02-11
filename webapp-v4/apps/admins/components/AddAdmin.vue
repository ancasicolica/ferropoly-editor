<!---
  Adds an admin, if there are not already too much of them
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.02.2025
-->

<template>
  <ferro-card class="mr-2 ml-2" title="Spielleiter*in hinzufügen">
    <Toast position="center"/>
    <Form @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
      <FormField v-slot="$field" :validate-on-submit="true" :resolver="emailResolver" class="field">
        <label for="username">Email-Adresse</label>
        <InputText id="username" class="w-full" v-model="newAdmin" aria-describedby="username-help"/>
        <Message size="small" severity="secondary" variant="simple">Muss dieselbe Email-Adresse sein, mit der sich die
          Person einloggt. Die Person wird nicht benachrichtigt.
        </Message>
        <Message v-if="$field?.invalid" severity="error">Bitte gültige Email-Adresse eingeben.</Message>
        <Button :disabled="submitDisabled($field?.invalid)" type="submit" severity="primary" class="mt-2"
                label="Submit"/>
      </FormField>
    </Form>
  </ferro-card>
</template>

<script setup>

import Button from 'primevue/button';
import Toast from 'primevue/toast';
import {Form, FormField} from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import {useAdminStore} from '../store/adminStore';
import {computed, ref} from 'vue';

const adminStore = useAdminStore();
import {z} from 'zod';
import {zodResolver} from '@primevue/forms/resolvers/zod';
import FerroCard from '../../../common/components/FerroCard.vue';
import {useToast} from 'primevue/usetoast';

const toast = useToast();

const emailResolver = zodResolver(
    z.string().email().min(5).max(50)
)
const newAdmin      = ref('')

const nbOfAdmins = computed(() => {
  return adminStore.adminList.length;
})

const submitDisabled = function (resolverInvalid) {
  if (resolverInvalid) {
    return true;
  }
  if (newAdmin.value.length < 5) {
    return true;
  }
  return nbOfAdmins.value > 2;
}

const onFormSubmit = async () => {
  const result = await adminStore.addAdmin(newAdmin.value);
  if (result.success) {
    newAdmin.value = '';
  } else {
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
