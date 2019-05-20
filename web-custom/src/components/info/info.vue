<template>
  <div class="person-info">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="name" :counter="10" :rules="nameRules" label="用户名" required></v-text-field>
      <v-text-field v-model="realname" :counter="10" :rules="realnameRules" label="真实姓名" required></v-text-field>
      <v-text-field v-model="tel" :counter="10" :rules="telRules" label="电话" required></v-text-field>
      <v-text-field v-model="address" :counter="10" :rules="addressRules" label="地址" required></v-text-field>

      <v-text-field v-model="oldpass" :rules="oldpassRules" type="password" label="原密码" required></v-text-field>
      <v-text-field v-model="newname" :counter="10" :rules="newnameRules" label="新用户名" required></v-text-field>

      <v-text-field v-model="pass" :rules="passRules" type="password" label="新密码" required></v-text-field>
      <v-text-field
        v-model="checkPass"
        :rules="checkPassRules"
        type="password"
        label="确认新密码"
        required
      ></v-text-field>

      <v-btn color="success" @click="validate">修改</v-btn>
      <v-btn color="error" @click="goLogin">退出登陆</v-btn>
    </v-form>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { updateUserInfo, info } from "@/api/user";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    var validatePass = v => {
      return v === this.pass || "密码不一致";
    };
    return {
      valid: true,
      name: "",
      realname: "",
      tel: "",
      address: "",
      realnameRules: [v => !!v || "姓名不能为空"],
      telRules: [v => !!v || "电话不能为空"],
      addressRules: [v => !!v || "地址不能为空"],
      nameRules: [
        v => !!v || "用户名不能为空",
        v => (v && v.length <= 10) || "用户名长度不能超过10"
      ],
      newname: "",
      newnameRules: [
        v => !!v || "新用户名不能为空",
        v => (v && v.length <= 10) || "新用户名长度不能超过10"
      ],
      pass: "",
      passRules: [v => !!v || "密码不能为空"],
      oldpass: "",
      oldpassRules: [v => !!v || "密码不能为空"],
      checkPass: "",
      checkPassRules: [validatePass],
      snackbar: false,
      text: "",
      y: "top",
      x: null,
      mode: "",
      timeout: 1500
    };
  },
  computed: {
    ...mapState({
      username: state => state.userName
    })
  },
  mounted() {
    this.name = this.username;
    this.getInfo();
  },
  methods: {
    ...mapMutations(["setUserName"]),
    validate() {
      if (this.$refs.form.validate()) {
        let data = {
          username: this.name,
          password: this.oldpass,
          newusername: this.newname,
          newpassword: this.pass,
          realname: this.realname,
          tel: this.tel,
          address: this.address,
          role: 1
        };
        updateUserInfo(data).then(res => {
          if (res.data.code == 1) {
            this.text = res.data.data;
            this.snackbar = true;
            if (res.data.data == "修改成功") {
              // sessionStorage.setItem("username", data.newusername);
              // this.setUserName(data.newusername);
              this.$router.push({
                path: "/"
              });
            }
          } else {
            this.text = res.data.errMsg;
            this.snackbar = true;
          }
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    goLogin() {
      this.$router.push("/");
    },
    getInfo() {
      info().then(res => {
        if (res.data.code == 1) {
          this.realname = res.data.data.realname;
          this.tel = res.data.data.tel;
          this.address = res.data.data.address;
        }
      });
    }
  }
};
</script>
<style>
.person-info {
  padding: 40px;
}
</style>

