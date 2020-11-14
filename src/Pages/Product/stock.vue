<template>
  <div class="Stock">
    <div style="margin-bottom:20px">
      <Input v-model="search" placeholder="请输入关键词搜索" style="width: 300px;"/>
      <Button type="primary" @click="stockList">搜索</Button>
    </div>
    <Button type="primary" @click="modal1= true;type=1">新增礼服</Button>
    <Table border max-height="500" align="center" :columns="columns" :data="data" class="Stock-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增礼服' : '修改礼服'}}</div>
      <Form :label-width="80"  :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服" prop="pid">
          <Select v-model="formItem.pid" style="width:200px" placeholder="请选择礼服" @on-change="getProduct" :disabled="IfTypeAdd">
            <Option v-for="item in productList" :value="item.pid" :key="item.pid">{{ item.product_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="颜色" prop="cid">
          <Radio-group v-show="pid||IfTypeAdd" v-model="formItem.cid" @on-change="getColor">
              <Radio  v-for="item in colList" :label="item.cid" :key="item.cid" :disabled="IfTypeAdd">{{ item.product_color }}</Radio>
            </Radio-group>
        </FormItem>
        <FormItem label="尺寸" prop="sid">
          <Checkbox-group  v-show="pid||IfTypeAdd" v-model="formItem.sid">
            <Checkbox  v-for="item in szList" :label="item.sid" :key="item.sid" :disabled="IfTypeAdd"><span>{{ item.product_size }}</span></Checkbox>
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
                    this.getIdStock(params.row.id)
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
                    this.deleteStock(params.row.id)
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
        id: null,
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
      search: '',
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
        url: `/api/product/stock/stockList`,
        params: {
          name: this.search || null,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then((res) => {
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
        url: `/api/product/stock/getCidStock/${this.pid}/${id}`
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
          'formItem': this.formItem,
          'id': this.formItem.id,
          'stock': this.formItem.stock
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
    getIdStock (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/api/product/stock/getIdStock/${id}`
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.formItem = {
            id: formData.id,
            pid: formData.pid,
            cid: formData.cid,
            sid: [formData.sid],
            stock: formData.stock
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    deleteStock (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/api/product/stock/deleteStock/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.stockList()
            } else {
              this.$Message.error(res.data.msg.sqlMessage)
            }
          })
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
  computed: {
    IfTypeAdd () {
      return this.type !== 1
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
