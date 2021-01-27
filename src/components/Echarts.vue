<template>
  <div class='Echarts'>
    <div class="Echarts-list">
      <div class="list">
        <div class="item" v-for="item in numList" :key="item.id">
          <div class="item-text">{{item.text}}</div>
          <div class="item-num">{{item.num}}</div>
          <img :src="item.imgUrl" alt="">
        </div>
      </div>
      <div class="list-order">
        <div class="title">订单信息</div>
        <div class="orderlist">
          <div class="item" v-for="(item, i) in orderList" :key='i'>
            <div class="item-num">{{item.count}}</div>
            <div class="item-text">{{item.status}}</div>
          </div>
        </div>

      </div>
    </div>
    <div class='Echarts-category' ref="categorySale"></div>
    <div class='Echarts-month' ref="monthSale"></div>
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
        },
        {
          id: 1003,
          text: '订单数量',
          imgUrl: require('../assets/images/order.png'),
          num: 0
        }
      ],
      option: {
        title: {
          text: '礼服各种类的销量'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '礼服种类',
            type: 'pie',
            radius: '55%',
            selectedMode: 'single',
            data: [],
            label: {
              fontWeight: 'bold',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 18
              }
            }
          }
        ]
      },
      option1: {
        title: {
          text: '礼服的月租量'
        },
        tooltip: {},
        legend: {
          data: ['月租量']
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: [],
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  '#4169E1', '#FF7F50', '#3CB371', '#FFFF00'
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
      },
      orderList: []
    }
  },
  mounted () {
    this.getUser()
    this.getProduct()
    this.getOrderCategory()
    this.getOrder()
    this.getOrderMonth()
    this.getOrderStatus()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let categorySale = this.$echarts.init(this.$refs.categorySale)
      // 绘制图表
      categorySale.setOption(this.option)
    },
    drawLine1 () {
      let monthSale = this.$echarts.init(this.$refs.monthSale)
      monthSale.setOption(this.option1)
    },
    getOrderCategory () {
      this.$axios({
        method: 'get',
        url: `/order/getOrderCategory`
      }).then((res) => {
        if (res.data.status === 200) {
          this.option.series[0].data = res.data.data
          // this.option.xAxis.data = res.data.data.map(item => item.name)
          this.drawLine()
        }
      })
    },
    getOrderMonth () {
      this.$axios({
        method: 'get',
        url: `/order/getOrderMonth`
      }).then((res) => {
        if (res.data.status === 200) {
          this.option1.series[0].data = res.data.data.map(item => item.value)
          this.option1.xAxis.data = res.data.data.map(item => item.name)
          // this.option1.legend.data = res.data.data.map(item => item.name)
          this.drawLine1()
        }
      })
    },
    getUser () {
      this.$axios({
        method: 'get',
        url: '/user/userList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.numList[0].num = res.data.total
        }
      })
    },
    getProduct () {
      this.$axios({
        method: 'get',
        url: '/product/info/infoList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.numList[1].num = res.data.total
        }
      })
    },
    getOrder () {
      this.$axios({
        method: 'get',
        url: '/order/orderList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.numList[2].num = res.data.total
        }
      })
    },
    getOrderStatus () {
      this.$axios({
        method: 'get',
        url: '/order/getOrderStatus'
      }).then((res) => {
        if (res.data.status === 200) {
          this.orderList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Echarts{
  &-list{
    display: flex;
    .list{
      margin: 0 20px 20px;
      width: 200px;
      border: 2px solid #ccc;
      padding: 0 10px;
      box-sizing: border-box;
      .item{
        position: relative;
        width: 180px;
        padding: 5px;
        border-bottom: 2px solid #ccc;
        &:last-child{
          border-style: none;
        }
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
    .list-order{
      flex: 1;
      padding: 10px 20px;
      background: #202133;
      min-width: 400px;
      overflow: auto;
      color: #F5F5F5;
      height: 150px;
      .title{
        padding-left: 10px;
        border-left: 2px solid #FF8C00;
      }
      .orderlist{
        display: flex;
        margin: 10px 0;
        .item{
          flex: 1;
          text-align: center;
          &-num{
            color: #FF8C00;
            font-size: 24px;
          }
        }
      }
    }
  }
  &-category,&-month{
    display:inline-block;
    width: 600px;
    height:400px;
  }
}
</style>
