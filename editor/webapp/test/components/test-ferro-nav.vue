<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 16.01.22
-->
<template lang="pug">
  div
    h1 Ferropoly Navigation
    ferro-nav(:elements="navBar1" @nav1-event="onNav1Event")
    h2(v-if="navBar1[0].active") NAV 1
    p(v-if="navBar1Panel==='1'") Also with navBar1Panel: 1
    h2(v-if="navBar1[1].active") NAV 2
    p(v-if="navBar1Panel==='2'") Also with navBar1Panel: 2
    h2(v-if="navBar1[2].active") NAV 3
    p(v-if="navBar1Panel==='3'") Also with navBar1Panel: 3




</template>

<script>
import FerroNav from '../../common/components/ferro-nav/ferro-nav.vue';

export default {
  name      : 'TestFerroNav',
  components: {FerroNav},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      navBar1: [
        {title: 'Element 1', event: 'nav1-event', eventParam: '1', active: true},
        {title: 'Element 2', event: 'nav1-event', eventParam: '2', active: false},
        {title: 'Element 3', event: 'nav1-event', eventParam: '3', active: false},
      ],
      navBar1Panel : '1'
    };
  },
  computed  : {},
  created   : function () {
  },
  methods   : {
    onNav1Event(p) {
      this.navBar1Panel = p;
      console.log('Event', p)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
