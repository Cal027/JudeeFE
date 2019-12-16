<template>
    <div>
        <el-card v-for="(r,index) in results" :key="index" v-html="r"/>
    </div>
</template>

<script>
import contestAPI from '@oj/api/oj.contest'

export default {
  name: 'ContestAnnouncement',
  data () {
    return {
      loading: false,
      announcements: [],
      contestID: null
    }
  },
  methods: {
    getAnnouncement () {
      this.loading = true
      contestAPI.getContestAnnouncement(this.contestID).then(res => {
        this.announcements = res.results
        this.loading = false
      })
    }
  },
  mounted () {
    console.log('xxx')
    this.contestID = this.$route.params.contestID
    this.getAnnouncement()
  }
}

</script>

<style scoped>

</style>
