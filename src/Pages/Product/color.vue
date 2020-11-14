<template>
  <div class="Color">
    <Button type="primary" @click="modal1= true;type=1">新增颜色</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="Color-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增尺寸' : '修改尺寸'}}</div>
      <Form :label-width="80"  :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服颜色" prop="color">
          <Input type="text" v-model="formItem.color" style="width:200px;"/>
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
          key: 'cid'
        },
        {
          title: '颜色',
          key: 'product_color'
        },
        {
          title: '操作',
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
                    this.getIdColor(params.row.cid)
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
                    this.deleteColor(params.row.cid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      ruleValidate: {
        color: [
          { required: true, message: '尺寸不能为空', trigger: 'blur' }
        ]
      },
      modal1: false,
      type: 1,
      formItem: {
        color: '',
        cid: null
      },
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.colorList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addColor()
        }
      })
    },
    colorList () {
      this.$axios({
        method: 'get',
        url: `/api/product/color/colorList`,
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    // 根据id获取颜色信息
    getIdColor (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/api/product/color/getIdColor/${id}`
      }).then((res) => {
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.formItem.cid = id
          this.formItem.color = formData.product_color
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    // 添加和更改颜色信息
    addColor () {
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/api/product/color/addColor' : '/api/product/color/updateColor',
        data: {
          'cid': this.formItem.cid,
          'color': this.formItem.color
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.colorList()
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    // 删除颜色信息
    deleteColor (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/api/product/color/deleteColor/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.colorList()
            } else {
              this.$Message.error(res.data.msg.sqlMessage)
            }
          })
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.colorList()
    },
    closeModal () {
      this.modal1 = false
      this.color = ''
      this.$refs['formValidate'].resetFields()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Color{
  &-table{
    margin: 20px 0;
  }
}
</style>
