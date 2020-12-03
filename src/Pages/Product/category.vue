<template>
  <div class="Category">
    <Button type="primary" @click="modal1= true;type=1">新增类别</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="Category-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增类别' : '修改类别'}}</div>
      <Form :label-width="80" :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服类别" prop="category">
          <Input type="text" v-model="formItem.category" style="width:200px;"/>
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
          title: '类别',
          key: 'product_category'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  category: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.getIdCategory(params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  category: 'small'
                },
                on: {
                  click: () => {
                    this.deleteCategory(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ruleValidate: {
        category: [
          { required: true, message: '尺寸不能为空', trigger: 'blur' }
        ]
      },
      modal1: false,
      formItem: {
        category: '',
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
    this.categoryList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addCategory()
        }
      })
    },
    categoryList () {
      this.$axios({
        method: 'get',
        url: `/api/product/category/categoryList`,
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
    // 根据id获取尺寸信息
    getIdCategory (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/api/product/category/getIdCategory/${id}`
      }).then((res) => {
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.formItem.id = id
          this.formItem.category = formData.product_category
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 添加和更改尺寸信息
    addCategory () {
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/api/product/category/addCategory' : '/api/product/category/updateCategory',
        data: {
          'id': this.formItem.id,
          'category': this.formItem.category
        }
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.categoryList()
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    // 删除尺寸
    deleteCategory (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/api/product/category/deleteCategory/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.categoryList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.categoryList()
    },
    closeModal () {
      this.modal1 = false
      this.category = ''
      this.$refs['formValidate'].resetFields()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Category{
  &-table{
    margin: 20px 0;
  }
}
</style>
