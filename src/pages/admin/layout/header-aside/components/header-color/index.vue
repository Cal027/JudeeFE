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
        '#81A1C1', // 北极水
        '#BF616A', // 极光红
        '#D08770', // 极光橙
        '#EBCB8B', // 极光黄
        '#B48EAD', // 极光紫
        '#409EFF', // 饿了么蓝
        '#0078D7' // 微软蓝
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
