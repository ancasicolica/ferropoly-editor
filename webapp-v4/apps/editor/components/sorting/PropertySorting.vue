<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.12.2024
-->
<template lang="pug">
  h1 Range {{range}}
  div(v-for="p in properties") {{p.location.name}}
</template>
<script>

import {number} from 'zod';
import {useEditorPropertiesStore} from '../../../../lib/store/EditorPropertiesStore';

export default {
  name:       'PropertySorting',
  components: {},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {
    range: {
      type:    String,
      default: ()=> {
        return '0';
      }
    }
  },
  data:       function () {
    return {

    }
  },
  computed:   {
    properties() {
      return useEditorPropertiesStore().getPropertiesOfRange(parseInt(this.range));
    }
  },
  created:    function () {
    console.log('created', this.range);
  },
  mounted() {
    console.log('mounted', this.range);
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
