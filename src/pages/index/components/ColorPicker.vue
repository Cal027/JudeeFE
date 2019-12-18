<template>
    <el-color-picker
            :value="value"
            :predefine="predefine"
            size="mini"
            style="filter:opacity(0)"
            @change="set"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// class="btn-text can-hover"
export default {
  name: 'ColorPicker',
  data () {
    return {
      predefine: [
        '#446B84', // 默认
        '#c41832', // 中环红
        '#f67e2a',
        '#f2be45',
        '#789262',
        '#409EFF', // 饿了么蓝
        '#0078D7' // 微软蓝
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
