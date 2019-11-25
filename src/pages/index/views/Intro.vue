<template>
  <el-row>
    <el-tabs type="border-card">
      <el-tab-pane :label="label.des">
        <description/>
      </el-tab-pane>
      <el-tab-pane :label="label.rule" :lazy="true">
        <ratingRule/>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import ratingRule from '@oj/components/RatingRule'
import description from '@oj/components/Description'

export default {
  name: 'Intro',
  components: {
    ratingRule,
    description
  },
  data () {
    return {
      label: {
        rule: '规则',
        des: '介绍'
      }
    }
  }
}
</script>

<style scoped>
    .el-row {
        margin-bottom: 12px;
    }

</style>
