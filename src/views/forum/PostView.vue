<template>
  <v-container>
    <v-row class="mx-2 my-2">
      <p style="font-size:20px;word-wrap: break-word;margin:15px 0 ">{{title}}</p>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="8" md="5" lg="4" style="text-align:right">
        <v-btn
          class="mr-2 my-1"
          color="orange"
          text
          outlined
          v-if="permission && !isTop"
          @click="setTop(id,true)"
        >置顶</v-btn>
        <v-btn
          class="mr-2 my-1"
          color="orange"
          outlined
          v-if="permission && isTop"
          @click="setTop(id,false)"
        >取消置顶</v-btn>
        <v-btn
          class="mr-2 my-1"
          color="cyan"
          outlined
          v-if="permission && status==0"
          @click="setStatus(id,2)"
        >隐藏</v-btn>
        <v-btn
          class="mr-2 my-1"
          color="cyan"
          outlined
          v-if="permission && status==2"
          @click="setStatus(id,0)"
        >取消隐藏</v-btn>
        <v-btn
          class="mr-2 my-1"
          color="error"
          v-if="permission || isAuthor"
          @click="setStatus(id,1)"
        >删除</v-btn>
        <v-btn class="mr-2 my-1" outlined color="primary" v-if="isAuthor" @click="toEdit( )">编辑帖子</v-btn>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-row class="ma-3">
      <v-chip color="cyan" outlined @click="toProfileView(author)">作者:{{authorProfile.nickname}}</v-chip>
      <v-spacer></v-spacer>
      <v-chip class="mr-3" color="primary" outlined>阅读人数:{{readNum}}</v-chip>
      <v-chip color="orange" outlined>评论:{{commentNum}}</v-chip>
    </v-row>
    <v-card class="my-3" style="background:none" flat>
      <mavon-editor
        v-model="content"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        codeStyle="vs2015"
        style="z-index: 1"
      />
    </v-card>
    <v-card class="my-3" flat>
      <v-textarea
        ref="textarea"
        v-model="comment"
        :label="commentLable"
        color="orange"
        hide-details
        auto-grow
        outlined
        row-height="25"
        @focus="comentBtnHidden = false"
      ></v-textarea>
      <v-row class="mx-1 my-2">
        <v-spacer></v-spacer>
        <v-btn
          class="mr-3 text-capitalize"
          color="secondary"
          v-if="isReply"
          outlined
          dark
          @click="cancleReply( )"
        >取消回复</v-btn>
        <v-btn
          color="orange"
          v-if="!comentBtnHidden"
          outlined
          class="text-capitalize"
          dark
          @click="handle( )"
        >发表评论</v-btn>
      </v-row>
    </v-card>
    <v-card class="my-3" flat>
      <v-card-title>评论列表：</v-card-title>
      <v-card flat v-for="(comment,index) in commentList" :key="index" class="my-2">
        <v-card-text>
          <v-row class="mb-4" align="center">
            <v-avatar color="grey" size="40px" class="mx-2">
              <v-img :src="comment.reviewerProfile.avatar" />
            </v-avatar>
            <span
              class="mr-2"
              style="font-size:18px;color:#000"
            >{{comment.reviewerProfile.nickname}}</span>
            <span class="ml-3" style="font-size:10px">{{comment.createTime | DateFormat}}</span>
            <v-chip class="ml-3" small label v-if="comment.isTop" color="red" text-color="white">置顶</v-chip>
            <v-spacer></v-spacer>
            <v-btn
              small
              text
              color="error"
              @click="beforeUpdateUser(comment.reviewerId,1)"
              v-if="permission"
            >禁言用户</v-btn>
            <v-btn
              small
              text
              color="orange"
              @click="stickComment(comment.id,true)"
              v-if="!comment.isTop && permission"
            >置顶</v-btn>
            <v-btn
              small
              text
              color="orange"
              @click="stickComment(comment.id,false)"
              v-else-if="permission"
            >取消置顶</v-btn>
            <v-btn
              small
              text
              color="primary"
              @click="beforeReply(comment.id,comment.reviewerProfile.nickname,comment.reviewerId)"
            >回复</v-btn>
            <v-btn
              small
              text
              color="red"
              @click="deleteComment(comment.id)"
              v-if="permission || isAuthor"
            >删除</v-btn>
          </v-row>
          <p class="ml-11">{{comment.content}}</p>
          <v-divider></v-divider>
          <v-card flat v-for="(reply,index) in comment.replyList" :key="index" class="my-2 ml-11">
            <v-card-text class="pa-0">
              <v-row class="mb-4" align="center">
                <v-avatar color="grey" size="40px" class="mx-2">
                  <v-img :src="reply.reviewerProfile.avatar" />
                </v-avatar>
                <span
                  class="mr-2"
                  style="font-size:18px;color:#454545"
                >{{reply.reviewerProfile.nickname}}</span>
                <span class="ml-3" style="font-size:10px">{{reply.createTime | DateFormat}}</span>
                <v-spacer></v-spacer>
                <v-btn
                  small
                  text
                  color="error"
                  @click="beforeUpdateUser(comment.reviewerId,1)"
                  v-if="permission"
                >禁言用户</v-btn>
                <v-btn
                  small
                  text
                  color="primary"
                  @click="beforeBeforeReply(comment.id,reply.reviewerProfile.nickname,reply.reviewerId)"
                >回复</v-btn>
                <v-btn
                  small
                  text
                  color="red"
                  @click="deleteReply(reply.id)"
                  v-if="permission || isAuthor"
                >删除</v-btn>
              </v-row>
              <p>{{reply.content}}</p>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-card>
    <!-- 分页 -->
    <div class="text-center my-3">
      <v-pagination v-model="pageNum" :length="pages" total-visible="10" @input="changePage"></v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">选择截止时间</v-card-title>
        <v-row class="mx-5" justify="center">
          <v-col cols="12">
            <v-radio-group class="my-1" v-model="time">
              <v-radio
                v-for="(time,index) in timeList"
                :key="index"
                :label="time.label"
                :value="time.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="commit()">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment/moment";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/highlightjs/highlight.min.js";
import Vue from "vue";
import global from "../../assets/global";
// use
Vue.use(mavonEditor);

export default {
  name: "PostView",
  data() {
    return {
      //帖子信息
      id: "",
      title: "",
      author: "",
      summary: "",
      commentNum: "",
      content: "",
      createTime: "",
      plateId: "",
      isTop: "",
      status: "",
      likeNum: "",
      readNum: "",
      updateTime: "",
      authorProfile: "",
      //评论列表
      commentList: "",
      //评论
      commentLable: "评论一下",
      comment: "",
      comentBtnHidden: true,
      //回复
      isReply: false,
      recipient: "",
      recipientId: "",
      commentId: "",
      //禁言
      dialog: false,
      time: "",
      timeList: [
        {
          label: "1分钟",
          value: 1
        },
        {
          label: "十分钟",
          value: 10
        },
        {
          label: "半小时",
          value: 30
        },
        {
          label: "1小时",
          value: 60
        },
        {
          label: "1天",
          value: 60 * 24
        },
        {
          label: "永久",
          value: 60 * 24 * 365 * 79
        }
      ],
      form: {
        id: "",
        deadline: "",
        status: ""
      },
      //评论分页
      pageNum: 1,
      pageSize: 10,
      //总页数
      pages: 0
    };
  },
  computed: {
    isAuthor: function() {
      if (this.author == sessionStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },
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
    }
  },
  methods: {
    toEdit() {
      this.$router.push({
        path: "edit",
        query: {
          id: this.id
        }
      });
    },
    getPostContent(id) {
      this.commentsLoading = true;
      this.$api
        .getPostContent({ postId: id })
        .then(res => {
          if (res.data.code == 200) {
            let postData = res.data.data;
            this.id = postData.id;
            this.title = postData.title;
            this.author = postData.author;
            this.summary = postData.summary;
            this.commentNum = postData.commentNum;
            this.content = postData.content;
            this.createTime = postData.createTime;
            this.plateId = postData.plateId;
            this.isTop = postData.isTop;
            this.status = postData.status;
            this.likeNum = postData.likeNum;
            this.readNum = postData.readNum;
            this.updateTime = postData.updateTime;
            this.authorProfile = postData.authorProfile;
          } else {
            this.$message.error("博客加载失败，请稍后重试！");
          }
        })
        .catch(err => {
          this.$message.error("博客加载失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.contentLoading = false;
          }, 200);
        });
    },
    getPostCommentList(id) {
      this.commentsLoading = true;
      this.$api
        .getPostCommentList({
          postId: id,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.data.code == 200) {
            this.commentList = res.data.data.list;
            this.pages = res.data.data.pages;
          } else {
            console.log("评论信息加载失败，请稍后重试！");
          }
        })
        .catch(err => {
          console.log("评论信息加载失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    beforeUpdateUser(userId, status) {
      this.form.id = userId;
      this.form.status = status;
      this.dialog = true;
    },
    commit() {
      this.form.deadline = moment()
        .add(this.time, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      console.log(this.form.deadline);
      this.updateUser();
    },
    updateUser() {
      this.$api
        .updateUser(this.form)
        .then(res => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top"
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
          console.log("修改失败！");
          console.log(err);
        })
        .finally(() => {
          this.dialog = false;
        });
    },
    setTop(id, isTop) {
      this.$api
        .editPost({
          id: id,
          isTop: isTop
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("成功！");
            this.isTop = isTop;
          } else {
            console.log("失败！");
          }
        })
        .catch(err => {
          // this.$message.error("失败！");
          console.log(err);
        });
    },
    setStatus(id, status) {
      this.$api
        .editPost({
          id: id,
          status: status
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("成功！");
            this.status = status;
            let index = global.plateList.findIndex(
              plate => plate.id === this.plateId
            );
            console.log(index);
            if (status == 1) {
              this.$router.push({
                path: global.plateList[index].path
              });
            }
          } else {
            console.log("失败！");
          }
        })
        .catch(err => {
          // this.$message.error("失败！");
          console.log(err);
        });
    },
    handle() {
      if (this.isReply) {
        this.sendReply();
      } else {
        this.sendComment();
      }
    },
    sendComment() {
      if (this.comment == null || this.comment.length == 0) {
        return;
      }
      console.log("需要登录");
      if (!sessionStorage.token) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
        return;
      }
      this.$api
        .sendComment({
          postId: this.id,
          reviewerId: sessionStorage.getItem("token"),
          content: this.comment
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("评论成功！");
            this.comment = "";
            this.getPostCommentList(this.id);
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
          console.log("评论失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    stickComment(id, isTop) {
      this.$api
        .stickComment({
          commentId: id,
          isTop: isTop
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top"
            });
            this.getPostCommentList(this.id);
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
          console.log("置顶失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {});
    },
    deleteComment(id) {
      this.$api
        .deleteComment({
          commentId: id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top"
            });
            this.getPostCommentList(this.id);
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
          console.log("删除失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {});
    },
    beforeReply(commentId, recipient, recipientId) {
      this.commentLable = "回复：" + recipient;
      this.commentId = commentId;
      this.recipient = recipient;
      this.recipientId = recipientId;
      console.log(this.recipientId);
      this.isReply = true;
      this.$refs.textarea.focus();
    },
    cancleReply() {
      this.commentLable = "评论一下";
      this.comment = "";
      this.isReply = false;
    },
    //楼中楼回复处理
    beforeBeforeReply(commentId, recipient, recipientId) {
      this.comment = "@" + recipient + " ";
      this.beforeReply(commentId, recipient, recipientId);
    },
    sendReply() {
      if (this.comment == null || this.comment.length == 0) {
        return;
      }
      console.log("需要登录");
      if (!sessionStorage.token) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
        return;
      }
      this.$api
        .sendReply({
          postId: this.id,
          commentId: this.commentId,
          reviewerId: sessionStorage.getItem("token"),
          recipientId: this.recipientId,
          content: this.comment
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("回复成功！");
            this.comment = "";
            this.getPostCommentList(this.id);
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
          console.log("回复失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    deleteReply(id) {
      this.$api
        .deleteReply({
          replyId: id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top"
            });
            this.getPostCommentList(this.id);
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
          console.log("删除失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {});
    },
    changePage(page) {
      console.log(page);
      this.getPostCommentList(this.id);
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getPostContent(this.id);
    this.getPostCommentList(this.id);
  }
};
</script>