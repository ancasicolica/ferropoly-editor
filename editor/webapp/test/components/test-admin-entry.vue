<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
#test-admin-entry
  h1 Admin Eintrag Editor
  admin-entry(title="Admin 1" :entry="admins[0]")
  admin-entry(title="Admin 2" :entry="admins[1]")
  admin-entry(title="Admin 3" :entry="admins[2]")
  admin-entry(title="Admin 3" :entry="admins[3]")

</template>

<script>

import AdminEntry from '../../admins/components/admin-entry.vue'

export default {
  name      : 'test-admin-entry',
  props     : {},
  data      : function () {
    return {
      admins: [{email: 'annina@kusti.ch', hasLogin: false},
               {email: 'silvan@kusti.ch', hasLogin: true},
               {email: 'linus@kusti.ch'},
               {email: ''}
      ]
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {AdminEntry},
  filters   : {}
}
</script>

<style scoped>

</style>
