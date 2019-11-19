<template>
  <el-row>
    <el-tabs type="border-card">
      <el-tab-pane :label="label.des">
        <description></description>
      </el-tab-pane>
      <el-tab-pane :label="label.rule" :lazy="true">
        <ratingrule></ratingrule>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
    import ratingrule from "@/components/utils/ratingrule";
    import description from "@/components/utils/description";

    export default {
        components: {
            ratingrule,
            description
        },
        name: "Intro",
        data() {
            return {
                label: {
                    rule: "规则",
                    des: "介绍"
                },
            };
        }
    };
</script>

<style scoped>
  .el-row {
    margin-bottom: 12px;
  }

</style>
