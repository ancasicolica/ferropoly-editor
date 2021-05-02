<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-info
    b-list-group-item.d-flex.d-flex-row(@click="onClick" href="#")
      b-avatar(:src="player.login.personalData.avatar" size="60px")
      div.pl-2
        h5 {{player.data.name}}
        div {{player.data.organization}} ({{player.data.teamLeader.name}})


</template>

<script>
export default {
  name      : 'player-info',
  props     : {
    player : Object,
    default: {
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
  computed  : {},
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
