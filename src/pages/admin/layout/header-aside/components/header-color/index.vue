<template>
  <el-color-picker
    class="btn-text can-hover"
    :value="value"
    :predefine="predefine"
    size="mini"
    @change="set"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'd2-header-color',
  data () {
    return {
      predefine: [
        '#c41832', // 中环
        '#f67e2a', // 北角
        '#f2be45', // 赤金
        '#789262', // 竹青
        '#409EFF', // element蓝
        '#0078D7', // 微软蓝
        '#4a4266' // 黛
      ]
    }
  },
  computed: {
    ...mapState('d2admin/color', [
      'value'
    ])
  },
  watch: {
    value (value) {
      this.set(value)
    }
  },
  methods: {
    ...mapActions('d2admin/color', [
      'set'
    ])
  }
}
</script>
