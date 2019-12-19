<template>
    <div class="container">

    </div>
</template>

<script>
export default {
  name: 'ContestRank',
  data () {
    return {
      type: ''
    }
  },
  mounted () {
    this.type = this.$route.params.type
    console.log(this.type)
  }
}

</script>

<style scoped>
    .container {
        margin: 0 auto;
        max-width: 720px;
    }
</style>
