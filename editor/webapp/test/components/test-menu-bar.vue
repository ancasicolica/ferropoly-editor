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
        p Normale Einträge, kein Login, mit "Active" Element
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
        h2 Test 3
        p Online Zustand
    b-row
      b-col
        menu-bar(:elements="menuBar2Elements"
          show-user-box=true
          help-url="https://www.ferropoly.ch/"
          showOnlineStatus=true
          :online="online")
    b-row
      b-col
        b-form-checkbox(v-model="online") Online status
</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue';

export default {
  name      : 'TestMenuBar',
  components: {MenuBar},
  filters   : {},
  model     : {},
  props     : {},
  data      : function () {
    return {
      menuBar1Elements: [
        // Is important to set all active items, even false. Otherwise binding does not work
        // as exoected!
        {title: 'Nummer 1', href: '#', event: 'bar1-event', eventParam: '1', active: false},
        {title: 'Nummer 2', href: '#', event: 'bar1-event', eventParam: '2', active: false},
        {title: 'Nummer 3', href: '#', event: 'bar1-event', eventParam: '3', active: true},
        {title: 'Nummer 4', href: '#', event: 'bar1-event', eventParam: '4', active: false},
        {title: 'Nummer 5', href: '#', event: 'bar1-event', eventParam: '5', active: false}
      ],
      bar1EventData   : 'keine',
      menuBar2Elements: [
        {title: 'Nummer 1', href: '#', event: 'bar2-event', eventParam: 'bar2-1'},
        {title: 'Nummer 2', href: '#', event: 'bar2-event', eventParam: 'bar2-2'},
        {title: 'Nummer 3', href: '#', event: 'bar2-event', eventParam: 'bar2-3'},
        {title: 'Nummer 4', href: '#', event: 'bar2-event', eventParam: 'bar2-4'},
        {title: 'Nummer 5', href: '#', event: 'bar2-event', eventParam: 'bar2-5'}
      ],
      bar2EventData   : 'keine',
      online          : false
    };
  },
  computed  : {},
  created   : function () {
  },
  methods   : {
    onBar1Event(data) {
      this.bar1EventData = data;
      this.menuBar1Elements.forEach(e => {
        console.log('active', e, e.eventParam, data);
        e.active = (e.eventParam === data);
      });
    },
    onBar2Event(data) {
      this.bar2EventData = data;
    }
  }
}
</script>

<style scoped>

</style>
