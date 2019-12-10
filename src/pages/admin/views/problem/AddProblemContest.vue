<template>
    <div>
        <el-input
    </div>
</template>

<script>
export default {
  name: 'AddProblemContest',
  props: ['contestID'],
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      problems: [],
      contest: {},
      keyword: ''
    }
  }
}
</script>

<style scoped>

</style>
