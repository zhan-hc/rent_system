<template>
  <div class="Stock">
    <Table border max-height="500" align="center" :columns="columns" :data="data" class="Stock-table"></Table>
    <Page :total="total" @on-change="changePage"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: '礼服id',
          key: 'pid'
        },
        {
          title: '尺码id',
          key: 'sid'
        },
        {
          title: '颜色id',
          key: 'cid'
        },
        {
          title: '库存',
          key: 'stock'
        }
      ],
      data: [],
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.stockList()
  },
  methods: {
    stockList () {
      this.$axios({
        method: 'get',
        url: `/api/product/stock/stockList/${this.pageNo}/${this.pageSize}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.stockList()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Stock{
  &-table{
    margin-bottom: 20px;
  }
}
</style>
