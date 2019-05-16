<template>
  <div>
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原账号" prop="name">
        <el-input v-model="ruleForm2.name"></el-input>
      </el-form-item>
      <el-form-item label="原密码" prop="oldpass">
        <el-input type="password" v-model="ruleForm2.oldpass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新账号" prop="newname">
        <el-input v-model="ruleForm2.newname"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { updateUserInfo } from "@/fetch/user";
export default {
  name: "main-info",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        oldpass: "",
        pass: "",
        checkPass: "",
        name: "",
        newname: "",
        oldpass: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        newname: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        oldpass: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState({
      username: state => state.username
    })
  },
  methods: {
    ...mapActions(["handleUserInfo"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            username: this.ruleForm2.name,
            password: this.ruleForm2.oldpass,
            newusername: this.ruleForm2.newname,
            newpassword: this.ruleForm2.pass,
            role: 0
          };
          updateUserInfo(data).then(res => {
            if (res.data.code == 1) {
              this.$message.info(res.data.data);
              if (res.data.data == "修改成功") {
                this.handleUserInfo();
              }
            } else {
              this.$message.info(res.data.errMsg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.ruleForm2.name = this.username;
  }
};
</script>

<style>
.img-wrap {
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.img-wrap img {
  width: 100%;
}
</style>
