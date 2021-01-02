<template>
  <v-container>
    <v-alert outlined color="orange" border="left" v-if="role!=1">你还不是版主！</v-alert>
    <v-alert outlined color="success" border="left" v-else>你目前是“{{plateIds | plateFilter}}”版主</v-alert>
    <v-select
      v-model="selectPlate"
      :items="plateList"
      item-text="title"
      item-value="id"
      label="选择板块"
      required
    ></v-select>
    <v-textarea v-model="reason" label="申请理由" placeholder="请填写申请理由"></v-textarea>
    <v-row style="text-align:right">
      <v-col>
        <v-btn class="mr-4" color="primary" @click="submit">提交申请</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import global from "../../assets/global";

export default {
  name: "Moderator",
  data() {
    return {
      selectPlate: "",
      reason: "我想申请一下，望老师同意",
      plateList: []
    };
  },
  computed: {
    ...mapState(["role", "token", "plateIds"])
  },
  methods: {
    submit() {
      this.$api
        .sendApply({
          applicant: this.token,
          plateId: this.selectPlate,
          reason: this.reason
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: "申请提交成功",
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
          console.log("申请提交失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {});
    }
  },
  filters: {
    plateFilter(value) {
      let plateIds = value;
      let plateIdList = plateIds.split(",");
      let plateList = [];
      plateIdList.forEach(item => {
        plateList.push(global.plateList[item].title);
        // this.plateList.splice(item, 1);
      });

      return plateList.join(",");
    }
  },
  mounted() {
    this.plateList = JSON.parse(JSON.stringify(global.plateList1));
    let that = this;
    let plateIds = this.plateIds.split(",");
    //数组逆序，否则删除时会出现问题
    plateIds.sort();
    plateIds.reverse();
    plateIds.forEach(item => {
      console.log(item);
      that.plateList.splice(item - 1, 1);
    });
    // console.log(that.plateList);
  }
};
</script>
