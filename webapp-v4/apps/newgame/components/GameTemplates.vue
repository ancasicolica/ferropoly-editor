<!---
  Data table with the templates
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 18.11.2026
-->

<template>
  <div>
    <p>Du kannst auch aus einem der vergangenen Spiele die Karte importieren:</p>
    <DataTable :value="newGameStore.templates" removableSort paginator :rows="12" tableStyle="min-width: 50rem">
      <Column field="stats.map" header="Karte" sortable>
        <template #body="slotProps">
          {{ formatMap(slotProps.data.stats.map) }}
        </template>
      </Column>
      <Column field="stats.propertyCount" header="Anz. Orte" sortable />
      <Column field="createdBy" header="Author" sortable />
      <Column field="gameDate" header="Spieldatum" sortable>
        <template #body="slotProps">
          {{ formatGameDate(slotProps.data.gameDate) }}
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <Button variant="outlined" @click="onLoadData(slotProps.data._id)">Spieldaten laden</Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {useNewGameStore} from '../store/newGameStore';
import {formatGameDate, formatMap} from '../../../common/lib/formatters';
import Button from 'primevue/button';
import axios from 'axios';
import {GameplayImporter} from '../../../common/lib/GameplayImporter';

const newGameStore = useNewGameStore();

const onLoadData = async function (id) {
  console.log('loading game with id', id);
  const resp = await axios.get(`/templates/${id}`);
  console.log('loaded', resp.data);
  const gi = new GameplayImporter();
  const mapData = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(resp.data.mapData), char => char.charCodeAt(0))));

  gi.loadData(JSON.stringify(mapData))
      .then(info => {
        newGameStore.importData = info;
        //   errorMessage.value      = gi.error;
      })
      .catch(err => {
        console.error(err, gi);
        //    errorMessage.value      = err;
        newGameStore.importData = null;
      })
}
</script>

<style scoped lang="scss">

</style>
