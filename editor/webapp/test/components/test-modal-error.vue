<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.04.21
-->
<template lang="pug">
  #test-modal-error
    modal-error(ref="err1")
    modal-error(ref="err2" size="xl")
    b-row
      b-col
        h1 Modal Error Tests
    b-row
      b-col
        p Zeigt einen Error-Dialog mit HTML
      b-col
        b-button(@click="test1") Test 1
    b-row
      b-col
        p Zeigt einen Error-Dialog ohne message
      b-col
        b-button(@click="test2") Test 2
    b-row
      b-col
        p Zeigt einen Error-Dialog in XL Format
      b-col
        b-button(@click="test3") Test 3

</template>

<script>
import ModalError from '../../common/components/modal-error/modal-error.vue'
import {getText} from '../fixtures/lorem';

export default {
  name      : "test-modal-error",
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    test1() {
      this.$refs.err1.showDialog({
        title  : 'Titelzeile',
        info   : 'Dies ist ein Text mit HTML</br>Dieser Text sollte auf einer neuen Zeile stehen',
        message: 'Das ist eine <b>zusätzliche</b> Information'
      });
    },
    test2() {
      this.$refs.err1.showDialog({
        title: 'Titelzeile',
        info : 'Dieser Dialog hat <i>keine</i> weitere Nachricht'
      });
    },
    test3() {
      this.$refs.err2.showDialog({
        title  : 'Titelzeile',
        info   : 'Dies ist ein XL Dialog',
        message: getText(500)
      });
    }
  },
  components: {ModalError},
  filters   : {}
}
</script>

<style scoped>

</style>
