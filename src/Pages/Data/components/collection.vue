<template>
  <div class='Collection'>
    <div class="Collection-select">
      交易时间：
      <RadioGroup type="button" v-model="time"  @on-change="handleChange">
          <Radio :label="1">今日</Radio>
          <Radio :label="2">近7天</Radio>
          <Radio :label="3">近30天</Radio>
          <Radio :label="0">所有</Radio>
      </RadioGroup>
    </div>
    <div class="Collection-list">
      <div class="title">收款指标</div>
      <div class="orderlist">
        <div class="item">
          <div class="item-num">{{count}}</div>
          <div class="item-text">成交订单</div>
        </div>
        <div class="item">
          <div class="item-num">￥{{amount ? amount.toFixed(2) : 0}}</div>
          <div class="item-text">订单收款</div>
        </div>
        <div class="item">
          <div class="item-num">￥{{price ? price.toFixed(2) : 0}}</div>
          <div class="item-text">客单价</div>
        </div>
      </div>
    </div>
    <div class="Collection-OrderStatus">
      <div class="title">订单指标</div>
      <div class="orderlist">
        <div class="item" v-for="(item, i) in orderList" :key='i'>
          <div class="item-num">{{item.count}}</div>
          <div class="item-text">{{item.status}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collection',
  data () {
    return {
      count: 0,
      amount: 0,
      price: 0,
      time: 0,
      orderList: []
    }
  },
  mounted () {
    this.getOrderAmount()
    this.getOrderStatus()
  },
  methods: {
    handleChange () {
      this.getOrderStatus()
      this.getOrderAmount()
    },
    getOrderStatus () {
      this.$axios({
        method: 'get',
        url: '/order/getOrderStatus',
        params: {
          time: this.time
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.orderList = res.data.data
        }
      })
    },
    getOrderAmount () {
      this.$axios({
        method: 'get',
        url: '/order/getOrderAmount',
        params: {
          time: this.time
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.count = res.data.data[0].count
          this.amount = res.data.data[0].sum
          this.price = res.data.data[0].price
        } else {
          this.count = 0
          this.amount = 0
          this.price = 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Collection{
  &-select{
    margin-bottom: 20px;
  }
  &-OrderStatus,&-list{
    background: #fff;
    padding: 10px 20px;
    min-width: 400px;
    overflow: auto;
    height: 150px;
    margin-bottom: 20px;
    .title{
      padding-left: 10px;
      border-left: 4px solid #FF8C00;
    }
    .orderlist{
      display: flex;
      margin: 10px 0;
      .item{
        flex: 1;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        &-num{
          color: #FF8C00;
          font-size: 28px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
