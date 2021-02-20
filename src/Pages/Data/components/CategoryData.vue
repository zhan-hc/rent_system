<template>
  <div class="CategoryData">
    <div class='CategoryData-count' ref="categorySale"></div>
    <div class='CategoryData-week' ref="weekSale"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
              normal: {
                formatter: '{b}: ({d}%)',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 18
                }
              }
            }
          }
        ]
      },
      weekOption: {
        title: {
          text: '礼服近七日销量'
        },
        color: ['#4169E1', '#FF7F50', '#3CB371', '#DC143C'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['近一天', '近二天', '近三天', '近四天', '近五天', '近六天', '近七天']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '',
            type: 'line',
            data: []
          },
          {
            name: '',
            type: 'line',
            data: []
          },
          {
            name: '',
            type: 'line',
            data: []
          },
          {
            name: '',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.getOrderCategory()
  },
  methods: {
    drawLine () {
      let categorySale = this.$echarts.init(this.$refs.categorySale)
      categorySale.setOption(this.option)
    },
    WeekdrawLine () {
      let monthSale = this.$echarts.init(this.$refs.weekSale)
      monthSale.setOption(this.weekOption)
    },
    getOrderCategory () {
      this.$axios({
        method: 'get',
        url: `/order/getOrderCategory`
      }).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data
          this.option.series[0].data = data // 饼图赋值
          this.weekOption.legend.data = data.map(item => item.name)
          let cid = data.map(item => item.cid)
          this.drawLine()
          for (let i = 0; i < data.length; i++) {
            this.weekOption.series[i].name = this.weekOption.legend.data[i] // 折线图赋值种类name
            this.getOrderWeek(cid[i], i)
          }
        }
      })
    },
    getOrderWeek (cid, i) {
      this.$axios({
        method: 'get',
        url: `/order/getOrderWeekCategory`,
        params: {
          cid: cid
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.weekOption.series[i].data = res.data.data.map(item => item.count)
          this.WeekdrawLine()
        } else {
          console.log('error')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.CategoryData{
  display:inline-block;
  width: 100%;
  &-count,&-week{
    box-sizing: border-box;
    padding: 20px;
    border-radius: 10px;
    background: #fff;
    display:inline-block;
    width: 48%;
    height:400px;
  }
  &-count{
    margin: 20px 2% 0 0;
  }
}
</style>
