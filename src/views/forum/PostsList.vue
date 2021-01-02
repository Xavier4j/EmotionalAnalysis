<template>
  <div>
    <v-container class="top" v-if="false">
      <div class="d-lg-none">
        <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet :color="colors[i]" height="100%">
              <v-row class="fill-height" align="center" justify="center">
                <v-img class="white--text align-end" src="https://picsum.photos/1920/1280?random"></v-img>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>
      <div class="d-none d-lg-block" style="max-width:900px; margin:0 auto">
        <v-carousel cycle height="300" hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet :color="colors[i]" height="100%">
              <v-row class="fill-height" align="center" justify="center">
                <v-img class="white--text align-end" src="https://picsum.photos/1920/1280?random"></v-img>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>
      <!-- <v-row>
        <v-col cols="12" sm="6" md="4" v-for="n in 3" :key="n">
          <v-card class="mx-auto" max-width="400">
            <v-img
              class="white--text align-end"
              height="150"
              src="https://material-launcher.vuetifyjs.com/img/bg.3aa3f190.png"
            >
              <v-card-title>第{{n}}个热门帖子</v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>-->
    </v-container>
    <v-container class="main">
      <v-card flat :loading="loading" tile min-height="550" style="background:none">
        <v-alert outlined color="orange" v-if="plateIsClosed" border="left">该板块已关闭！</v-alert>
        <v-row>
          <v-col
            cols="12"
            v-for="(post,index) in postList"
            :key="index"
            v-show="permission || hidden(post)"
          >
            <v-lazy
              :options="{
              threshold: .5
            }"
              transition="fade-transition"
            >
              <v-card class="mx-auto" hover>
                <v-row class="ma-0">
                  <v-col cols="0" sm="3" class="hidden-xs-only pa-0">
                    <v-img :src="post.imageUrl" height="200" @click="toPostView(post.id)"></v-img>
                  </v-col>
                  <v-col cols="12" sm="9" class="pa-0">
                    <v-list-item>
                      <v-list-item-avatar color="grey" size="80" class="hidden-xs-only">
                        <img :src="post.authorProfile.avatar" alt="John" />
                      </v-list-item-avatar>
                      <v-list-item-avatar color="grey" size="50" class="hidden-sm-and-up">
                        <img :src="post.authorProfile.avatar" alt="John" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          class="headline mb-3"
                          style="font-size: 21px !important;"
                        >{{post.title}}</v-list-item-title>
                        <v-list-item-subtitle>By:{{post.authorProfile.nickname}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <!-- <v-spacer></v-spacer> -->
                      <!-- <v-chip color="cyan" outlined hidden-sm-and-down>阅读人数:{{post.readNum}}</v-chip> -->
                      <v-chip
                        class="ml-2"
                        style="margin-right:-17px;margin-top:-70px;"
                        small
                        label
                        v-if="post.isTop"
                        color="red"
                        text-color="white"
                      >置顶</v-chip>
                    </v-list-item>
                    <v-card-actions class="mt-7">
                      <v-btn color="purple" text @click="toPostView(post.id)">READ</v-btn>
                      <v-btn
                        color="orange"
                        text
                        v-if="permission && !post.isTop"
                        @click="setTop(index,post.id,true)"
                      >置顶</v-btn>
                      <v-btn
                        color="orange"
                        text
                        v-if="permission && post.isTop"
                        @click="setTop(index,post.id,false)"
                      >取消置顶</v-btn>
                      <v-btn
                        color="cyan"
                        text
                        v-if="permission && post.status==0"
                        @click="setStatus(index,post.id,2)"
                      >隐藏</v-btn>
                      <v-btn
                        color="cyan"
                        text
                        v-if="permission && post.status==2"
                        @click="setStatus(index,post.id,0)"
                      >取消隐藏</v-btn>
                      <!-- <v-btn color="error" v-if="permission" @click="setStatus(index,post.id,1)">删除</v-btn> -->

                      <v-spacer></v-spacer>
                      <v-btn icon @click="changeShow(index,post.show)">
                        <v-icon>{{ post.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>

                <v-expand-transition>
                  <div v-show="post.show">
                    <v-divider></v-divider>
                    <v-card-text>{{post.summary}}</v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-lazy>
          </v-col>

          <v-col cols="12" style="text-align: center;">
            <v-chip v-if="loading">加载中，请稍等...</v-chip>
            <v-btn
              v-else-if="!plateIsClosed"
              outlined
              :disabled="isLastPage"
              @click="getPostList(plateId)"
              :color="isLastPage?'gray':'orange'"
            >{{isLastPage?"没有更多了":"加载更多"}}</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import global from "../../assets/global";

export default {
  name: "PostsList",
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4"
      ],
      show: false,
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
      //plate
      plateId: "",
      plateIsClosed: false,
      //Post相关数据
      loading: false, //加载项
      postList: [],
      pageNum: 1, //分页当前页
      pageSize: 18,
      isLastPage: false,
      totalCount: 0
    };
  },
  computed: {
    permission: {
      get() {
        //未登录肯定没权限
        if (!sessionStorage.token) {
          return false;
        }
        //role >= 2代表用户为管理员及以上角色
        if (this.$store.state.role >= 2) return true;
        else if (this.$store.state.role == 1) {
          let plateIdList = this.$store.state.plateIds.split(",");
          let flag = false;
          plateIdList.forEach(item => {
            if (item == this.plateId) {
              flag = true;
            }
          });
          return flag;
        } else return false;
      },
      set() {}
    },
    hidden() {
      return function(post) {
        if (post.status != 2 || post.author == this.$store.state.token) {
          return true;
        } else {
          return false;
        }
      };
    }
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    }),
    toPostView(id) {
      this.$router.push({
        path: "post",
        query: {
          id: id
        }
      });
      this.setDrawer(false);
    },
    //获取页面数据
    getPostList(plateId) {
      this.loading = true;
      this.$api
        .getPostList({
          plateId: plateId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.data.code == 201) {
            this.plateIsClosed = true;
          } else if (res.data.code == 200) {
            this.plateIsClosed = false;
            this.isLastPage = res.data.data.isLastPage;
            if (!this.isLastPage) {
              this.pageNum++;
            }
            this.postList.push(...res.data.data.list);
            this.postList.forEach(item => {
              item.show = false;
            });
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeShow(index, show) {
      this.$forceUpdate();
      console.log(show);
      this.$set(this.postList[index], "show", !show);
    },
    setTop(index, id, isTop) {
      this.$api
        .editPost({
          id: id,
          isTop: isTop
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("成功！");
            this.postList[index].isTop = isTop;
          } else {
            console.log("失败！");
          }
        })
        .catch(err => {
          // this.$message.error("失败！");
          console.log(err);
        });
    },
    setStatus(index, id, status) {
      this.$api
        .editPost({
          id: id,
          status: status
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("成功！");
            this.postList[index].status = status;
          } else {
            console.log("失败！");
          }
        })
        .catch(err => {
          // this.$message.error("失败！");
          console.log(err);
        });
    }
  },
  mounted() {
    let path = this.$route.path;
    let index = global.plateList.findIndex(plate => plate.path === path);
    this.plateId = global.plateList[index].id;
    this.getPostList(this.plateId);
  }
};
</script>
