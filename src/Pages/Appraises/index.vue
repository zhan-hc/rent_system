<template>
  <div class="Order">
    <InputNumber type="text" v-model="uid" style="width:100px;margin-right:20px" placeholder="用户id查询"/>
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
          title: 'id',
          key: 'id'
        },
        {
          title: '订单号',
          key: 'oid'
        },
        {
          title: '产品号',
          key: 'pid'
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('div', this.moment(params.row.createTime).format('YYYY-MM-DD hh:mm:ss'))
          }
        },
        {
          title: '评价内容',
          key: 'text'
        }
      ],
      uid: null,
      data: [],
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
        url: `/appraises/appraisesList`,
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize
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
    // 删除尺寸
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
