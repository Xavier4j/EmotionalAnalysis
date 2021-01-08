<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="5">
        <v-select
          v-model="phone"
          solo
          :items="phoneList"
          item-text="title"
          item-value="value"
          label="型号选择"
        ></v-select>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" md="5">
        <v-menu
          v-model="datePicker1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="start"
              label="Start"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="start"
            @input="datePicker1 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="5">
        <v-menu
          v-model="datePicker2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="end"
              label="End"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="end"
            @input="datePicker2 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="2">
        <v-btn color="success" class="mb-3" @click="analysis">分析</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-chip class="my-3" color="orange" label text-color="white"
          >手机销量：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="sentitiveLoading"
          style="background:none"
        >
          <div class="pa-2" id="sentitive-chart"></div>
        </v-card>
      </v-col>
      <v-col cols="12" v-show="false">
        <v-chip class="my-3" color="orange" label text-color="white"
          >论坛热点：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="keywordLoading"
          style="background:none"
        >
          <div class="ma-5" id="keyword-chart"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-show="false">
        <v-chip class="my-3" color="orange" label text-color="white"
          >手机卖点（用户最喜欢的）：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="topicLoading1"
          style="background:none"
        >
          <div class="ma-5" id="topic-chart1"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-show="false">
        <v-chip class="my-3" color="orange" label text-color="white"
          >手机缺点：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="topicLoading2"
          style="background:none"
        >
          <div class="ma-5" id="topic-chart2"></div>
        </v-card>
      </v-col>
    </v-row>
    <div id="main1" style="width: 1500px;height:600px;"></div>
  </v-container>
</template>

<script>
var echarts = require("echarts");

import moment from "moment/moment";
import { Chart } from "@antv/g2";
export default {
  name: "Home",
  data() {
    return {
      phoneList: [
        "HUAWEI P40",
        "HUAWEI Mate40",
        "iPhone 11",
        "OPPO Reno5",
        "VIVO IQOO Z1",
        "VIVO NEX3",
        "XIAOMI 10",
      ],
      phone: "",
      datePicker1: false,
      datePicker2: false,
      start: moment()
        .subtract(6, "month")
        .subtract(37, "days")
        .format("YYYY-MM-DD"),
      end: moment()
        .subtract(8, "days")
        .format("YYYY-MM-DD"),

      hotPostLoading: false,
      sentitiveLoading: false,
      keywordLoading: false,
      topicLoading1: false,
      topicLoading2: false,
      negativeLoading: false,

      hotPostList: [],
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
        "😍",
      ],
      sentitiveAnalysisList: [],
      sentitiveAnalysisList1: [
        {
          date: "2020-06",
          value: 9390,
        },
        {
          date: "2020-07",
          value: 29580,
        },
        {
          date: "2020-08",
          value: 13302,
        },
        {
          date: "2020-09",
          value: 29580,
        },
        {
          date: "2020-10",
          value: 8717,
        },
        {
          date: "2020-11",
          value: 36899,
        },
        {
          date: "2020-12",
          value: 19832,
        },
      ],
      sentitiveAnalysisList2: [
        {
          date: "2020-06",
          value: 0,
        },
        {
          date: "2020-07",
          value: 0,
        },
        {
          date: "2020-08",
          value: 0,
        },
        {
          date: "2020-09",
          value: 0,
        },
        {
          date: "2020-10",
          value: 0,
        },
        {
          date: "2020-11",
          value: 0,
        },
        {
          date: "2020-12",
          value: 0,
        },
      ],
      lv1TagList: [
        { tag: "汽车", score: 34 },
        { tag: "建材家居", score: 85 },
        { tag: "住宿旅游", score: 103 },
        { tag: "交通运输与仓储邮政", score: 142 },
        { tag: "建筑房地产", score: 251 },
        { tag: "教育", score: 367 },
        { tag: "IT 通讯电子", score: 491 },
        { tag: "社会公共管理", score: 672 },
        { tag: "医疗卫生", score: 868 },
        { tag: "金融保险", score: 1234 },
      ],
      lv2TagList: [
        { tag: "价格略高", score: 34 },
        { tag: "建材家居", score: 85 },
        { tag: "住宿旅游", score: 103 },
        { tag: "交通运输与仓储邮政", score: 142 },
        { tag: "建筑房地产", score: 251 },
        { tag: "教育", score: 367 },
        { tag: "IT 通讯电子", score: 491 },
        { tag: "社会公共管理", score: 672 },
        { tag: "医疗卫生", score: 868 },
        { tag: "金融保险", score: 1234 },
      ],
      topicAnalysisList: [],
      KeywordAnalysisList: [],
      negativeAnalysisList: [],
    };
  },
  methods: {
    analysis() {
      if (!this.phone) {
        this.$toast({
          color: "error",
          mode: "",
          snackbar: true,
          text: "请选择手机型号！",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        return;
      }
      this.getSentitiveAnalysis();
      // this.getHotPostList();
      this.getTopicAnalysis();
      this.loadChart1();
      // this.getKeywordAnalysis();
      // this.getNegativeAnalysis();
    },
    toView(id) {
      const { href } = this.$router.resolve({
        path: `/post`,
        query: {
          id: id,
        },
      });
      window.open(href, "_blank");
    },
    getSentitiveAnalysis() {
      this.sentitiveLoading = true;
      this.$api
        .getSentitiveAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            if (this.phone == "HUAWEI P40") {
              this.sentitiveAnalysisList = this.sentitiveAnalysisList1;
            } else {
              this.sentitiveAnalysisList = this.sentitiveAnalysisList2;
            }
            this.renderSentitiveChart(
              this.sentitiveChart,
              this.sentitiveAnalysisList,
              "#f0657d"
            );
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.sentitiveLoading = false;
        });
    },
    getTopicAnalysis() {
      console.log(111);
      this.topicLoading1 = true;
      this.topicLoading2 = true;
      this.renderTagChart(this.topicChart1, this.lv1TagList, "#009688");
      this.renderTagChart(this.topicChart2, this.lv2TagList, "#F44336");
      this.topicLoading1 = false;
      this.topicLoading2 = false;
    },
    getKeywordAnalysis() {
      this.keywordLoading = true;
      this.$api
        .getKeywordAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.KeywordAnalysisList = res.data.data;
            this.renderTagChart(
              this.keywordChart,
              this.KeywordAnalysisList,
              "#E91E63"
            );
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.keywordLoading = false;
        });
    },
    getNegativeAnalysis() {
      this.negativeLoading = true;
      this.$api
        .getNegativeAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.negativeAnalysisList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.negativeLoading = false;
        });
    },
    renderSentitiveChart(chart, data, color) {
      chart.data(data);
      chart.scale({
        date: {
          range: [0, 1],
        },
        value: {
          min: 0,
          nice: true,
        },
      });
      chart.tooltip({
        showMarkers: false,
      });
      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
      });
      chart
        .line()
        .position("date*value")
        .label("value")
        .color(color);
      chart.point().position("date*value");

      chart.render();
    },
    renderTagChart(chart, data, color) {
      chart.data(data);
      chart.scale("score", { nice: true });
      chart.coordinate().transpose();
      chart.tooltip({
        showMarkers: false,
      });
      chart.interaction("active-region");
      chart
        .interval()
        .position("tag*score")
        .color(color);
      chart.render();

      chart.on("element:click", (ev) => {
        this.$router.push({
          path: "post",
          query: {
            keyword: ev.data.data.tag,
          },
        });
      });
    },
    loadChart1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "华为P40用户关注点",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          top: "bottom",
          data: ["拍照", "续航", "外观", "性能", "屏幕", "性价比"],
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"],
            },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            type: "pie",
            radius: [30, 110],
            center: ["50%", "50%"],
            roseType: "area",
            data: [
              { value: 35, name: "拍照" },
              { value: 5, name: "续航" },
              { value: 15, name: "外观" },
              { value: 25, name: "性能" },
              { value: 20, name: "屏幕" },
              { value: 10, name: "性价比" },
            ],
          },
        ],
      });
    },
  },
  mounted() {
    this.sentitiveChart = new Chart({
      container: "sentitive-chart",
      autoFit: true,
      height: 500,
    });
    this.topicChart1 = new Chart({
      container: "topic-chart1",
      autoFit: true,
      height: 500,
    });
    this.topicChart2 = new Chart({
      container: "topic-chart2",
      autoFit: true,
      height: 500,
    });
    this.keywordChart = new Chart({
      container: "keyword-chart", // 指定图表容器 ID
      autoFit: true,
      height: 500, // 指定图表高度
    });
  },
};
</script>
