<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-info
    b-card(:title="player.data.name"
      :sub-title="getSubTitle"
      :img-src="player.login.personalData.avatar"
      img-left
      img-height="80"
      img-width="80"
      bg-variant="light"
      class="mb-2"
      style="max-width: 25rem;"
      @click="onClick")


</template>

<script>
export default {
  name      : 'player-info',
  props     : {
    player: Object, default: {
      data : {
        confirmed   : false, // They're joining the party!
        name        : '',
        organization: '',
        teamLeader  : {
          name: ''
        },
        remarks     : '',
      },
      login: {
        personalData: {
          avatar: ''
        }
      }
    }

  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
    console.log(this.player);
  },
  computed  : {
    getSubTitle() {
      return `${this.player.data.organization} (${this.player.data.teamLeader.name})`;
    }
  },
  methods   : {
    onClick() {
      this.$emit('click', this.player);
    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
