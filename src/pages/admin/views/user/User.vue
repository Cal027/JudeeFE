<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card>
            <template #header>
                <div style="margin: -5px">
                    <el-row :gutter="20">
                        <el-col :span="18">
                            <span style="font-size: 22px">用户列表</span>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="medium" icon="el-icon-close" type="text"
                                       style="margin-top: -1px" @click="clearFilter">
                                清空筛选
                            </el-button>
                        </el-col>
                        <el-col :span="4">
                            <el-input @change="searchUser" size="small" v-model="keyword"
                                      prefix-icon="el-icon-search" placeholder="用户名关键词"/>
                        </el-col>
                    </el-row>
                </div>
            </template>

            <el-table :data="userList"
                      max-height="450"
                      v-loading="loadingTable"
                      element-loading-text="正在加载"
                      style="width: 100%">
                <el-table-column prop="username" label="用户名" width="90"/>
                <el-table-column prop="nickname" label="昵称" width="90"/>
                <el-table-column prop="type" label="用户类型" width="110">
                    <template v-slot="scopeT">
                        <el-tag
                                :type="typeColor[scopeT.row.type-1]"
                                effect="plain">
                            {{typeMap[scopeT.row.type-1]}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="Email"/>
                <el-table-column label="最后登录">
                    <template v-slot="scope">
                        {{resolveTime(scope.row.last_login)}}
                    </template>
                </el-table-column>
                <el-table-column label="注册时间">
                    <template v-slot="scope">
                        {{resolveTime(scope.row.register_time)}}
                    </template>
                </el-table-column>
                <el-table-column prop="qq_number" label="QQ号码"/>
                <el-table-column prop="github_username" label="Github用户名"/>
                <el-table-column prop="phone_number" label="手机号码"/>
                <el-table-column fixed="right" label="操作" align="center">
                    <template v-slot="scope">
                        <el-tooltip content="编辑用户">
                            <el-button circle size="mini" icon="el-icon-edit"
                                       @click="openUserDialog(scope.row)"/>
                        </el-tooltip>
                        <el-tooltip content="删除用户">
                            <el-button circle type="danger" size="mini" icon="el-icon-delete"
                                       @click="deleteUser(scope.row.username)"/>
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
            <template #header>
                <span style="font-size: 22px">批量生成用户</span>
            </template>
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
                <el-form-item align="right" style="margin-top: 10px">
                    <el-button round type="primary" size="medium"
                               icon="fa fa-user-plus" @click="generateUser"
                               :loading="loadingGenerate">批量生成
                    </el-button>
                    <el-button round size="medium"
                               icon="fa fa-download" @click="handleDownload"
                               :loading="loadingGenerate">下载数据
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-dialog
                title="生成成功"
                :visible.sync="dialogVisible"
                destroy-on-close
                width="30%">
            <span>请记住生成的ID，用于下载用户列表</span>
            <span>{{fileID}}</span>
            <span slot="footer" class="dialog-footer">
                 <el-button type="primary" @click="handleClose">复制ID</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :title="'编辑用户：'+currentUser.username"
                :visible.sync="editUser"
                destroy-on-close
                width="40%">
            <el-form ref="form" :model="currentUser" :rules="rules">
                <el-form-item prop="nickname" label="昵称">
                    <el-input v-model="currentUser.nickname"/>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="currentUser.email"/>
                </el-form-item>
                <el-form-item prop="desc" label="个人介绍">
                    <el-input v-model="currentUser.desc"
                              placeholder="你这个人很懒，什么都没有留下"/>
                </el-form-item>

                <el-form-item prop="phone_number" label="电话号码">
                    <el-input v-model="currentUser.phone_number"
                              placeholder="还没留下电话号码"/>
                </el-form-item>

                <el-form-item prop="qq_number" label="QQ">
                    <el-input v-model="currentUser.qq_number" placeholder="还没留下QQ号码"/>
                </el-form-item>

                <el-form-item prop="github" label="Github用户名">
                    <el-input v-model="currentUser.github_username" placeholder="还没留下Github用户名"/>
                </el-form-item>
                <el-form-item prop="type" label="用户权限">
                    <el-select v-model="currentUser.type" placeholder="请选择用户权限">
                        <el-option label="普通用户" :value="1"/>
                        <el-option label="管理员" :value="2"/>
                        <el-option label="超级管理员" :value="3"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                 <el-button class="button" type="primary" @click="updateClick">更新</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>

<script>
import userAPI from '@admin/api/sys.user'
import * as clipboard from 'clipboard-polyfill'
import util from '@/utils/util'

const typeMap = ['用户', '普通管理员', '超级管理员']
const typeColor = ['info', '', 'warning']
export default {
  name: 'User',
  data () {
    const checkQQ = (rule, value, callback) => {
      const qqPattern = /^[1-9][0-9]{4,10}$/
      setTimeout(() => {
        if (qqPattern.test(value) || !value) {
          callback()
        } else {
          callback(new Error('非法QQ号码'))
        }
      }, 100)
    }
    const checkPhone = (rule, value, callback) => {
      const pPattern = /^1[34578]\d{9}$/
      setTimeout(() => {
        if (pPattern.test(value) || !value) {
          callback()
        } else {
          callback(new Error('非法手机号码'))
        }
      }, 100)
    }
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
      tableData: [],
      keyword: '',
      generateForm: {
        prefix: '',
        suffix: '',
        password_length: 8,
        num_from: 0,
        num_to: 0
      },
      loadingTable: false,
      loadingGenerate: false,
      fileID: '',
      dialogVisible: false,
      editUser: false,
      currentUser: {},
      rules: {
        email: { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        nickname: [
          { min: 3, max: 16, message: '长度在 3 到 8 个字符', trigger: 'blur' },
          { required: true, message: '请输入昵称', trigger: 'blur' }],
        qq_number: { validator: checkQQ, trigger: 'blur' },
        phone_number: { validator: checkPhone, trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    handleClose () {
      clipboard.writeText(this.fileID)
      this.$message({
        type: 'success',
        message: 'ID复制成功！'
      })
      this.dialogVisible = false
    },
    // 切换页码回调
    handleCurrentChange (page) {
      this.currentPage = page
      this.getUserList()
    },
    openUserDialog (user) {
      this.editUser = true
      this.currentUser = {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        phone_number: user.phone_number,
        qq_number: user.qq_number,
        github_username: user.github_username,
        desc: user.desc,
        type: user.type
      }
    },
    resolveTime (time) {
      return util.time.resolveTime(time)
    },
    getUserList () {
      this.loadingTable = true
      userAPI.getUserList(this.pageSize, (this.currentPage - 1) * this.pageSize)
        .then(response => {
          this.loadingTable = false
          this.tableData = response.results
          this.userList = this.tableData.slice()
          this.total = response.count
        })
    },
    searchUser () {
      // 忽略大小写模糊搜索
      this.userList = this.tableData.filter(item => {
        return item.username.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1
      })
    },
    clearFilter () {
      this.keyword = ''
      this.userList = this.tableData
    },
    deleteUser (username) {
      this.$confirm('此操作将永久删除用户及其资料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userAPI.deleteUser(username).then(_ => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.currentPage = 1
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateClick () {
      userAPI.patchUser(this.currentUser.username, this.currentUser).then(_ => {
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
        this.currentPage = 1
        this.editUser = false
        this.getUserList()
      })
    },
    generateUser () {
      this.loadingGenerate = true
      userAPI.bulkRegister(this.generateForm).then(response => {
        this.fileID = response.file_id
        this.dialogVisible = true
        this.loadingGenerate = false
      }).catch(() => {
        this.loadingGenerate = false
      })
    },
    handleDownload () {
      this.$prompt('请输入生成ID', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        userAPI.downloadUserList(value)
          .then(resp => {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(resp)
            link.download = `${value}.xlsx`
            document.body.appendChild(link)
            link.click()
            link.remove()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
</script>

<style scoped>
    .panel-options {
        float: right;
    }
</style>
