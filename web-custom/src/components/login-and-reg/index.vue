<template>
  <div class="login-and-reg">
    <v-tabs v-model="active" color="cyan" dark slider-color="yellow">
      <v-tab :key="1" ripple>登陆</v-tab>
      <v-tab-item :key="1">
        <v-card flat>
          <v-card-text>
            <login @message="message"></login>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab :key="2" ripple>注册</v-tab>
      <v-tab-item :key="2">
        <v-card flat>
          <v-card-text>
            <reg @message="message"/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
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
import Login from "./login";
import Reg from "./reg";
export default {
  data() {
    return {
      active: null,
      snackbar: false,
      text: "",
      y: "top",
      x: null,
      mode: "",
      timeout: 1500
    };
  },
  methods: {
    next() {
      const active = parseInt(this.active);
      this.active = active < 2 ? active + 1 : 0;
    },
    message(text) {
      this.text = text;
      this.snackbar = true;
    }
  },
  components: {
    Login,
    Reg
  }
};
</script>

<style>
</style>