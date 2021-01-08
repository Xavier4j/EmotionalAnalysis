<template>
  <v-container>
    <div id="main1" style="width: 600px;height:400px;"></div>
  </v-container>
</template>

<script>
var echarts = require("echarts");

export default {
  name: "Message",
  data() {
    return {
      data1: ["小米", "华为", "苹果11", "vivo", "oppo", "三星"],
    };
  },
  methods: {
    getMessageList() {
      this.messageLoading = true;
      this.$api
        .getMessageList({
          receiver: this.token,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.messageList = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.messageLoading = false;
        });
    },
    initEmotional1Charts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "旗舰",
        },
        tooltip: {},
        xAxis: {
          data: this.data1,
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    },
  },
  mounted() {
    //this.getMessageList();
    this.initEmotional1Charts();
  },
};
</script>
