<!---
  Card with the rent factors
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.12.2024
-->
<template lang="pug">
  ferro-card(title="Faktoren Mietpreise")
    div.mb-3 Mit den Faktoren in diesem Abschnitt wird der Ertrag pro Stunde (bzw. die Miete wenn eine andere Gruppe das Ort besucht) bestimmt. Im Normalfall sind keine Anpassungen nötig, die Standardwerte haben sich bewährt.

    label.mt-4(for="no") Unbebaut
    prime-slider#no.mt-2(v-model="rentFactorNoHouse" float :min="min" :max="rentFactorOneHouse" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{rentFactorNoHouse}}

    label.mt-8(for="one") Ein Haus
    prime-slider#one.mt-2(v-model="rentFactorOneHouse" float :min="rentFactorNoHouse" :max="rentFactorTwoHouses" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{rentFactorOneHouse}}

    label.mt-8(for="two") Zwei Häuser
    prime-slider#two.mt-2(v-model="rentFactorTwoHouses" float :min="rentFactorOneHouse" :max="rentFactorThreeHouses" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{rentFactorTwoHouses}}

    label.mt-8(for="three") Drei Häuser
    prime-slider#three.mt-2(v-model="rentFactorThreeHouses" float :min="rentFactorTwoHouses" :max="rentFactorFourHouses" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{rentFactorThreeHouses}}

    label.mt-8(for="four") Vier Häuser
    prime-slider#four.mt-2(v-model="rentFactorFourHouses" float :min="rentFactorThreeHouses" :max="rentFactorHotel" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{rentFactorFourHouses}}

    label.mt-8(for="five") Hotel
    prime-slider#five.mt-2(v-model="rentFactorHotel" float :min="rentFactorFourHouses" :max="max" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2 {{rentFactorHotel}}


</template>
<script>

import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import FerroCard from '../../../../common/components/FerroCard.vue';

import PrimeSlider from 'primevue/slider';

export default {
  name:       'RentFactorSettings',
  components: {FerroCard, PrimeSlider},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      min: 0.1,
      max: 10,
      step: 0.1
    }
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams: 'gameParams'
    }),
    rentFactorNoHouse: {
      get() {
        return this.gameParams.rentFactors.noHouse;
      },
      set(value) {
        this.gameParams.rentFactors.noHouse = value;
      }
    },
    rentFactorOneHouse: {
      get() {
        return this.gameParams.rentFactors.oneHouse;
      },
      set(value) {
        this.gameParams.rentFactors.oneHouse = value;
      }
    },
    rentFactorTwoHouses: {
      get() {
        return this.gameParams.rentFactors.twoHouses;
      },
      set(value) {
        this.gameParams.rentFactors.twoHouses = value;
      }
    },
    rentFactorThreeHouses: {
      get() {
        return this.gameParams.rentFactors.threeHouses;
      },
      set(value) {
        this.gameParams.rentFactors.threeHouses = value;
      }
    },
    rentFactorFourHouses: {
      get() {
        return this.gameParams.rentFactors.fourHouses;
      },
      set(value) {
        this.gameParams.rentFactors.fourHouses = value;
      }
    },
    rentFactorHotel: {
      get() {
        return this.gameParams.rentFactors.hotel;
      },
      set(value) {
        this.gameParams.rentFactors.hotel = value;
      }
    },
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
