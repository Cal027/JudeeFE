<template>
  <el-row>
    <el-tabs type="border-card">
      <el-tab-pane :label="label.des">
        <description/>
      </el-tab-pane>
      <el-tab-pane :label="label.rule" :lazy="true">
        <ratingrule/>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import ratingrule from '@oj/components/ratingrule'
import description from '@oj/components/description'

export default {
  name: 'Intro',
  components: {
    ratingrule,
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
