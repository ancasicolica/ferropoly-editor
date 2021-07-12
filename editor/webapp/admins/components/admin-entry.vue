<!---
  A single admin entry with the email-address
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
#admin-entry
  b-row.my-1
    b-col(sm="4")
      label {{title}}
    b-col(sm="7")
      b-form-input(type="email"
        v-model="entry.email"
        :state="emailState"
        aria-describedby="input-mail-feedback")
      b-form-invalid-feedback(id="input-mail-feedback") Eine gültige Email-Adresse ist notwendig

    b-col(sm="1")
      span.ok(v-if="entry.hasLogin" title="Ferropoly Login vorhanden - alles ok" v-b-tooltip.hover)
        b-icon-check-circle
      span.error(v-if="entry.hasLogin === false && entry.email.length > 0"  title="Noch kein Ferropoly Login vorhanden" v-b-tooltip.hover)
        b-icon-exclamation-circle

</template>

<script>

import {checkEmail} from '../../common/lib/playerValidator'
import {BIconCheckCircle, BIconExclamationCircle} from 'bootstrap-vue';

export default {
  name      : 'admin-entry',
  props     : {
    title: {
      type   : String,
      default: 'Admin'
    },
    entry: {
      type   : Object,
      default: function () {
        return {email: '', hasLogin: undefined}
      }
    },

  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    emailState() {
      if (this.entry.email.length < 3) {
        return null;
      }
      return checkEmail(this.entry.email);
    }
  },
  methods   : {},
  components: {BIconCheckCircle, BIconExclamationCircle},
  filters   : {}
}
</script>

<style scoped>
.ok {
  color: green;
}

.error {
  color: red;
}
</style>
