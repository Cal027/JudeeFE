<template>
  <el-container>
    <el-header>
      <h1>加入Judee</h1>
    </el-header>
    <el-main>
      <el-card class="reg-box">
        <el-form :model="regForm"
                 :hide-required-asterisk="true"
                 status-icon ref="regForm"
                 :rules="rules"
                 @keyup.native.enter="registerClick">

          <el-form-item prop="email" label="Email">
            <el-input v-model="regForm.email" type="email" placeholder="abc@example.com"></el-input>
          </el-form-item>

          <el-form-item prop="username" label="用户名">
            <el-input v-model="regForm.username" placeholder="不少于3个字符的用户名"></el-input>
          </el-form-item>

          <el-form-item prop="nickname" label="昵称">
            <el-input v-model="regForm.nickname" placeholder="不少于1个字符的昵称"></el-input>
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input
              type="password"
              v-model="regForm.password"
              placeholder="不少于6个字符的密码"
            ></el-input>
          </el-form-item>

          <el-form-item prop="confirm" label="确认密码">
            <el-input
              type="password"
              v-model="regForm.confirm"
              autocomplete="off"
              placeholder="请重复密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button @click="dialogRegisterVisible = false">取 消</el-button>
      <el-button @click="resetForm('regForm')">重 置</el-button>
      <el-button type="primary" @click="registerClick('regForm')">确 定</el-button>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        nickname: "register",
        data() {
            //正则表达式校验
            var checkUserName = (rule, value, callback) => {
                var uPattern = /^[a-zA-Z0-9_-]{3,16}$/;
                if (!value) {
                    return callback(new Error('用户名不能为空'))
                }
                setTimeout(() => {
                    if (uPattern.test(value)) {
                        callback()
                    } else {
                        callback(new Error('非法用户名'))
                    }
                }, 100)
            };
            var checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else if (value.length < 6) {
                    callback(new Error('密码不能少于6字符'));
                } else {
                    if (this.regForm.confirm !== '') {
                        this.$refs.regForm.validateField('confirm');
                    }
                    callback();
                }
            };
            var checkConfirm = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.regForm.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            };
            var checkName = (rule, value, callback) => {
                if (value.length < 1) {
                    callback(new Error('昵称不能少于1字符'))
                } else {
                    callback()
                }
            };
            return {
                dialogRegisterVisible: false,
                regForm: {
                    username: '',
                    password: '',
                    confirm: '',
                    nickname: '',
                    email: ''
                },
                rules: {
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}],
                    username: [{validator: checkUserName, trigger: 'blur'}],
                    password: [{validator: checkPass, trigger: 'blur'}],
                    confirm: [{validator: checkConfirm, trigger: 'blur'}],
                    nickname: [{validator: checkName, trigger: 'blur'}]
                }
            };
        },
        methods: {
            open() {
                this.dialogRegisterVisible = true;
            },
            registerClick(formName) {
                console.log('Click register');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.regForm.password = this.$md5(this.regForm.password);
                        this.$axios
                            .post("register/",
                                {
                                    username: this.regForm.username,
                                    password: this.$md5(this.regForm.password),
                                    nickname: this.regForm.nickname,
                                    email: this.regForm.email
                                }
                            )
                            .then(response => {
                                if (response.data === "userError") {
                                    this.$message.error("用户名已存在！");
                                    return;
                                }
                                if (response.data === "emailError") {
                                    this.$message.error("邮箱已存在！");
                                    return;
                                }
                                this.$message({
                                    message: "注册成功！",
                                    type: "success"
                                });
                                this.dialogRegisterVisible = false;
                                this.regForm.password = "";
                            })
                            .catch(Error => {
                                this.$message.error(
                                    "服务器错误！" + "(" + JSON.stringify(Error.response.data) + ")"
                                );
                            });
                    } else {
                        this.$message.error('注册失败!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                console.log('Click Reset');
                this.$refs[formName].resetFields();
            }
        }
    };
</script>

<style scoped>
  .el-header h1 {
    text-align: center;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: -.5px;
  }

  .el-main {
    text-align: center;
    /*width: 340px;*/
    margin: 0 auto;
  }

  .reg-box {
    width: 448px;
  }
</style>
