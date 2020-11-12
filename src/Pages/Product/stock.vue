<template>
  <div class="Stock">
    <Button type="primary" @click="modal1= true;type=1">新增礼服</Button>
    <Table border max-height="500" align="center" :columns="columns" :data="data" class="Stock-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增礼服' : '修改礼服'}}</div>
      <Form :label-width="80"  :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服" prop="pid">
          <Select v-model="formItem.pid" style="width:200px" placeholder="请选择礼服" @on-change="getProduct">
            <Option v-for="item in productList" :value="item.pid" :key="item.pid">{{ item.product_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="颜色" prop="cid">
          <Radio-group v-show="pid ? true :false" v-model="formItem.cid" @on-change="getColor">
              <Radio  v-for="item in colList" :label="item.cid" :key="item.cid">{{ item.product_color }}</Radio>
            </Radio-group>
        </FormItem>
        <FormItem label="尺寸" prop="sid">
          <Checkbox-group  v-show="pid ? true :false" v-model="formItem.sid">
            <Checkbox  v-for="item in szList" :label="item.sid" :key="item.sid"><span>{{ item.product_size }}</span></Checkbox>
          </Checkbox-group>
        </FormItem>
        <FormItem label="库存" prop="stock">
          <InputNumber type="text" v-model="formItem.stock" style="width:200px;"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
        <Button type="text" @click="closeModal">取消</Button>
      </div>
    </Modal>
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
          title: '礼服',
          key: 'product_name'
        },
        {
          title: '尺码',
          key: 'product_size'
        },
        {
          title: '颜色',
          key: 'product_color'
        },
        {
          title: '库存',
          key: 'stock'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.getIdInfo(params.row.pid)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // this.deleteProduct(params.row.pid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ruleValidate: {
        pid: [
          { required: true, message: '请选择礼服', type: 'number', trigger: 'change' }
        ],
        cid: [
          { required: true, message: '请选择礼服颜色', type: 'number', trigger: 'change' }
        ],
        sid: [
          { required: true, type: 'array', min: 1, message: '至少选择一个', trigger: 'change' }
        ],
        stock: [
          { required: true, message: '库存不能为空', trigger: 'blur', type: 'integer' }
        ]
      },
      formItem: {
        pid: null,
        cid: null,
        sid: [],
        stock: null
      },
      data: [],
      modal1: false,
      productList: [],
      colList: [],
      szList: [],
      newszList: [],
      pid: null,
      type: 1,
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.stockList()
    this.infoList()
    this.colorList()
    this.sizeList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addStock()
        }
      })
    },
    stockList () {
      this.$axios({
        method: 'get',
        url: `/api/product/stock/stockList/${this.pageNo}/${this.pageSize}`
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    infoList () {
      this.$axios({
        method: 'get',
        url: '/api/product/info/infoList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.productList = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    colorList () {
      this.$axios({
        method: 'get',
        url: '/api/product/color/colorList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.colList = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    sizeList () {
      this.$axios({
        method: 'get',
        url: '/api/product/size/sizeList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.szList = res.data.data
          this.newszList = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    getProduct (id) {
      this.pid = id
    },
    getColor (id) {
      this.formItem.sid = [] // 初始化尺寸
      this.$axios({
        method: 'get',
        url: `/api/product/stock/getIdStock/${this.pid}/${id}`
      }).then((res) => {
        const allsid = this.newszList
        const newsid = res.data.data.map(item => item.sid)
        this.szList = allsid.filter(item => !newsid.includes(item.sid)) // 筛选出未选择的尺寸
      })
    },
    addStock () {
      console.log(this.formItem)
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/api/product/stock/addStock' : '/api/product/Stock/updateStock',
        data: {
          'formItem': this.formItem
        }
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.stockList()
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.stockList()
    },
    closeModal () {
      this.modal1 = false
      this.formItem = {
        pid: null,
        cid: null,
        sid: [],
        stock: null
      }
      this.szList = this.newszList
      this.$refs['formValidate'].resetFields()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Stock{
  &-table{
    margin: 20px 0;
  }
}
</style>
