<template>
  <div class="Index">
    <div style="margin-bottom:20px">
      <Input v-model="search" placeholder="请输入礼服名称关键词搜索" style="width: 250px;"/>
      <Select v-model="cid" style="width:150px;margin-right:20px;" placeholder='礼服类型'>
        <Option v-for="item in category" :value="item.id" :key="item.id">{{ item.product_category }}</Option>
      </Select>
      <Button type="primary" @click="infoList">搜索</Button>
      <Button type="primary" @click="reset">重置</Button>
    </div>
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
        <FormItem label="类别" prop="cid">
          <Radio-group v-model="formItem.cid">
            <Radio  v-for="item in category" :label="item.id" :key="item.id">{{ item.product_category }}</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="供应商" prop="supplier">
          <Select v-model="formItem.supplier" style="width:250px;" placeholder='供应商'>
            <Option v-for="item in supplierList" :value="item.id" :key="item.id">{{ item.supplier }}</Option>
          </Select>
        </FormItem>
        <FormItem label="礼服图片">
          <Upload action="http://121.196.151.65:8080/upload/img" name="test"
            :on-format-error="handleFormatError"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :format="['jpg','jpeg','png']">
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <img v-show="formItem.imgUrl" :src="formItem.imgUrl" alt="上传图片" style="width:100px;height:120px"/>
        </FormItem>
        <FormItem label="礼服押金" prop="deposit">
          <InputNumber type="text" v-model="formItem.deposit" style="width:200px;"/>
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
          title: '礼服类别',
          key: 'product_category'
        },
        {
          title: '礼服价格',
          render: (h, params) => {
            return h('div', `￥${params.row.product_price}`)
          }
        },
        {
          title: '礼服押金',
          render: (h, params) => {
            return h('div', `￥${params.row.product_deposit}`)
          }
        },
        {
          title: '供应商',
          key: 'supplier'
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
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.updateProductNew(params.row.pid, params.row.ifNew === 0 ? 1 : 0)
                  }
                }
              }, params.row.ifNew === 0 ? '推荐' : '普通'),
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
        imgUrl: '',
        cid: null,
        deposit: null,
        supplier: null
      },
      ruleValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        cid: [
          { required: true, message: '请选择礼服类别', type: 'number', trigger: 'change' }
        ],
        supplier: [
          { required: true, message: '请选择供应商', type: 'number', trigger: 'change' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur', type: 'integer' }
        ],
        deposit: [
          { required: true, message: '押金不能为空', trigger: 'blur', type: 'integer' }
        ]
      },
      type: 1, // 1是新增2是更改
      modal1: false,
      data: [],
      category: [],
      supplierList: [],
      total: 0,
      pageNo: 1,
      cid: null,
      search: '',
      pageSize: 10
    }
  },
  mounted () {
    this.infoList()
    this.getCategoryList()
    this.getSupplierList()
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
        url: `/product/info/infoList`,
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.search || null,
          cid: this.cid
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
    // 根据id获取礼服信息
    getIdInfo (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/product/info/getIdInfo/${id}`
      }).then((res) => {
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.formItem = {
            pid: id,
            name: formData.product_name,
            price: formData.product_price,
            imgUrl: formData.product_img,
            deposit: formData.product_deposit,
            cid: formData.category_id,
            supplier: formData.supplier_id
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    getCategoryList () {
      this.$axios({
        method: 'get',
        url: `/product/category/categoryList`
      }).then((res) => {
        if (res.data.status === 200) {
          this.category = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    getSupplierList () {
      this.$axios({
        method: 'get',
        url: `/product/supplier/supplierList`
      }).then((res) => {
        if (res.data.status === 200) {
          this.supplierList = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 添加和更改礼服信息
    addProduct () {
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/product/info/addProduct' : '/product/info/updateProduct',
        data: {
          'pid': this.formItem.pid,
          ...this.formItem
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.infoList()
          this.$refs['formValidate'].resetFields()
          this.formItem.imgUrl = ''
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    updateProductNew (pid, news) {
      this.$Modal.confirm({
        title: '推荐提示',
        content: news === 0 ? '是否降为普通产品？' : '是否推荐为新品？',
        onOk: () => {
          this.$axios({
            method: 'POST',
            url: '/product/info/updateProductNew',
            data: {
              'pid': pid,
              'news': news
            }
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success('推荐成功')
              this.infoList()
            } else {
              this.$Message.error(res.data.msg.sqlMessage)
            }
          })
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
            url: `/product/info/deleteProduct/${id}`
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
    // 重置
    reset () {
      this.cid = null
      this.search = ''
      this.infoList()
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.infoList()
    },
    uploadSuccess (res, file, fileList) {
      this.formItem.imgUrl = `http://121.196.151.65:8080/static${res.data}`
    },
    uploadError (error, file, fileList) {
      console.log(error)
    },
    handleFormatError (file) {
      this.$Message.error('File format of ' + file.name + ' is incorrect, please select jpg or png.')
    },
    closeModal () {
      this.modal1 = false
      this.formItem.imgUrl = ''
      this.$refs['formValidate'].resetFields()
    }
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
