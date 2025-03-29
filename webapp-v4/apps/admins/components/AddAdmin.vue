<!---
  Adds an admin, if there are not already too much of them
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.02.2025
-->

<template>
  <ferro-card class="mr-2 ml-2" title="Spielleiter*in hinzufügen">
    <Toast position="center"/>
    <div v-if="newAdminAllowed">
      <Form :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56" :validate-on-submit="true"
            ref="formRef">
        <FormField v-slot="$field" name="username" initial-value="" class="field">
          <label for="username">Email-Adresse</label>
          <InputText id="username" class="w-full" aria-describedby="username-help" placeholder="Login Email-Adresse"/>
          <Message size="small" severity="secondary" variant="simple">Muss dieselbe Email-Adresse sein, mit der sich die
            Person einloggt. Die Person wird nicht benachrichtigt.
          </Message>
          <Message v-if="$field?.invalid" severity="error">{{ $field.error?.message }}</Message>
          <Button type="submit" severity="primary" class="mt-2"
                  label="Hinzufügen"/>
        </FormField>
      </Form>
    </div>
    <div v-if="!newAdminAllowed">Es sind maximal drei weitere Spielleiter*innen möglich.</div>
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

const resolver = zodResolver(
    z.object({
      username: z.string()
                    .email({message: 'Bitte gültige Email-Adresse eingeben.'})
                    .min(6, {message: 'Mindestlänge ist 7 Zeichen.'})
                    .max(50, {message: 'Maximallänge ist 50 Zeichen.'})
    })
)

const nbOfAdmins = computed(() => {
  return adminStore.adminList.length;
})

const newAdminAllowed = computed(() => {
  return adminStore.adminList.length < 3;
})

const formRef = ref(null); // Reference to the form

const onFormSubmit = async ({valid, values}) => {
  if (valid) {
    const result = await adminStore.addAdmin(values.username);
    if (result.success) {
      if (formRef.value) {
        formRef.value.reset(); // Resets the entire form
      }
    } else {
      toast.add({
        severity: 'error',
        summary:  'Fehler',
        detail:   result.message,
        life:     6000
      });
    }
  }
}
</script>

<style scoped lang="scss">


</style>
