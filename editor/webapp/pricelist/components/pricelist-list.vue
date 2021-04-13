<!---
  The core price list for the editor. I doubt that this can be used else where as the
  vue bootstrap table covers quite a lot
-->
<template lang="pug">
  #pricelist-list
    b-table(striped small :items="pricelist" :fields="fields" responsive="sm")
      template(#cell(pricelist.position)="data") {{data.item.pricelist.position + 1}}
      template(#cell(pricelist.price)="data") {{data.item.pricelist.price | amount}}
      template(#cell(pricelist.pricePerHouse)="data") {{data.item.pricelist.pricePerHouse | amount}}
      template(#cell(pricelist.rents.noHouse)="data") {{data.item.pricelist.rents.noHouse | amount}}
      template(#cell(pricelist.rents.oneHouse)="data") {{data.item.pricelist.rents.oneHouse | amount}}
      template(#cell(pricelist.rents.twoHouses)="data") {{data.item.pricelist.rents.twoHouses | amount}}
      template(#cell(pricelist.rents.threeHouses)="data") {{data.item.pricelist.rents.threeHouses | amount}}
      template(#cell(pricelist.rents.fourHouses)="data") {{data.item.pricelist.rents.fourHouses | amount}}
      template(#cell(pricelist.rents.hotel)="data") {{data.item.pricelist.rents.hotel | amount}}
</template>

<script>
import {isNumber} from 'lodash';

export default {
  name      : "pricelist-list",
  props     : ['pricelist'],
  data      : function () {
    return {
      fields: [
        {key: 'pricelist.position', label: 'Pos'},
        {key: 'location.name', label: 'Ort'},
        {key: 'pricelist.propertyGroup', label: 'Gruppe'},
        {key: 'pricelist.price', label: 'Kaufpreis'},
        {key: 'pricelist.pricePerHouse', label: 'Hauspreis'},
        {key: 'pricelist.rents.noHouse', label: 'Miete'},
        {key: 'pricelist.rents.oneHouse', label: 'Miete 1H'},
        {key: 'pricelist.rents.twoHouses', label: 'Miete 1H'},
        {key: 'pricelist.rents.threeHouses', label: 'Miete 1H'},
        {key: 'pricelist.rents.fourHouses', label: 'Miete 1H'},
        {key: 'pricelist.rents.hotel', label: 'Miete 1H'},
      ]
    };
  },
  model     : {},
  methods   : {},
  components: {},
  filters   : {
    amount: function (val) {
      if (isNumber(val)) {
        return val.toLocaleString('de-CH');
      }
      return val;
    }
  }
}
</script>

<style scoped>

</style>
