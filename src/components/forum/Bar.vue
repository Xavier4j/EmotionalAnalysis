<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    src="https://picsum.photos/1920/1080?random"
    app
    color="blue darken-3"
    dark
  >
    <template v-slot:img="{ props }">
      <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"></v-img>
    </template>
    <v-btn
      class="ma-2"
      tile
      text
      color="white"
      style="height:50px;width:50px;min-width:0px;padding:5px !important;margin: 5px !important;"
      @click.stop="setDrawer(!drawer)"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <!-- <v-app-bar-nav-icon tile outlined @click.stop="setDrawer(!drawer)" /> -->
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      <span>doyoudo</span>
    </v-toolbar-title>
    <v-text-field
      v-model="search"
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="mdi-magnify"
      label="Search"
      class="hidden-sm-and-down"
      @change="toSearch"
    />
    <v-spacer />
    <v-btn
      class="hidden-xs-only"
      tile
      outlined
      color="white"
      to="write"
      @click.stop="setDrawer(false)"
    >
      <v-icon left>mdi-pencil</v-icon>Write
    </v-btn>
    <v-badge class="ma-3" :content="messages" :value="messages" color="green" overlap>
      <v-icon size="30px" @click="goTo('message')" @click.stop="setDrawer(false)">mdi-email</v-icon>
    </v-badge>
    <v-btn class="ma-3" text v-if="!token" to="login">登录/注册</v-btn>
    <v-menu v-else offset-y transition="slide-y-transition" bottom>
      <template v-slot:activator="{ on }">
        <v-btn class="ml-3 mr-2" icon large v-on="on">
          <v-avatar size="54px">
            <v-img :src="avatar" alt="请登录" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="goTo(item.to)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Bar",

  data: () => ({
    items: [
      { title: "个人中心", to: "profile" },
      { title: "账号设置", to: "account" },
      { title: "退出登录", to: "logout" }
    ],
    messages: 0,
    id_of_setinterval: ""
  }),

  computed: {
    ...mapState(["drawer", "token", "avatar"]),
    search: {
      get() {
        return this.$store.state.search;
      },
      set(val) {
        this.$store.commit("SET_SEARCH", val);
      }
    }
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    }),
    toSearch() {
      if (!this.search) {
        console.log("return");
        return;
      }
      this.$router
        .push({
          path: "search",
          query: {
            search: this.search
          }
        })
        .catch(() => {});
      this.setDrawer(false);
    },
    goTo(to) {
      if (to == "logout") {
        this.$store.dispatch("LOGOUT");
        this.$router.push({
          path: "/login"
        });
      } else {
        if (to == "message") {
          this.messages = 0;
        }
        this.setDrawer(false);
        this.$router.push({
          path: to
        });
      }
    },
    getMessageCount() {
      console.log("getMessageCount");
      if (this.token) {
        this.$api
          .getMessageCount({
            receiver: this.token
          })
          .then(res => {
            if (res.data.code == 200) {
              this.messages = res.data.data;
            } else {
              console.log("获取数据失败！");
            }
          })
          .catch(err => {
            // this.$message.error("获取数据失败！");
            console.log(err);
          })
          .finally(() => {});
      }
    }
  },
  created() {
    this.getMessageCount();
    this.id_of_setinterval = setInterval(this.getMessageCount, 1000 * 60);
  },
  beforeDestroy() {
    console.log("destory");
    clearInterval(this.id_of_setinterval);
  }
};
</script>
