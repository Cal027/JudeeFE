<template>
    <d2-container type="ghost">
        <d2-module-index-banner v-bind="banner"/>
        <el-card>
            <div slot="header" style="margin: -5px">
                <el-row :gutter="20">
                    <el-col :span="selectedUsers.length ? 18: 19">
                        <span style="font-size: 22px">用户列表</span>
                    </el-col>
                    <el-col :span="1">
                        <el-button circle v-show="selectedUsers.length"
                                   type="danger" icon="el-icon-delete-solid">
                        </el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-input size="small" v-model="keyword" prefix-icon="el-icon-search"
                                  placeholder="关键词"></el-input>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="userList"
                      height="250"
                      v-loading="loading"
                      @selection-change="handleSelectionChange"
                      element-loading-text="Loading"
                      style="width: 100%">
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="username" label="用户名"/>
                <el-table-column prop="nickname" label="昵称"/>
                <el-table-column prop="email" label="Email"/>
                <el-table-column prop="last_time" label="最后登录"/>
                <el-table-column prop="create_time" label="注册时间"/>
                <el-table-column prop="qq_number" label="QQ号码"/>
                <el-table-column prop="github_username" label="Github用户名"/>
                <el-table-column prop="phone_number" label="手机号码"/>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="{row}">
                        <el-button round size="mini" icon="el-icon-edit"
                                   @click.native="openUserDialog(row.id)"></el-button>
                        <el-button round size="mini" icon="el-icon-delete"
                                   @click.native="deleteUsers([row.id])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="panel-options">
                <el-pagination
                        class="page"
                        layout="prev, pager, next"
                        @current-change="currentChange"
                        :page-size="pageSize"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-card style="margin-top: 25px">
            <div slot="header">
                <span style="font-size: 22px">导入用户</span>
            </div>
            <el-upload>
                <el-button round type="primary" icon="fa fa-upload">
                    点击上传
                </el-button>
            </el-upload>
        </el-card>

    </d2-container>
</template>

<script>
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
      currentPage: 0,
      userList: [
        {
          username: 'Test123',
          nickname: 'TestMe',
          email: '123@qq.com',
          qq_number: 'None',
          github_username: 'None',
          phone_number: 'None'
        }],
      selectedUsers: [],
      keyword: '',
      loading: false
    }
  },
  mounted () {

  },
  methods: {
    // 切换页码回调
    currentChange (page) {
      this.currentPage = page
      this.getUserList(page)
    },
    openUserDialog (id) {

    },
    getUserList (page) {

    },
    deleteUsers (ids) {

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
    .panel-options{
        float: right;
    }
</style>
