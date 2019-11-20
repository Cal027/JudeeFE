<template>
  <el-card>
    <center>
      <h2>欢迎来到代码库</h2>
      <h3>你可以选择你要查看的代码库或者编辑自己的代码库</h3>
    </center>
    <br>
    选择一个版本 或
    <el-button type="primary" style="margin-left:15px;" @click="edit">编辑自己的代码</el-button>
    <el-table :data="tableData" @cell-click="userclick">
      <el-table-column type="index"/>
      <el-table-column :width="200" prop="username" label="User"/>
      <el-table-column :width="200" prop="des" label="Des"/>
      <el-table-column prop="time" label="Last Edit Time"/>
    </el-table>
  </el-card>
</template>

<script>
import moment from 'moment'
export default {
    name: 'Mbcode',
    data () {
        return {
            tableData: []
        }
    },
    created () {
        this.$axios
            .get('/mbcode/')
            .then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    response.data[i].time = moment(response.data[i].time).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                }
                this.tableData = response.data
            })
            .catch(error => {
                this.$message.error(
                    '服务器错误！' + '(' + JSON.stringify(error.response.data) + ')'
                )
            })
    },
    methods: {
        edit () {
            this.$router.push({
                name: 'codeedit'
            })
        },
        userclick: function (row, column, cell, event) {
            this.$router.push({
                name: 'viewcode',
                params: { username: row.username }
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
