<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->
<template lang="pug">
  div.flex.mr-4
    i.mr-1.mb-2(class="pi pi-circle-fill" :style="style")
    span {{label}}: {{value}}
</template>
<script>

export default {
  name:  "PropertyCountLabel",
  components: {},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    label: {
      type: String,
      default:()=> {
        return '';
      }
    },
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: ()=> {
        return '#000000';
      }
    }
  },
  data      : function () {
    return {}
  },
  computed  : {
    style() {
      return `color: ${this.color}`;
    }
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
