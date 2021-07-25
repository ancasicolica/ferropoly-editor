<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-basic
    h1 panel-basic
    b-form-input(v-model="organisatorName")
    b-form-input(v-model="organisation")
    p {{organisatorName}}
    p {{organisation}}
</template>

<script>

export default {
  name      : 'panel-basic',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
    console.log(this.$store.state.gameplay.owner);
    this.$store.dispatch({type: 'fetchData', gameId: 'roomy-patch'});
  },
  computed  : {
    organisatorName: {
      get() {
        return this.$store.state.gameplay.owner.organisatorName;
      },
      set(val) {
        this.$store.commit('updateOrganisatorName', val);
      }
    },
    organisation: {
      get() {
        return this.$store.state.gameplay.owner.organisation;
      },
      set(val) {
        this.$store.commit('updateOrganisation', val);
      }
    }
  },
  methods   : {

  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
