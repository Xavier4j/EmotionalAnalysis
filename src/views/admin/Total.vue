<template>
  <v-container>
    <div id="main1" style="width: 1200px;height:400px;"></div>
    <div id="main2" style="width: 1200px;height:400px;"></div>
    <div id="main3" style="width: 1200px;height:400px;"></div>
    <div id="main4" style="width: 1200px;height:400px;"></div>
  </v-container>
</template>

<script>
var echarts = require("echarts");

import moment from "moment/moment";
export default {
  name: "Total",
  data() {
    return {
      phoneList: [
        "HUAWEI Mate40",
        "HUAWEI P40",
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
        .subtract(13, "days")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),

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
      topicAnalysisList: [],
      KeywordAnalysisList: [],
      negativeAnalysisList: [],
    };
  },
  methods: {
    loadChart1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "手机满意度",
        },
        xAxis: {
          type: "category",
          data: [
            "小米10",
            "iphone11",
            "华为P40",
            "华为Mate40",
            "OppoReno4",
            "VivoNex3",
          ],
          name: "手机品牌",
        },
        yAxis: {
          type: "value",
          min: 80,
          max: 100,
          axisLabel: {
            formatter: "{value} %",
          },
          name: "满意度",
        },

        series: [
          {
            data: [92, 95.6, 95, 97, 96, 94],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)",
            },
          },
        ],
      });
    },
    loadChart2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main2"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "价格-满意度关系",
        },
        xAxis: {
          type: "category",
          name: "价格",
        },
        yAxis: {
          type: "value",
          min: 80,
          max: 100,
          axisLabel: {
            formatter: "{value} %",
          },
          name: "满意度",
        },
        series: [
          {
            data: [92, 94, 95, 97, 96, 95.6],
            type: "line",
          },
        ],
      });
    },
    loadChart3() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main3"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "不同手机用户痛点图",
        },
        legend: {
          data: ["小米10", "iphone11", "华为p40", "vivoNex3", "oppoReno3"],
        },
        radar: [
          {
            indicator: [
              { text: "拍照" },
              { text: "性价比" },
              { text: "性能" },
              { text: "续航" },
              { text: "屏幕" },
              { text: "外观" },
            ],
            center: ["50%", "50%"],
            radius: 120,
            startAngle: 90,
            splitNumber: 4,
            shape: "circle",
            name: {
              formatter: "【{value}】",
              textStyle: {
                color: "#72ACD1",
              },
            },
            splitArea: {
              areaStyle: {
                color: [
                  "rgba(114, 172, 209, 0.2)",
                  "rgba(114, 172, 209, 0.4)",
                  "rgba(114, 172, 209, 0.6)",
                  "rgba(114, 172, 209, 0.8)",
                  "rgba(114, 172, 209, 1)",
                ],
                shadowColor: "rgba(0, 0, 0, 0.3)",
                shadowBlur: 10,
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.5)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.5)",
              },
            },
          },
        ],
        series: [
          {
            name: "雷达图",
            type: "radar",
            emphasis: {
              lineStyle: {
                width: 4,
              },
            },
            data: [
              {
                value: [80, 85, 75, 90, 90, 85],
                name: "小米10",
                symbol: "rect",
                symbolSize: 5,
                lineStyle: {
                  type: "dashed",
                },
              },
              {
                value: [75, 70, 90, 90, 87, 76],
                name: "iphone11",
                areaStyle: {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
              {
                value: [90, 75, 83, 85, 80, 87],
                name: "华为p40",
                areaStyle: {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
              {
                value: [85, 75, 80, 90, 75, 86],
                name: "vivoNex3",
                areaStyle: {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
              {
                value: [80, 85, 90, 80, 86, 75],
                name: "oppoReno3",
                areaStyle: {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              },
            ],
          },
        ],
      });
    },
  },
  mounted() {
    this.loadChart1();
    this.loadChart2();
    this.loadChart3();
  },
};
</script>
