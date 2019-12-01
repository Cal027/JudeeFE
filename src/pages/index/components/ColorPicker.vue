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
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
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
