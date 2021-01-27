<template>
  <div class="Order">
    <InputNumber type="text" v-model="uid" style="width:100px;margin-right:20px" placeholder="用户id查询"/>
    <InputNumber type="text" v-model="oid" style="width:150px;margin-right:20px" placeholder="订单号查询"/>
    <DatePicker type="daterange" v-model="OrderTime" split-panels placeholder="订单创建日期" style="width:200px;margin-right:20px"></DatePicker>
    <Select v-model="status" style="width:200px" placeholder='订单状态'>
      <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.text }}</Option>
    </Select>
    <Button type="primary" @click="orderList">搜索</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="Order-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="descModal">
      <div slot="header">订单详情</div>
      <div class="item" style="display:flex">
        <div class="item-img"><img :src="OrderDescList.product_img" alt="" width="150" height="200"></div>
        <div class="item-content" style="flex:1;margin-left:20px;">
          <div class="item-title"><b>{{OrderDescList.product_name}}</b></div>
          <div class="item-price"><b>租金：</b>￥ {{OrderDescList.product_price}} / 天</div>
          <div class="item-color-size"><b>颜色/尺寸：</b>{{OrderDescList.product_color}} / {{OrderDescList.product_size}}</div>
          <div class="item-rent"><b>租期：</b>{{rent_time(OrderDescList.startTime,OrderDescList.endTime)}}天</div>
          <div class="item-start"><b>租期区间：</b>{{formatTime(OrderDescList.startTime,1)}}----{{formatTime(OrderDescList.endTime,1)}}</div>
          <div class="item-deposit"><b>押金：</b>{{OrderDescList.product_deposit}}</div>
          <div class="item-address">
            <p><b>收货地址：</b>{{OrderDescList.address}}</p>
            <b>收件人：</b>{{OrderDescList.addressee}}<br>
            <b>手机号：</b>{{OrderDescList.mobile}}<br>
            <span v-show="OrderDescList.note"><b>备注：</b>{{OrderDescList.note}}</span>
          </div>
          <div class="item-depositDesc" v-show="OrderDescList.deposit_status">
            <b>退还押金描述：</b>{{OrderDescList.deposit_describe}}<br>
            <b>退还押金金额：</b>￥{{OrderDescList.deposit_refund}}<br>
            </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="closeModal('desc')">取消</Button>
      </div>
    </Modal>
    <Modal v-model="parcelModal">
      <div slot="header">添加快递</div>
      <Form  :model="parcelItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="选择快递" prop='kid'>
          <Select v-model="parcelItem.kid" style="width:200px" placeholder='快递类型'>
            <Option v-for="item in parcelList" :value="item.kid" :key="item.kid">{{item.kname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="快递单号" prop='shipperCode'>
          <Input type="text" v-model="parcelItem.shipperCode" style="width:200px;"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
        <Button type="text" @click="closeModal('parcel')">取消</Button>
      </div>
    </Modal>
    <Modal v-model="depositModal">
      <div slot="header">押金审核</div>
      <p>订单号： {{oid}}</p>
      <p style="margin-bottom:10px">押金：￥{{OrderDescList.product_deposit}}</p>
      <Form  :model="depositItem" ref="DepositValidate" :rules="DepositValidate">
        <FormItem label="描述" prop='describe'>
          <Input v-model="depositItem.describe" type="textarea" placeholder="请输入退款押金描述" style="width:400px"/>
        </FormItem>
        <FormItem label="退还押金金额" prop='amount'>
          <InputNumber v-model="depositItem.amount" style="width:200px;"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="refundDeposit()">确认</Button>
        <Button type="text" @click="closeModal('deposit')">取消</Button>
      </div>
    </Modal>
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
          title: '创建时间',
          render: (h, params) => {
            return h('div', this.moment(params.row.createTime).format('YYYY-MM-DD hh:mm:ss'))
          }
        },
        {
          title: '快递类型',
          render: (h, params) => {
            if (params.row.kname) return h('span', params.row.kname)
            else return h('span', '无')
          }
        },
        {
          title: '快递单号',
          align: 'center',
          render: (h, params) => {
            if (!params.row.shipperCode) {
              if (params.row.status === 0) {
                return h('span', '无')
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openParcel(params.row.oid)
                      }
                    }
                  }, '添加快递')
                ])
              }
            } else {
              return h('span', params.row.shipperCode)
            }
          }
        },
        {
          title: '订单状态',
          render: (h, params) => {
            var status = ''
            if (params.row.status === 0) status = '待付款'
            else if (params.row.status === 1) status = '待发货'
            else if (params.row.status === 2) status = '待收货'
            else if (params.row.status === 3) status = '待评价'
            else status = '订单完成'
            return h('div', status)
          }
        },
        {
          title: '押金退还',
          align: 'center',
          render: (h, params) => {
            if (!params.row.deposit_status) {
              if (params.row.status > 2) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '5px',
                      marginTop: '5px'
                    },
                    on: {
                      click: () => {
                        this.checkDeposit(params.row.oid)
                      }
                    }
                  }, '审核')
                ])
              } else {
                return h('span', '未审核')
              }
            } else {
              return h('span', '已退还')
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px'
                },
                on: {
                  click: () => {
                    this.getOrderDesc(params.row.oid)
                    this.descModal = true
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px'
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
      statusList: [
        {
          value: null,
          text: '全部'
        },
        {
          value: 0,
          text: '待付款'
        },
        {
          value: 1,
          text: '待发货'
        },
        {
          value: 2,
          text: '待收货'
        },
        {
          value: 3,
          text: '待评价'
        },
        {
          value: 4,
          text: '订单完成'
        }
      ],
      uid: null,
      oid: null,
      data: [],
      OrderDescList: {},
      parcelList: [],
      descModal: false,
      depositModal: false,
      parcelModal: false,
      OrderTime: null,
      status: null,
      parcelItem: {
        kid: null,
        shipperCode: null
      },
      depositItem: {
        describe: '',
        amount: null
      },
      ruleValidate: {
        shipperCode: [
          { required: true, message: '快递单号不能为空', trigger: 'blur' }
        ],
        kid: [
          { required: true, message: '请选择快递类别', type: 'number', trigger: 'change' }
        ]
      },
      DepositValidate: {
        describe: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, validator: this.CheckdepositValidate, trigger: 'blur' }
        ]
      },
      total: 0,
      pageNo: 1,
      pageSize: 10

    }
  },
  mounted () {
    this.orderList()
    this.getParcelList()
  },
  methods: {
    // 押金校验
    CheckdepositValidate (rule, value, callback) {
      if (value > this.OrderDescList.product_deposit) {
        callback(new Error('退还押金不能超过押金本身'))
      } else {
        callback()
      }
    },
    orderList () {
      this.$axios({
        method: 'get',
        url: `/order/orderList`,
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          uid: this.uid || null,
          oid: this.oid || null,
          status: this.status,
          startTime: this.OrderTime[0] ? this.moment(this.OrderTime[0]).format('YYYY-MM-DD') : null,
          endTime: this.OrderTime[1] ? this.moment(this.OrderTime[1]).format('YYYY-MM-DD') : null
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.data = []
          this.total = 0
        }
      })
    },
    getParcelList () {
      this.$axios({
        method: 'get',
        url: `/parcel/parcelList`
      }).then((res) => {
        if (res.data.status === 200) {
          this.parcelList = res.data.data
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addshipper()
        }
      })
    },
    // 获取订单详情
    getOrderDesc (oid) {
      this.$axios({
        method: 'get',
        url: '/order/getIdOrder',
        params: {
          oid: oid
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.OrderDescList = res.data.data[0]
        }
      })
    },
    // 检查订单的押金
    checkDeposit (oid) {
      this.depositModal = true
      this.oid = oid
      this.getOrderDesc(oid)
    },
    // 打开添加快递单号的弹窗
    openParcel (oid) {
      this.parcelModal = true
      this.oid = oid
    },
    // 添加快递单号
    addshipper () {
      this.$axios({
        method: 'post',
        url: '/order/addParcel',
        data: {
          oid: this.oid,
          kid: this.parcelItem.kid,
          shipperCode: this.parcelItem.shipperCode
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.updateOrderStatus(this.oid)
          this.closeModal('parcel')
          this.oid = null
          this.orderList()
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    // 更改订单状态为待收货
    updateOrderStatus (oid) {
      this.$axios({
        method: 'post',
        url: '/order/updateOrderStatus',
        data: {
          oid: oid,
          status: 2
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$Message.success('添加成功')
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    rent_time (t1, t2) {
      return this.moment(t2).diff(this.moment(t1), 'days') + 1
    },
    formatTime (val, type) {
      if (type === 1) {
        return this.moment(val).format('YYYY-MM-DD')
      }
      return this.moment(val).format('YYYY-MM-DD HH:mm:ss')
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
    // 退还押金
    refundDeposit () {
      this.$refs['DepositValidate'].validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/order/refundDeposit',
            data: {
              oid: this.oid,
              describe: this.depositItem.describe,
              amount: this.depositItem.amount
            }
          }).then((res) => {
            if (res.data.status === 200) {
              this.refundUrl(res.data.url)
            } else {
              this.$Message.error(res.data.msg.sqlMessage)
            }
          })
        }
      })
    },
    // 支付宝退款url
    refundUrl (url) {
      this.$axios({
        method: 'get',
        baseURL: '/api',
        url: `${url}`
      }).then((res) => {
        if (res.status === 200) {
          this.oid = null
          this.$Message.success('退款押金成功')
          this.orderList()
          this.depositModal = false
        } else {
          console.log(res)
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.orderList()
    },
    closeModal (type) {
      if (type === 'desc') {
        this.descModal = false
      } else if (type === 'parcel') {
        this.parcelModal = false
        this.$refs['formValidate'].resetFields()
      } else {
        this.depositModal = false
        this.$refs['DepositValidate'].resetFields()
      }
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
