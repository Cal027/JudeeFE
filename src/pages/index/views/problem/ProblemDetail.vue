<template>

</template>

<script>
export default {
  name: 'ProblemDetail',
  data () {
    return {
      problemDetail: {}
    }
  },
  methods: {
    getProblem (id) {
      this.$api.problem.getProblem(id)
        .then(response => {
          this.problemDetail = response.data
        })
    }
  },
  mounted () {
    if (this.$route.params.problemDetail && this.$route.params.problemDetail.ID === this.$route.params.id) {
      this.problemDetail = this.$route.params.problemDetail
    } else {
      this.getProblem(this.$route.params.id)
    }
  }

}
</script>

<style scoped>

</style>
