<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.04.21
-->
<template lang="pug">
  #test-modal-info-yes-no
    modal-info-yes-no(ref="info1" size="sm" @yes="onAccept" @no="onDeny")
    modal-info-yes-no(ref="info2" @yes="onAccept" @no="onDeny")
    modal-info-yes-no(ref="info3" size="xl" @yes="onAccept" @no="onDeny")
    b-row
      b-col
        h1 Modal Info Yes-No Tests
    b-row
      b-col
        p Zeigt einen Info-Dialog mit HTML, in sm und benutzt Callbacks (-> Console)
      b-col
        b-button(@click="test1") Test 1
    b-row
      b-col
        p Zeigt einen Info-Dialog ohne message (default: md)
      b-col
        b-button(@click="test2") Test 2
    b-row
      b-col
        p Zeigt einen Info-Dialog in XL Format
      b-col
        b-button(@click="test3") Test 3
    b-row
      b-col
        h3 Resultat
    b-row
      b-col
        p {{result}}

</template>

<script>
import ModalInfoYesNo from '../../common/components/modal-info-yes-no/modal-info-yes-no.vue'
import {getText} from '../fixtures/lorem';

export default {
  name      : "test-modal-info-yes-no",
  props     : {},
  data      : function () {
    return {
      result: 'n/a'
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    test1() {
      let x = 1;
      this.result= 'n/a';
      this.$refs.info1.showDialog({
        title  : 'Titelzeile SM',
        info   : 'Dies ist ein Text mit HTML</br>Dieser Text sollte auf einer neuen Zeile stehen',
        message: 'Das ist eine <em>zusätzliche</em> Information',
        callback: function(val) {
          console.log(`x is ${x} and val is ${val}`);
        }
      });
    },
    test2() {
      this.result= 'n/a';
      this.$refs.info2.showDialog({
        title: 'Titelzeile',
        info : 'Dieser Dialog hat <i>keine</i> weitere Nachricht'
      });
    },
    test3() {
      this.result= 'n/a';
      this.$refs.info3.showDialog({
        title  : 'Titelzeile XL',
        info   : 'Dies ist ein XL Dialog',
        message: getText(500)
      });
    },
    onAccept() {
      this.result= 'YES';
    },
    onDeny() {
      this.result= 'NO';
    }
  },
  components: {ModalInfoYesNo},
  filters   : {}
}
</script>

<style scoped>

</style>
