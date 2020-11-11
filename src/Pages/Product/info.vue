<template>
  <div class="Index">
    <Button type="primary" @click="modal1= true;type=1">新增礼服</Button>
    <Table border max-height="500" align="center" :columns="columns" :data="data" class="Index-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增礼服' : '修改礼服'}}</div>
      <Form :label-width="80" :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服名称" prop="name">
          <Input type="text" v-model="formItem.name" style="width:200px;"/>
        </FormItem>
        <FormItem label="礼服价格" prop="price">
          <InputNumber type="text" v-model="formItem.price" style="width:200px;"/>
        </FormItem>
        <FormItem label="礼服图片">
          <Upload action="/api/upload/img" name="test"
            :on-format-error="handleFormatError"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :format="['jpg','jpeg','png']">
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <img v-show="formItem.imgUrl" :src="formItem.imgUrl" alt="上传图片" style="width:100px;height:120px"/>
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
          title: '礼服id',
          key: 'pid'
        },
        {
          title: '礼服名称',
          key: 'product_name'
        },
        {
          title: '礼服价格',
          key: 'product_price'
        },
        {
          title: '礼服图片',
          key: 'product_img',
          render: (h, params) => {
            let imgUrl = params.row.product_img
            return h('img', {
              attrs: {
                src: imgUrl
              },
              style: {
                width: '100px',
                height: '120px'
              }
            })
          }
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
                    this.getIdInfo(params.row.pid)
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
                    this.deleteProduct(params.row.pid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      formItem: {
        pid: null,
        name: '',
        price: null,
        imgUrl: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur', type: 'integer' }
        ]
      },
      type: 1, // 1是新增2是更改
      modal1: false,
      data: [],
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.infoList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addProduct()
        }
      })
    },
    infoList () {
      this.$axios({
        method: 'get',
        url: `/api/product/info/infoList/${this.pageNo}/${this.pageSize}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 根据id获取礼服信息
    getIdInfo (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/api/product/info/getIdInfo/${id}`
      }).then((res) => {
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.formItem = {
            pid: id,
            name: formData.product_name,
            price: formData.product_price,
            imgUrl: formData.product_img
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 添加和更改礼服信息
    addProduct () {
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/api/product/info/addProduct' : '/api/product/info/updateProduct',
        data: {
          'pid': this.formItem.pid,
          'name': this.formItem.name,
          'price': this.formItem.price,
          'imgUrl': this.formItem.imgUrl
        }
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.infoList()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 删除礼服信息
    deleteProduct (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/api/product/info/deleteProduct/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.infoList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.infoList()
    },
    uploadSuccess (res, file, fileList) {
      console.log(res)
      this.formItem.imgUrl = `http://localhost:8080/static${res.data}`
    },
    uploadError (error, file, fileList) {
      console.log(error)
    },
    handleFormatError (file) {
      this.$Message.error('File format of ' + file.name + ' is incorrect, please select jpg or png.')
    },
    closeModal () {
      this.modal1 = false
      this.formItem = {
        name: '',
        price: null,
        imgUrl: ''
      }
      this.$refs['formValidate'].resetFields()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Index{
  &-table{
    margin: 20px 0;
  }
}
</style>
