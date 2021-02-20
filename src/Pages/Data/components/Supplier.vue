<template>
  <div class="Suppier">
    <div class='Suppier-order' ref="SupplierSale"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: {
        title: {
          text: '礼服各供应商占比'
        },
        color: [ '#FFC125', '#FF4500', '#1E90FF', '#3CB371', '#48D1CC', 'indigo', 'purple' ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '礼服供应商',
            type: 'pie',
            radius: '50%',
            selectedMode: 'single',
            data: [],
            label: {
              normal: {
                formatter (v) {
                  let text = v.name
                  if (text.length <= 8) {
                    return text
                  } else if (text.length > 8 && text.length <= 16) {
                    text = `${text.slice(0, 8)}\n${text.slice(8)}`
                  } else if (text.length > 16 && text.length <= 24) {
                    text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`
                  } else if (text.length > 24 && text.length <= 30) {
                    text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24)}`
                  } else if (text.length > 30) {
                    text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24, 30)}\n${text.slice(30)}`
                  }
                  return text
                },
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 18
                }
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.getOrderSupplier()
  },
  methods: {
    drawLine () {
      let SupplierSale = this.$echarts.init(this.$refs.SupplierSale)
      SupplierSale.setOption(this.option)
    },
    getOrderSupplier () {
      this.$axios({
        method: 'get',
        url: `/order/getOrderSuppier`
      }).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data
          this.option.series[0].data = data
          this.drawLine()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.Suppier{
  display:inline-block;
  border-radius: 10px;
  background: #fff;
  width: 48%;
  box-sizing: border-box;
  &-order{
    display:inline-block;
    padding: 20px;
    width: 100%;
    height:400px;
    box-sizing: border-box;
  }
}
</style>
