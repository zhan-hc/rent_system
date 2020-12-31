<template>
  <div class='Echarts'>
    <div class="list">
      <div class="item" v-for="item in numList" :key="item.id">
        <div class="item-text">{{item.text}}</div>
        <div class="item-num">{{item.num}}</div>
        <img :src="item.imgUrl" alt="">
      </div>
    </div>
    <div id='main' ref="myChart" style='width: 600px;height:400px;'></div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      numList: [
        {
          id: 1001,
          text: '用户数量',
          imgUrl: require('../assets/images/user.png'),
          num: 0
        },
        {
          id: 1002,
          text: '产品数量',
          imgUrl: require('../assets/images/cloth.png'),
          num: 0
        }
      ],
      option: {
        title: {
          text: '礼服各种类的销量'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '礼服种类销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                  // '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  // '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ]
                return colorList[params.dataIndex]
              },
              label: { // 以下为是否显示，显示位置和显示格式的设置了
                show: true,
                position: 'top',
                formatter: '{c}'
              }
            }
          }
        }]
      }
    }
  },
  mounted () {
    this.getUser()
    this.getProduct()
    this.getOrderCategory()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.myChart)
      // 绘制图表
      myChart.setOption(this.option)
    },
    getOrderCategory () {
      this.$axios({
        method: 'get',
        url: `//order/getOrderCategory`
      }).then((res) => {
        if (res.data.status === 200) {
          this.option.series[0].data = res.data.data.map(item => item.value)
          this.option.xAxis.data = res.data.data.map(item => item.name)
          this.drawLine()
        }
      })
    },
    getUser () {
      this.$axios({
        method: 'get',
        url: '//user/userList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.numList[0].num = res.data.total
        }
      })
    },
    getProduct () {
      this.$axios({
        method: 'get',
        url: '//product/info/infoList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.numList[1].num = res.data.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Echarts{
  .list{
    margin: 0 20px 20px;
    .item{
      position: relative;
      display: inline-block;
      margin-right: 20px;
      width: 170px;
      padding: 5px;
      border-radius: 5px;
      border: 2px solid #ccc;
      &-num{
        font-size: 20px;
        font-weight: bold;
      }
      img{
        position: absolute;
        right: 5px;
        bottom: 5px;
        widows: 50px;
        height: 50px;
      }
    }
  }
}
</style>
