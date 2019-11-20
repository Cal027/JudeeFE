<template>
  <div class="container">
    <div class="avatar-container">
      <el-avatar :src="avatarUrl" :size="140"/>
    </div>

    <el-card :body-style="{ padding: '100px' }">
      <router-link to="/setting/profile">
        <el-button icon="el-icon-edit-outline" type="text" class="editProf">修改信息</el-button>
      </router-link>
      <router-link to="/setting/password">
        <el-button icon="el-icon-edit-outline" type="text" class="editPass">修改密码</el-button>
      </router-link>
      <p style="margin-top: -10px;">
        <el-row>
          <span class="emphasis">{{ username }}</span>
        </el-row>
        <el-row>
          <el-tooltip :content="profile.email" class="item" placement="bottom">
            <i class="iconfont j-icon-mail-fill"/>
          </el-tooltip>
          <el-tooltip :content="phone_number" class="item" placement="bottom">
            <i class="iconfont j-icon-phone-fill"/>
          </el-tooltip>
          <el-tooltip :content="qq" class="item" style="margin-left: 5px;margin-right: 5px"
                      placement="bottom">
            <i class="iconfont j-icon-QQ"/>
          </el-tooltip>
          <el-tooltip :content="github" class="item" placement="bottom">
            <i class="iconfont j-icon-github-fill"/>
          </el-tooltip>
        </el-row>
      </p>

      <el-divider/>

      <el-row type="flex">
        <el-col>
          <p>提交次数</p>
          <p class="emphasis">{{ userData.submit }}</p>
        </el-col>
        <el-col class="middle">
          <p>AC问题数</p>
          <p class="emphasis">{{ userData.ac }}</p>
        </el-col>
        <el-col>
          <p>分数</p>
          <p class="emphasis">{{ userData.score }}</p>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      baseUrl: process.env.BASE_URL,
      avatarUrl: `images/default.png`,
      username: '',
      profile: {},
      userData: {},
      github: '还没填写Github信息',
      qq: '还没填写QQ信息',
      phone_number: '还没填写电话号码'
    }
  },
  created () {
    this.username = this.$route.query.username
    this.$api.user.getUserInfo(this.username).then(response => {
      this.profile = response.data
      if (this.profile.qq_number) {
        this.qq = this.profile.qq_number
      }
      if (this.profile.github_username) {
        this.github = this.profile.github_username
      }
      if (this.profile.phone_number) {
        this.phone_number = this.profile.phone_number
      }
    })
    this.$api.user.getUserData(this.username).then(response => {
      this.userData = response.data
    })
  }
}
</script>

<style lang="less" scoped>
    .container {
        position: relative;
        width: 75%;
        margin: 170px auto;
        text-align: center;

        .avatar-container {
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            z-index: 1;
            top: -90px;

            .el-avatar {
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            }
        }

        .el-row {
            margin-bottom: 20px;
        }

        .editProf {
            margin-top: 10px;
            margin-right: 20px;
            position: absolute;
            top: 0;
            right: 0;
        }

        .editPass {
            margin-top: 10px;
            margin-right: 20px;
            position: absolute;
            top: 30px;
            right: 0;
        }

        .emphasis {
            font-size: 25px;
            font-weight: 600;
        }

        .item {
            font-size: 20px;
        }

        .middle {
            border-left: 1px solid #DCDFE6;
            border-right: 1px solid #DCDFE6;
        }

    }

</style>
