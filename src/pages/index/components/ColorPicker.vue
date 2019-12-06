<template>
    <el-color-picker
            class="btn-text can-hover"
            :value="value"
            :predefine="predefine"
            size="small"
            @change="set"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ColorPicker',
  data () {
    return {
      predefine: [
        '#c41832', // 中环红
        '#f67e2a',
        '#f2be45',
        '#789262',
        '#409EFF', // 饿了么蓝
        '#0078D7', // 微软蓝
        '#4a4266' // 黛
      ]
    }
  },
  computed: {
    ...mapState('oj/color', [
      'value'
    ])
  },
  watch: {
    value (value) {
      this.set(value)
    }
  },
  methods: {
    ...mapActions('oj/color', [
      'set'
    ])
  }
}
</script>
