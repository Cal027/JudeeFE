<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card>
            <div slot="header" style="margin: -5px">
                <el-row :gutter="20">
                    <el-col :span="1">
                        <el-button circle v-show="selectedUsers.length"
                                   type="danger" size="small"
                                   @click="deleteUsers(selectedUserIDs)"
                                   icon="el-icon-delete-solid">
                        </el-button>
                    </el-col>
                    <el-col :span="selectedUsers.length ? 18: 19">
                        <span style="font-size: 22px">用户列表</span>
                    </el-col>
                    <el-col :span="5">
                        <el-input size="small" v-model="keyword" prefix-icon="el-icon-search" placeholder="关键词"/>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="userList"
                      max-height="400"
                      v-loading="loadingTable"
                      @selection-change="handleSelectionChange"
                      element-loading-text="Loading"
                      style="width: 100%">
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="username" label="用户名" width="90"/>
                <el-table-column prop="nickname" label="昵称" width="90"/>
                <el-table-column prop="type" label="用户类型">
                    <template slot-scope="scopeT">
                        <el-tag
                                :type="typeColor[scopeT.row.type-1]"
                                effect="plain">
                                {{typeMap[scopeT.row.type-1]}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="Email"/>
                <el-table-column prop="last_login" label="最后登录"/>
                <el-table-column prop="register_time" label="注册时间"/>
                <el-table-column prop="qq_number" label="QQ号码"/>
                <el-table-column prop="github_username" label="Github用户名"/>
                <el-table-column prop="phone_number" label="手机号码"/>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑用户">
                            <el-button round size="mini" icon="el-icon-edit"
                                       @click.native="openUserDialog(scope.row.id)"/>
                        </el-tooltip>
                        <el-tooltip content="删除用户">
                            <el-button round type="danger" size="mini" icon="el-icon-delete"
                                       @click.native="deleteUsers(scope.row.id)"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="panel-options">
                <el-pagination
                        class="page"
                        layout="total, prev, pager, next, jumper"
                        :current-page="currentPage"
                        @current-change="handleCurrentChange"
                        :page-size="pageSize"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-card style="margin-top: 25px">
            <div slot="header">
                <span style="font-size: 22px">导入用户</span>
            </div>
            <el-button round type="primary" icon="fa fa-upload">点击上传(还没实现)</el-button>
        </el-card>

        <el-card style="margin-top: 25px">
            <div slot="header">
                <span style="font-size: 22px">批量生成用户</span>
            </div>
            <el-form :model="generateForm" ref="generateForm">
                <el-row type="flex" justify="space-between">
                    <el-col :span="4">
                        <el-form-item label="前缀" prop="prefix">
                            <el-input v-model="generateForm.prefix" placeholder="前缀"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="后缀" prop="suffix">
                            <el-input v-model="generateForm.suffix" placeholder="后缀"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="开始序号" prop="num_from" required>
                            <el-input-number :min="0" v-model="generateForm.num_from" style="width: 100%"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="结束序号" prop="num_to" required>
                            <el-input-number :min="generateForm.num_from" v-model="generateForm.num_to" style="width: 100%"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="初始密码长度" prop="password_length" required>
                            <el-input-number :min="6" v-model="generateForm.password_length" style="width: 100%"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button round type="primary"
                               icon="fa fa-user-plus" @click="generateUser"
                               :loading="loadingGenerate">批量生成
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </d2-container>
</template>

<script>
import userAPI from '@admin/api/sys.user'
import * as clipboard from 'clipboard-polyfill'

const typeMap = ['用户', '普通管理员', '超级管理员']
const typeColor = ['info', '', 'warning']
export default {
  name: 'User',
  data () {
    return {
      banner: {
        title: '用户管理',
        subTitle: '在这里可以管理用户'
      },
      // 一页显示的用户数
      pageSize: 10,
      // 用户总数
      total: 0,
      // 当前页码
      currentPage: 1,
      typeMap,
      typeColor,
      userList: [],
      selectedUsers: [],
      keyword: '',
      generateForm: {
        prefix: '',
        suffix: '',
        password_length: 8,
        num_from: 0,
        num_to: 0
      },
      loadingTable: false,
      loadingGenerate: false
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    // 切换页码回调
    handleCurrentChange (page) {
      this.currentPage = page
      this.getUserList()
    },
    openUserDialog (id) {

    },
    getUserList () {
      this.loadingTable = true
      userAPI.getUserList(this.pageSize, (this.currentPage - 1) * this.pageSize)
        .then(response => {
          this.loadingTable = false
          this.userList = response.results
          this.total = response.count
          // console.log(this.userList)
        })
    },
    deleteUsers (ids) {
      this.$confirm('此操作将永久删除用户及其资料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    generateUser () {
      this.loadingGenerate = true
      // let data = Object.assign({}, this.formGenerateUser)
      // FIXME 获取不到response
      userAPI.bulkRegister(this.generateForm)
        .then(response => {
          this.loadingTable = false
          this.$alert('请记住生成的文件ID，用于下载用户列表\n' + response.data['file_id'], '生成成功', {
            confirmButtonText: '复制文件ID',
            callback: action => {
              if (action === 'confirm') {
                clipboard.writeText(response.data['file_id'])
                this.$message({
                  type: 'success',
                  message: '文件ID复制成功！'
                })
              }
            }
          })
        }).catch(() => {
          this.loadingTable = false
        })
    },
    handleSelectionChange (val) {
      this.selectedUsers = val
    }
  },
  computed: {
    selectedUserIDs () {
      let ids = []
      for (let user of this.selectedUsers) {
        ids.push(user.id)
      }
      return ids
    }
  }
}
</script>

<style scoped>
    .panel-options {
        float: right;
    }
</style>
