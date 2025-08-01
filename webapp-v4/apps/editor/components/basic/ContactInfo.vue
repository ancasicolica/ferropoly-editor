<!---
  Form for contact infos
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div>
    <ferro-card title="Allgemeines">
      <ferropoly-input-text v-model="gamename" label="Spielname" info="Das ist der Titel für die Preisliste"
                            :zod-result="gamenameValidation"></ferropoly-input-text>
      <ferropoly-input-text
          v-model="organisatorName" label="Name Organisator*in" info="Dieser Name erscheint auf der Preisliste."
          :zod-result="organisatorNameValidation"></ferropoly-input-text>
      <ferropoly-input-text
          v-model="organisation" label="Veranstaltende Organisation"
          info="Der Name der Organisation erscheint in der Ausschreibung und auf der Preisliste. Die Eingabe ist optional."
          :zod-result="organisationValidation">

      </ferropoly-input-text>
      <ferropoly-input-text
          v-model="organisatorEmail" label="Email-Adresse"
          info="Gib die Email-Adresse an, unter welcher die Teams Infos zum Spiel erhalten können."
          :zod-result="organisatorEmailValidation">

      </ferropoly-input-text>
      <ferropoly-input-text
          v-model="organisatorPhone" label="Telefonnummer während dem Spiel"
          info="Unter dieser Nummer erreichen die Teams während dem Spiel die Zentrale."
          :zod-result="organisatorPhonelValidation">

      </ferropoly-input-text>
    </ferro-card>
  </div>

</template>
<script>

import FerroCard from '../../../../common/components/FerroCard.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import FerropolyInputText from '../../../../common/components/FerropolyInputText.vue';

export default {
  name: 'ContactInfo',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: {FerropolyInputText, FerroCard},
  data:       function () {
    return {}
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      owner:                       'owner',
      organisatorNameValidation:   'organisatorNameValidation',
      gamenameValidation:          'gamenameValidation',
      organisationValidation:      'organisationValidation',
      organisatorPhonelValidation: 'organisatorPhonelValidation',
      organisatorEmailValidation:  'organisatorEmailValidation',
      gamename:                    'gamename'
    }),
    organisation:     {
      get: function () {
        return this.owner.organisation
      },
      set: function (value) {
        this.owner.organisation = value;
      }
    },
    organisatorName:  {
      get: function () {
        return this.owner.organisatorName
      },
      set: function (value) {
        this.owner.organisatorName = value;
      }
    },
    organisatorEmail: {
      get: function () {
        return this.owner.organisatorEmail
      },
      set: function (value) {
        this.owner.organisatorEmail = value;
      }
    },
    organisatorPhone: {
      get: function () {
        return this.owner.organisatorPhone
      },
      set: function (value) {
        this.owner.organisatorPhone = value;
      }
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
