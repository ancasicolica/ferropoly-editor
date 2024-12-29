<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.12.2024
-->
<template lang="pug">
  h2 Vorschau
  div Das günstigste und das teuerste Ort der Preisliste werden folgende Werte haben:
  data-table(:value="list")
    column(field="type" header="")
    column(field="price" header="Kaufpreis")
      template(#body="{ data }")
       span {{ formatCurrency(data.price) }}
    column(field="housePrice" header="Hauspreis")
      template(#body="{ data }")
        span {{ formatCurrency(data.housePrice) }}
    column(field="rent0H" header="Miete unbebaut")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent0H) }}
    column(field="rent1H" header="Miete 1 H.")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent1H) }}
    column(field="rent2H" header="Miete 2 H.")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent2H) }}
    column(field="rent3H" header="Miete 3 H.")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent3H) }}
    column(field="rent4H" header="Miete 4 H.")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent4H) }}
    column(field="rent5H" header="Miete Hotel")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent5H) }}
    column(field="rent5HD" header="Alle Orte in Ortsgruppe: Miete Hotel")
      template(#body="{ data }")
        span {{ formatCurrency(data.rent5HD) }}
  div.mt-3 Wenn die Gruppe in jeder Spielrunde Häuser baut, dann lohnt sich der Kauf eines Ortes {{breakEven}}
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import {formatPrice} from '../../../../common/lib/formatters';

export default {
  name:       'RentPreview',
  components: {DataTable, Column},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {}
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams: 'gameParams'
    }),
    list() {
      return [
        {
          type:       'Günstigstes Ort',
          price:      this.gameParams.properties.lowestPrice,
          housePrice: this.gameParams.properties.lowestPrice * this.gameParams.housePrices,
          rent0H:     this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.noHouse,
          rent1H:     this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.oneHouse,
          rent2H:     this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.twoHouses,
          rent3H:     this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.threeHouses,
          rent4H:     this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.fourHouses,
          rent5H:     this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.hotel,
          rent5HD:    this.gameParams.properties.lowestPrice * this.gameParams.rentFactors.hotel * this.gameParams.rentFactors.allPropertiesOfGroup,
        },
        {
          type:       'Teuerstes Ort',
          price:      this.gameParams.properties.highestPrice,
          housePrice: this.gameParams.properties.highestPrice * this.gameParams.housePrices,
          rent0H:     this.gameParams.properties.highestPrice * this.gameParams.rentFactors.noHouse,
          rent1H:     this.gameParams.properties.highestPrice * this.gameParams.rentFactors.oneHouse,
          rent2H:     this.gameParams.properties.highestPrice * this.gameParams.rentFactors.twoHouses,
          rent3H:     this.gameParams.properties.highestPrice * this.gameParams.rentFactors.threeHouses,
          rent4H:     this.gameParams.properties.highestPrice * this.gameParams.rentFactors.fourHouses,
          rent5H:     this.gameParams.properties.highestPrice * this.gameParams.rentFactors.hotel,
          rent5HD:    this.gameParams.properties.highestPrice * this.gameParams.rentFactors.hotel * this.gameParams.rentFactors.allPropertiesOfGroup,
        }
      ]
    },
    breakEven() {
      let resLowest = this.calculateBreakEven(this.gameParams.properties.lowestPrice);
      let infoText = '';
      switch (resLowest.houses) {
        case 0:
          infoText = 'unmittelbar nach dem Kauf des Hauses. ';
          break;
        case 1:
          infoText = 'nach dem Kauf des ersten Hauses. ';
          break;
        case 2:
          infoText = 'nach dem Kauf des zweiten Hauses. ';
          break;
        case 3:
          infoText = 'erst nach dem Kauf des dritten Hauses. ';
          break;
        case 4:
          infoText = 'erst nach dem Kauf des vierten Hauses. ';
          break;
        case 5:
          infoText = 'erst nach dem Kauf des Hotels. ';
          break;
        default:
          infoText = 'gar nie! ';
          break;
      }
      let resHighest = this.calculateBreakEven(this.gameParams.properties.highestPrice);
      infoText += `Der Gewinn beträgt dann beim günstigsten Ort ${formatPrice(resLowest.profit)}, beim teuersten Ort ${formatPrice(resHighest.profit)}.`
      if (resHighest.houses !== resLowest.houses) {
        console.warn('Data not consistent', resLowest, resHighest);
      }
      return infoText;
    }
  },
  created:    function () {
  },
  methods:    {
    formatCurrency(value) {
      return formatPrice(value);
    },
    calculateBreakEven(propertyCost) {
      let costs = propertyCost;
      const housePrice = propertyCost * this.gameParams.housePrices;
      let earnings = 0;
      // First round
      earnings = propertyCost * this.gameParams.rentFactors.noHouse;
      if (earnings > costs) {
        return { houses: 0, profit: earnings - costs};
      }
      // Second round
      costs += housePrice;
      earnings += propertyCost * this.gameParams.rentFactors.oneHouse;
      if (earnings > costs) {
        return { houses: 1, profit: earnings - costs};
      }
      // Third round
      costs += housePrice;
      earnings += propertyCost * this.gameParams.rentFactors.twoHouses;
      if (earnings > costs) {
        return { houses: 2, profit: earnings - costs};
      }
      // Fourth round
      costs += housePrice;
      earnings += propertyCost * this.gameParams.rentFactors.threeHouses;
      if (earnings > costs) {
        return { houses: 3, profit: earnings - costs};
      }
      // fifth round
      costs += housePrice;
      earnings += propertyCost * this.gameParams.rentFactors.fourHouses;
      if (earnings > costs) {
        return { houses: 4, profit: earnings - costs};
      }
      // sixth round
      costs += housePrice;
      earnings += propertyCost * this.gameParams.rentFactors.hotel;
      if (earnings > costs) {
        return { houses: 5, profit: earnings - costs};
      }



      return {houses: 99, profit: earnings - costs};
    }
  }
}

</script>


<style scoped lang="scss">

</style>
