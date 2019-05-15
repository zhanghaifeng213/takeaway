<template>
  <div class="col-lg-3 login-box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录" name="first">
        <h5 class="title">用户登录</h5>
        <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="button col-lg-12" @click="login('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="second">
        <h5 class="title">用户注册</h5>
        <el-form ref="regForm" :model="regForm" :rules="regRules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="regForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="regForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="regForm.checkPass" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="button col-lg-12" @click="reg('regForm')">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { userReg } from "@/fetch/user";
export default {
  name: "login",
  data() {
    let checkUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };

    let checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.regForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ trigger: "blur", validator: checkUser }],
        password: [{ trigger: "blur", validator: checkPass }]
      },
      regForm: {
        username: "",
        password: "",
        checkPass: ""
      },
      regRules: {
        username: [{ trigger: "blur", validator: checkUser }],
        password: [{ trigger: "blur", validator: checkPass }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      activeName: "first"
    };
  },
  methods: {
    ...mapActions(["handleLogin", "handleUserInfo"]),
    login(loginForm) {
      this.$refs[loginForm].validate(vaild => {
        if (vaild) {
          let param = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            role: 0
          };
          this.$store;
          this.handleLogin(param)
            .then(res => {
              if (res.data.code === 1) {
                this.handleUserInfo().then(res => {
                  this.$message({
                    message: "登陆成功",
                    type: "success"
                  });
                  this.$router.push({ name: "main" });
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    },
    reg(loginForm) {
      this.$refs[loginForm].validate(vaild => {
        if (vaild) {
          let data = {
            username: this.regForm.username,
            password: this.regForm.password,
            role: 0
          };
          userReg(data).then(res => {
            if (res.data.code == 1) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.errMsg);
            }
          });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    }
  },
  mounted() {}
};
</script>

<style>
.login-box {
  margin: 100px auto 0;
}
.title {
  text-align: center;
  margin-bottom: 10px;
}
.el-form-item__error {
  padding-top: 0;
}
.el-checkbox {
  margin: 0 0 20px 50px;
}
</style>
