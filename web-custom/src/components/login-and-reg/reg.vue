<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="name" :counter="10" :rules="nameRules" label="用户名" required></v-text-field>

      <v-text-field v-model="pass" :rules="passRules" type="password" label="密码" required></v-text-field>
      <v-text-field
        v-model="checkPass"
        :rules="checkPassRules"
        type="password"
        label="确认密码"
        required
      ></v-text-field>
      <v-text-field v-model="realname" :counter="10" :rules="realnameRules" label="姓名" required></v-text-field>
      <v-text-field v-model="tel" :counter="10" :rules="telRules" label="电话" required></v-text-field>
      <v-text-field v-model="address" :counter="10" :rules="addressRules" label="地址" required></v-text-field>

      <v-btn color="success" @click="validate">注册</v-btn>

      <v-btn color="error" @click="reset">重置</v-btn>
    </v-form>
  </div>
</template>
<script>
import { userReg } from "@/api/user";
export default {
  data() {
    var validatePass = v => {
      return v === this.pass || "密码不一致";
    };
    return {
      valid: true,
      name: "",
      nameRules: [
        v => !!v || "用户名不能为空",
        v => (v && v.length <= 10) || "用户名长度不能超过10"
      ],
      pass: "",
      passRules: [v => !!v || "密码不能为空"],
      checkPass: "",
      checkPassRules: [validatePass],
      realname: "",
      tel: "",
      address: "",
      realnameRules: [v => !!v || "真实姓名不能为空"],
      telRules: [v => !!v || "电话不能为空"],
      addressRules: [v => !!v || "地址不能为空"]
    };
  },

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        let data = {
          username: this.name,
          password: this.pass,
          realname: this.realname,
          tel: this.tel,
          address: this.address,
          role: 1
        };
        userReg(data).then(res => {
          if (res.data.code == 1) {
            this.$emit("message", res.data.msg);
          } else {
            this.$emit("message", res.data.errMsg);
          }
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
