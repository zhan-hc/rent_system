<template>
  <div class='Data'>
    <collection></collection>
    <div class="export">
      <DatePicker type="daterange" v-model="OrderTime" :options="options" split-panels placeholder="起始日期" style="width:200px;margin-right:20px"></DatePicker>
      <Button type="primary" @click="exportData(1)">数据导出</Button>
    </div>
    <month-rent></month-rent>
    <supplier></supplier>
    <category-data></category-data>
  </div>
</template>

<script>
import Collection from './components/collection'
import MonthRent from './components/MonthRent'
import CategoryData from './components/CategoryData'
import Supplier from './components/Supplier'
import {exportExcel} from '../../assets/js/Export2Excel'
export default {
  name: 'Data',
  components: {
    Collection,
    MonthRent,
    CategoryData,
    Supplier
  },
  data () {
    return {
      OrderTime: null,
      tableData: [],
      options: {
        disabledDate (date) {
          return date && date.valueOf() >= new Date()
        }
      }
    }
  },
  mounted () {
    this.exportData(0)
  },
  methods: {
    exportData (num = 0) {
      this.$axios({
        method: 'get',
        url: `/order/getOrderData`,
        params: {
          startTime: this.OrderTime[0] ? this.moment(this.OrderTime[0]).format('YYYY-MM-DD') : null,
          endTime: this.OrderTime[1] ? this.moment(this.OrderTime[1]).format('YYYY-MM-DD') : null
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.tableData = res.data.data
          if (num === 1) this.exportToExcel()
        } else {
          this.tableData = []
        }
      })
    },
    exportToExcel () { // excel数据导出
      require.ensure([], () => {
        const tHeader = ['订单号', '礼服类别', '地址', '供应商', '创建时间']
        const filterVal = ['oid', 'category', 'address', 'supplier', 'createTime']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const start = this.OrderTime[0] ? this.moment(this.OrderTime[0]).format('YYYY-MM-DD') : ''
        const end = this.OrderTime[1] ? this.moment(this.OrderTime[1]).format('YYYY-MM-DD') : ''
        exportExcel(tHeader, data, `${start}———${end}订单数据`)
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
