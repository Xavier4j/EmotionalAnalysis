<template>
  <v-container>
    <v-chip class="ma-3" color="cyan" text-color="white">{{keyword}}</v-chip>
    <v-card class="py-3" flat :loading="loading" style="background:none" min-height="500">
      <v-expansion-panels>
        <v-expansion-panel v-for="(post,index) in postList" :key="index">
          <v-expansion-panel-header>{{post.title}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="7">
                <v-slider
                  style="margin-top:100px;"
                  v-model="post.positiveProbAverage"
                  readonly
                  :thumb-size="50"
                  thumb-label="always"
                  inverse-label
                  :label="'情感倾向：'+post.positiveProbAverage"
                >
                  <template
                    v-slot:thumb-label="{ value }"
                  >{{ satisfactionEmojis[Math.min(Math.floor(value / 10), 9)] }}</template>
                </v-slider>

                <v-chip class="ma-2" color="success" outlined>正向评论:{{post.positiveCommentNum}}</v-chip>
                <v-chip class="ma-2" color="cyan" outlined>中性评论:{{post.neutralCommentNum}}</v-chip>
                <v-chip class="ma-2" color="red" outlined>负向评论:{{post.negativeCommentNum}}</v-chip>
              </v-col>

              <v-spacer></v-spacer>

              <v-divider vertical class="mx-4"></v-divider>

              <v-col cols="4">
                <v-chip class="ma-2" color="primary" outlined>阅读人数:{{post.readNum}}</v-chip>
                <v-chip class="ma-2" color="orange" outlined>评论人数:{{post.commentNum}}</v-chip>
                <v-divider></v-divider>
                <v-chip
                  class="ma-2"
                  color="grey"
                  outlined
                  v-for="(commentTag,index) in post.commentTagList"
                  :key="index"
                >{{commentTag.tag}}</v-chip>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn text color="secondary"></v-btn> -->
              <v-btn text color="primary" @click="toView(post.id)">浏览</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "PostList",
  data() {
    return {
      loading: false,
      keyword: "",
      postList: [],
      satisfactionEmojis: [
        "😭",
        "😢",
        "☹️",
        "🙁",
        "😐",
        "🙂",
        "😊",
        "😁",
        "😄",
        "😍"
      ]
    };
  },
  methods: {
    getPostListByTag() {
      this.loading = true;
      this.$api
        .getPostListByTag({
          keyword: this.keyword
        })
        .then(res => {
          if (res.data.code == 200) {
            this.postList = res.data.data;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    toView(id) {
      const { href } = this.$router.resolve({
        path: `/post`,
        query: {
          id: id
        }
      });
      window.open(href, "_blank");
    }
  },
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.getPostListByTag();
  }
};
</script>
