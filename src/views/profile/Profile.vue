<template>
  <v-container>
    <v-tabs background-color="white" color="deep-purple accent-4" right show-arrows>
      <v-tab>个人信息</v-tab>
      <v-tab>我的消息</v-tab>
      <v-tab>我的帖子</v-tab>
      <!-- <v-tab>我的收藏</v-tab> -->
      <v-tab v-if="role<2">成为版主</v-tab>
      <v-tab>账号设置</v-tab>

      <v-tab-item class="ml-3">
        <information />
      </v-tab-item>
      <v-tab-item>
        <message />
      </v-tab-item>
      <v-tab-item>
        <PostList></PostList>
      </v-tab-item>
      <!-- <v-tab-item>我的收藏</v-tab-item> -->
      <v-tab-item v-if="role<2">
        <Moderator />
      </v-tab-item>
      <v-tab-item>
        <Account />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Profile",
  components: {
    Information: () => import("./Information"),
    Message: () => import("./Message"),
    PostList: () => import("./PostList"),
    Account: () => import("./Account"),
    Moderator: () => import("./Moderator")
  },
  computed: {
    ...mapState(["role"])
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.v-text-field .v-input__control {
  display: none;
}
</style>
