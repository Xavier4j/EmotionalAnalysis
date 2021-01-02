<template>
  <v-container>
    <v-card flat loading="postLoading" min-height="500">
      <v-row class="ma-2">
        <v-col cols="12" sm="6" md="6" lg="4" v-for="(post,index) in postList" :key="index">
          <v-lazy
            :options="{
              threshold: .5
            }"
            min-height="200"
            transition="fade-transition"
          >
            <v-card max-width="400" class="mx-auto" hover>
              <v-list-item>
                <v-list-item-avatar color="grey">
                  <img :src="post.authorProfile.avatar" alt="John" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">{{post.title}}</v-list-item-title>
                  <v-list-item-subtitle>{{post.authorProfile.nickname}}</v-list-item-subtitle>
                </v-list-item-content>
                <!-- <v-spacer></v-spacer> -->
                <v-chip class="hidden-sm-and-down" color="cyan" outlined>阅读人数:{{post.readNum}}</v-chip>
                <v-chip
                  class="ml-2"
                  style="margin-right:-17px;margin-top:-35px;"
                  small
                  label
                  v-if="post.isTop"
                  color="red"
                  text-color="white"
                >置顶</v-chip>
              </v-list-item>
              <v-img :src="post.imageUrl" height="194" @click="toPostView(post.id)"></v-img>
              <v-card-actions>
                <v-btn color="purple" text @click="toPostView(post.id)">READ</v-btn>
              </v-card-actions>
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PostList",
  data() {
    return {
      postLoading: false,
      postList: [],
      pageNum: 1,
      pageSize: 18
    };
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    selectPost() {
      this.postLoading = true;
      this.$api
        .getPostListByAuthor({
          author: this.token,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.data.code == 200) {
            this.postList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.postLoading = false;
        });
    },
    toPostView(id) {
      this.$router.push({
        path: "post",
        query: {
          id: id
        }
      });
    }
  },
  mounted() {
    this.selectPost();
  }
};
</script>
