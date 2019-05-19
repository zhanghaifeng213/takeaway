<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field v-model="name" :counter="10" :rules="nameRules" label="用户名" required></v-text-field>

    <v-text-field v-model="pass" :rules="passRules" type="password" label="密码" required></v-text-field>

    <v-btn color="success" @click="validate">登陆</v-btn>

    <v-btn color="error" @click="reset">重置</v-btn>
  </v-form>
</template>
<script>
import { login, info } from "@/api/user";
import { mapMutations } from "vuex";
export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "用户名不能为空",
      v => (v && v.length <= 10) || "用户名长度不能超过10"
    ],
    pass: "",
    passRules: [v => !!v || "密码不能为空"]
  }),

  methods: {
    ...mapMutations(["setUserName", "setUserId"]),
    validate() {
      if (this.$refs.form.validate()) {
        let data = {
          username: this.name,
          password: this.pass,
          role: 1
        };
        login(data).then(res => {
          if (res.data.code == 1) {
            this.$emit("message", res.data.msg);
            sessionStorage.setItem("token", res.data.data);
            this.setUserName(data.username);
            sessionStorage.setItem("username", data.username);
            info().then(res => {
              if (res.data.code == 1) {
                sessionStorage.setItem("userId", res.data.data.id);
                this.setUserId(res.data.data.id);
              }
            });
            this.$router.push({
              name: "goods"
            });
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
