<!---
  Account Info for Googlers
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.06.2024
-->
<template lang="pug">
  ferro-card(title="Login mit Google")
    .account-info-title Google Profil ID
    | {{getElement('id')}}
    .account-info-title Email-Adresse
    | {{getElement('email')}}
    .account-info-title Avatar
    img.avatar(:src="getElement('avatar')")


</template>
<script>

import {get} from 'lodash';
import FerroCard from './FerroCard.vue';
export default {
  name      : 'AccountGoogle',
  components: {FerroCard},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    info: {
      type: Object, default: () => {
        return {};
      }
    }
  },
  data      : function () {
    return {};
  },
  methods   : {
    getElement: function (e, def) {
      console.log(this.info);
      let d = def || '';
      return get(this.info, e, d);
    }
  }
}

</script>


<style scoped lang="scss">
.account-info-title {
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 4px;
}
</style>
