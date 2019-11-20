<template>
  <el-card v-loading="exporting" element-loading-text="导出中...">
    <h2>{{ username + "的代码库" }}</h2>
    <p>选择要查看的代码</p>

    <el-autocomplete
      v-model="group"
      :fetch-suggestions="queryGroup"
      placeholder="请输入分组来筛选题目"
      style="width:300px;"
      @keyup.native.enter="search"
      @select="search"
    >
      <el-button slot="append" icon="el-icon-search" @click="search"/>
    </el-autocomplete>

    <el-autocomplete
      v-model="title"
      :fetch-suggestions="queryTitle"
      placeholder="请输入标题来筛选题目"
      style="margin-left:30px;width:300px;"
      @keyup.native.enter="search"
      @select="search"
    >
      <el-button slot="append" icon="el-icon-search" @click="search"/>
    </el-autocomplete>
    <el-button style="float:right;" type="primary" @click="dialogVisible = true">导出</el-button>

    <el-table
      :data="tableData"
      :default-sort="{prop: 'group', order: 'descending'}"
      @cell-click="userclick"
    >
      <el-table-column type="index"/>
      <el-table-column :width="200" prop="username" label="User"/>
      <el-table-column prop="group" label="Group"/>
      <el-table-column prop="title" label="Title">
        <template slot-scope="scope">
          <el-popover :width="500" trigger="hover" placement="top">
            <p>Des: {{ scope.row.des }}</p>
            <div slot="reference" class="name-wrapper">
              <b>{{ scope.row.title }}</b>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="Time"/>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="提示" width="50%">
      <span>将会导出为MarkDown格式</span>
      <span>
        转换教程如下：<br>
        先将导出的MD文件转换为html格式
        <a href="https://cloudconvert.com/md-to-html" target="_blank">在线转换</a>
      </span>
      <p>然后再用浏览器打开</p>
      <p>浏览器打开后对着网页右键，选择打印，然后就可以打印成PDF或者直接打印了！</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="exportdata">导出</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="exportdialogVisible" title="请选择要导出的模块和顺序" width="45%">
      <el-transfer
        v-model="exportlist"
        :data="codedata"
        :titles="['可导出的分组', '已选择的分组']"
        :button-texts="['删除', '添加']"
        target-order="push"
        fliterable
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="goexport">导出</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import moment from 'moment'
export default {
    name: 'Mbcodedetail',
    data () {
        return {
            username: this.$route.params.username,
            group: '',
            title: '',
            tableData: [],
            titles: [],
            groups: [],
            exporting: false,
            dialogVisible: false,
            exportdialogVisible: false,
            context: '',
            codedata: [],
            exportlist: [],
            realdata: {}
        }
    },
    created () {
        this.$axios
            .get(
                '/mbcodedetailnocode/?username=' +
          this.username +
          '&group=' +
          this.group +
          '&title=' +
          this.title
            )
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
        uniq (array) {
            var temp = [] // 一个新的临时数组
            for (var i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) === -1) {
                    temp.push(array[i])
                }
            }
            return temp
        },
        queryGroup (queryString, cb) {
            this.groups = []
            this.$axios
                .get('/mbcodedetailnocode/?username=' + this.username)
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.groups.push(response.data[i].group)
                    }

                    this.groups = this.uniq(this.groups)
                    var groups = this.groups
                    var results = queryString
                        ? groups.filter(this.createStateFilter(queryString))
                        : groups
                    var res = []
                    for (let i = 0; i < results.length; i++) { res.push({ value: results[i] }) }
                    cb(res)
                })
                .catch(error => {
                    this.$message.error(
                        '服务器错误！' + '(' + JSON.stringify(error.response.data) + ')'
                    )
                })
        },
        queryTitle (queryString, cb) {
            this.titles = []
            this.$axios
                .get(
                    '/mbcodedetailnocode/?username=' +
            this.username +
            '&group=' +
            this.group
                )
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.titles.push(response.data[i].title)
                    }

                    this.titles = this.uniq(this.titles)
                    var titles = this.titles
                    var results = queryString
                        ? titles.filter(this.createStateFilter(queryString))
                        : titles
                    var res = []
                    for (let i = 0; i < results.length; i++) { res.push({ value: results[i] }) }
                    cb(res)
                })
                .catch(error => {
                    this.$message.error(
                        '服务器错误！' + '(' + JSON.stringify(error.response.data) + ')'
                    )
                })
        },
        createStateFilter (queryString) {
            return state => {
                return state.indexOf(queryString) === 0
            }
        },
        search () {
            this.$axios
                .get(
                    '/mbcodedetailnocode/?username=' +
            this.username +
            '&group=' +
            this.group +
            '&title=' +
            this.title
                )
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
        userclick: function (row, column, cell, event) {
            this.$router.push({
                name: 'viewcodedetail',
                params: { codeID: row.id }
            })
        },
        exportdata () {
            this.exporting = true
            this.dialogVisible = false
            this.$axios
                .get('/mbcodedetail/?username=' + this.username)
                .then(response => {
                    this.exporting = false
                    this.exportdialogVisible = true
                    this.realdata = {}
                    var li = []
                    for (let i = 0; i < response.data.length; i++) {
                        li.push(response.data[i].group)
                        if (!this.realdata[response.data[i].group]) { this.realdata[response.data[i].group] = [] }
                        this.realdata[response.data[i].group].push(response.data[i])
                    }
                    li = this.uniq(li)
                    this.codedata = []
                    this.exportlist = []
                    for (let i = 0; i < li.length; i++) {
                        this.codedata.push({
                            key: li[i],
                            label: li[i]
                        })
                    }
                })
                .catch(error => {
                    this.$message.error(
                        '服务器错误！' + '(' + JSON.stringify(error.response.data) + ')'
                    )
                    this.exporting = false
                })
        },
        goexport () {
            this.context = ''
            for (let i = 0; i < this.exportlist.length; i++) {
                this.context += '# ' + this.exportlist[i] + '\n'
                for (let j = 0; j < this.realdata[this.exportlist[i]].length; j++) {
                    this.context +=
            '## ' + this.realdata[this.exportlist[i]][j].title + '\n'
                    this.context += this.realdata[this.exportlist[i]][j].des + '\n'
                    this.context += '```cpp\n'
                    this.context += this.realdata[this.exportlist[i]][j].code + '\n'
                    this.context += '```\n\n'
                }
                this.context += '<br>\n\n'
            }

            this.downloadFile(this.username + '的模板.md', this.context)
        },
        downloadFile (fileName, content) {
            // var aLink = document.createElement('a')
            var blob = new Blob([content], { type: 'data:text/plain' })
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = fileName // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
