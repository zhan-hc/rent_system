<template>
  <div class="supplier">
    <Button type="primary" @click="modal1= true;type=1">新增供应商</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="supplier-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增供应商' : '修改供应商'}}</div>
      <Form :label-width="80" :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服供应商" prop="supplier">
          <Input type="text" v-model="formItem.supplier" style="width:200px;"/>
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
      columns1: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: '供应商',
          key: 'supplier'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  supplier: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.getIdsupplier(params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  supplier: 'small'
                },
                on: {
                  click: () => {
                    this.deletesupplier(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ruleValidate: {
        supplier: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ]
      },
      modal1: false,
      formItem: {
        supplier: '',
        id: null
      },
      type: 1,
      data: [],
      total: 0,
      pageNo: 1,
      pageSize: 10

    }
  },
  mounted () {
    this.supplierList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addsupplier()
        }
      })
    },
    supplierList () {
      this.$axios({
        method: 'get',
        url: `/product/supplier/supplierList`,
        params: {
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
    // 根据id获取供应商信息
    getIdsupplier (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/product/supplier/getIdsupplier/${id}`
      }).then((res) => {
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.formItem.id = id
          this.formItem.supplier = formData.supplier
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 添加和更改供应商信息
    addsupplier () {
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/product/supplier/addsupplier' : '/product/supplier/updatesupplier',
        data: {
          'id': this.formItem.id,
          'supplier': this.formItem.supplier
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.formItem.supplier = ''
          this.supplierList()
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    // 删除供应商
    deletesupplier (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/product/supplier/deletesupplier/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.supplierList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.supplierList()
    },
    closeModal () {
      this.modal1 = false
      this.supplier = ''
      this.$refs['formValidate'].resetFields()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.supplier{
  &-table{
    margin: 20px 0;
  }
}
</style>
