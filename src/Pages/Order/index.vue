<template>
  <div class="Order">
    <InputNumber type="text" v-model="uid" style="width:100px;margin-right:20px" placeholder="用户id查询"/>
    <InputNumber type="text" v-model="oid" style="width:150px;margin-right:20px" placeholder="订单号查询"/>
    <DatePicker type="daterange" v-model="OrderTime" split-panels placeholder="订单日期" style="width:200px;margin-right:20px"></DatePicker>
    <Button type="primary" @click="orderList">搜索</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="Order-table"></Table>
    <Page :total="total" @on-change="changePage"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '订单号',
          key: 'oid'
        },
        {
          title: '用户id',
          key: 'uid'
        },
        {
          title: '租期开始时间',
          render: (h, params) => {
            return h('div', this.moment(params.row.startTime).format('YYYY-MM-DD'))
          }
        },
        {
          title: '租期结束时间',
          render: (h, params) => {
            return h('div', this.moment(params.row.endTime).format('YYYY-MM-DD'))
          }
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('div', this.moment(params.row.createTime).format('YYYY-MM-DD hh:mm:ss'))
          }
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '收件人',
          key: 'addressee'
        },
        {
          title: '收件人号码',
          key: 'mobile'
        },
        {
          title: '总金额',
          key: 'amount'
        },
        {
          title: '订单状态',
          render: (h, params) => {
            var status = ''
            if (params.row.status === 0) status = '未确认收货'
            else if (params.row.status === 1) status = '已收货未评价'
            else status = '评价完成'
            return h('div', status)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.deleteOrder(params.row.oid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      uid: null,
      oid: null,
      data: [],
      OrderTime: null,
      total: 0,
      pageNo: 1,
      pageSize: 10

    }
  },
  mounted () {
    this.orderList()
  },
  methods: {
    orderList () {
      this.$axios({
        method: 'get',
        url: `/order/orderList`,
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          uid: this.uid || null,
          oid: this.oid || null,
          startTime: this.OrderTime[0] ? this.moment(this.OrderTime[0]).format('YYYY-MM-DD') : null,
          endTime: this.OrderTime[1] ? this.moment(this.OrderTime[1]).format('YYYY-MM-DD') : null
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.data = []
        }
      })
    },
    // 删除订单
    deleteOrder (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/order/deleteOrder/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.orderList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.orderList()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Order{
  &-table{
    margin: 20px 0;
  }
}
</style>
