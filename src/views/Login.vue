<template>
  <v-app id="inspire">
    <v-sparkline
      style="height:100%"
      :value="value"
      :gradient="gradient"
      :smooth="radius || false"
      :padding="padding"
      :line-width="width"
      :stroke-linecap="lineCap"
      :gradient-direction="gradientDirection"
      :fill="fill"
      :type="type"
      :auto-line-width="autoLineWidth"
      auto-draw
    ></v-sparkline>
    <v-container fluid fill-height style="opacity: .8;z-index:2;margin-top: -100vh;">
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title v-if="isLogin">Login</v-toolbar-title>
              <v-toolbar-title v-else>Signup</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                class="text-capitalize"
                color="red lighten-5"
                light
                outlined
                @click="isLogin =!isLogin"
              >{{isLogin?'Signup':'Login'}}</v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Login"
                  name="login"
                  v-model="logInForm.username"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  v-model="logInForm.password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>

                <v-text-field
                  id="confirmPassword"
                  label="ConfirmPassword"
                  name="confirmPassword"
                  v-model="confirmPassWord"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-if="!isLogin"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-select
                v-if="isLogin"
                class="ml-7 mt-5"
                style="width:50px"
                v-model="role"
                solo
                :items="roleList"
                item-text="title"
                item-value="value"
                label="角色选择"
              ></v-select>
              <v-spacer></v-spacer>
              <v-btn color="cyan" class="text-capitalize" dark @click="submit(logInForm)">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      :bottom="bottom"
      :color="color"
      :left="left"
      :multi-line="mode === 'multi-line'"
      :right="right"
      :timeout="timeout"
      :top="top"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];

export default {
  name: "Login",
  data() {
    return {
      //图标样式
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: "round",
      gradient: gradients[4],
      value: [-2, 2, 5, -4, 5, -8, 3, 5, -3, 5, -5, 6, 2, 8, -6],
      gradientDirection: "top",
      gradients,
      fill: false,
      type: "bar",
      autoLineWidth: false,
      //isLogin判断是登录还是注册
      isLogin: true,
      //登录数据
      role: 1,
      roleList: [
        {
          title: "普通用户",
          value: 1
        },
        {
          title: "管理员",
          value: 2
        }
      ],
      logInForm: {
        username: "",
        password: ""
      },
      //注册数据
      signUpForm: {
        username: "",
        password: ""
      },
      confirmPassWord: "",
      //消息属性
      color: "",
      mode: "",
      snackbar: false,
      text: "Hello, I'm a snackbar",
      timeout: 6000,
      bottom: "",
      left: "",
      right: "",
      top: ""
    };
  },
  methods: {
    openSnackbar(bottom, left, right, top, color, text, timeout) {
      this.snackbar = true;
      this.bottom = bottom;
      this.left = left;
      this.right = right;
      this.top = top;
      this.color = color;
      this.text = text;
      this.timeout = timeout;
    },
    submit(logInForm) {
      if (this.isLogin) {
        this.logIn(logInForm);
      } else {
        this.signUp(logInForm);
      }
    },
    logIn(logInForm) {
      this.$api
        .logIn(logInForm)
        .then(res => {
          console.log(res);
          if (res.data.status) {
            // this.openSnackbar(false,false,false,true,"success","登录成功!",2000);
            // this.$store.commit("", val);
            this.$store.dispatch("LOGIN", res.data.data).then(() => {
              if (this.$route.query.redirect) {
                this.$toast({
                  color: "success",
                  mode: "",
                  snackbar: true,
                  text: res.data.msg,
                  timeout: 2000,
                  x: "right",
                  y: "top"
                });
                this.$router.push(this.$route.query.redirect);
              } else {
                if (this.role >= 2) {
                  if (res.data.data.role >= 2) {
                    this.$toast({
                      color: "success",
                      mode: "",
                      snackbar: true,
                      text: res.data.msg,
                      timeout: 2000,
                      x: "right",
                      y: "top"
                    });
                    this.$router.push("/admin/");
                  } else {
                    this.$toast({
                      color: "error",
                      mode: "",
                      snackbar: true,
                      text: "您不是管理员，无法进入管理系统",
                      timeout: 2000,
                      x: "right",
                      y: "top"
                    });
                  }
                } else {
                  this.$toast({
                    color: "success",
                    mode: "",
                    snackbar: true,
                    text: res.data.msg,
                    timeout: 2000,
                    x: "right",
                    y: "top"
                  });
                  this.$router.push("/");
                }
              }
            });
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top"
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    },
    signUp(logInForm) {
      if (logInForm.password != this.confirmPassWord) {
        this.$toast({
          color: "warning",
          mode: "",
          snackbar: true,
          text: "两次输入密码不一样，请检查！",
          timeout: 2000,
          x: "right",
          y: "top"
        });
        return;
      }
      this.$api
        .signUp(logInForm)
        .then(res => {
          console.log(res);
          if (res.data.status) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top"
            });
            // this.$store.commit("", val);
            this.$store.dispatch("LOGIN", res.data.data).then(() => {
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect);
              } else {
                this.$router.push("/");
              }
            });
          } else {
            this.$toast({
              color: "warning",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top"
            });
          }
        })
        .catch(err => {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "服务器故障了，请稍后重试",
            timeout: 2000,
            x: "right",
            y: "top"
          });
          console.log(err);
        })
        .finally(() => {});
    }
  }
};
</script>
