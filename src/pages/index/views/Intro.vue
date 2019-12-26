<template>
    <el-row>
        <el-tabs type="border-card">
            <el-tab-pane :label="label.des">
                <description/>
            </el-tab-pane>
            <el-tab-pane :label="label.faq" :lazy="true">
                <FAQ/>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<script>
import FAQ from '@oj/components/Introduction/FAQ'
import Description from '@oj/components/Introduction/Description'

export default {
  name: 'Intro',
  components: {
    Description,
    FAQ
  },
  data () {
    return {
      label: {
        faq: 'FAQ',
        des: '介绍'
      }
    }
  }
}
</script>

<style scoped>
    .el-row {
        width: 95%;
        margin: 0 auto;
    }

</style>
