<template>
  <div class='MonthRent' ref="monthSale"></div>
</template>

<script>
export default {
  data () {
    return {
      option: {
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
                  '#4169E1', '#FF7F50', '#3CB371', '#DC143C'
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
      tableData: []
    }
  },
  mounted () {
    this.getOrderMonth()
  },
  methods: {
    drawLine () {
      let monthSale = this.$echarts.init(this.$refs.monthSale)
      monthSale.setOption(this.option)
    },
    getOrderMonth () {
      this.$axios({
        method: 'get',
        url: `/order/getOrderMonth`
      }).then((res) => {
        if (res.data.status === 200) {
          this.option.series[0].data = res.data.data.map(item => item.value)
          this.option.xAxis.data = res.data.data.map(item => item.name)
          this.tableData = res.data.data
          this.drawLine()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.MonthRent{
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  margin: 10px 2% 0 0;
  display:inline-block;
  width: 48%;
  height:400px;
}
</style>
