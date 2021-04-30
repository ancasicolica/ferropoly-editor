<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.04.21
-->
<template lang="pug">
  #test-menu-bar
    b-row
      b-col
        h1 Menu Bar Tests
        h2 Test 1
        p Normale Einträge, kein Login
    b-row
      b-col
        menu-bar(:elements="menuBar1Elements"
          show-user-box=false
          help-url="https://www.ferropoly.ch/"
          @bar1-event="onBar1Event")
    b-row
      b-col
        p Event-Daten: {{bar1EventData}}
        h2 Test 2
        p Normale Einträge, mit Login
    b-row
      b-col
        menu-bar(:elements="menuBar2Elements"
          show-user-box=true
          help-url="https://www.ferropoly.ch/"
          @bar2-event="onBar2Event")
    b-row
      b-col
        p Event-Daten: {{bar2EventData}}

</template>

<script>
import MenuBar from "../../common/components/menu-bar/menu-bar.vue";

export default {
  name      : "test-menu-bar",
  props     : {},
  data      : function () {
    return {
      menuBar1Elements: [
        {title: 'Nummer 1', href: '#', event: 'bar1-event', eventParam: '1'},
        {title: 'Nummer 2', href: '#', event: 'bar1-event', eventParam: '2'},
        {title: 'Nummer 3', href: '#', event: 'bar1-event', eventParam: '3'},
        {title: 'Nummer 4', href: '#', event: 'bar1-event', eventParam: '4'},
        {title: 'Nummer 5', href: '#', event: 'bar1-event', eventParam: '5'}
      ],
      bar1EventData : 'keine',
      menuBar2Elements: [
        {title: 'Nummer 1', href: '#', event: 'bar2-event', eventParam: 'bar2-1'},
        {title: 'Nummer 2', href: '#', event: 'bar2-event', eventParam: 'bar2-2'},
        {title: 'Nummer 3', href: '#', event: 'bar2-event', eventParam: 'bar2-3'},
        {title: 'Nummer 4', href: '#', event: 'bar2-event', eventParam: 'bar2-4'},
        {title: 'Nummer 5', href: '#', event: 'bar2-event', eventParam: 'bar2-5'}
      ],
      bar2EventData : 'keine'
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    onBar1Event(data) {
      this.bar1EventData = data;
    },
    onBar2Event(data) {
      this.bar2EventData = data;
    }
  },
  components: {MenuBar},
  filters   : {}
}
</script>

<style scoped>

</style>
