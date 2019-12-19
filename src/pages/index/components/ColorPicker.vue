<template>
    <el-color-picker
            :value="value"
            :predefine="predefine"
            size="mini"
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
