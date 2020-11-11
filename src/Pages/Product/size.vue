<template>
  <div class="Size">
    <Button type="primary" @click="modal1= true;type=1">新增尺寸</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="Size-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1">
      <div slot="header">{{type === 1 ? '新增尺寸' : '修改尺寸'}}</div>
      <Form :label-width="80" ref="formValidate" :rules="ruleValidate">
        <FormItem label="礼服尺寸" prop="size">
          <Input type="text" v-model="size" style="width:200px;"/>
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
          key: 'sid'
        },
        {
          title: '尺寸',
          key: 'product_size'
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
                    this.getIdSize(params.row.sid)
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
                    this.deleteSize(params.row.sid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ruleValidate: {
        size: [
          { required: true, message: '尺寸不能为空', trigger: 'blur' }
        ]
      },
      modal1: false,
      size: '',
      sid: null,
      type: 1,
      data: [],
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.sizeList()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.error('asdsadsa')
          this.addSize()
        } else {
          this.$Message.error('士大夫但是a')
        }
      })
    },
    sizeList () {
      this.$axios({
        method: 'get',
        url: `/api/product/size/sizeList/${this.pageNo}/${this.pageSize}`
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
    getIdSize (id) {
      this.modal1 = true
      this.type = 2
      this.$axios({
        method: 'get',
        url: `/api/product/size/getIdSize/${id}`
      }).then((res) => {
        if (res.data.status === 200) {
          let formData = res.data.data[0]
          this.sid = formData.sid
          this.size = formData.size
          console.log(this.size)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 添加和更改礼服信息
    addSize () {
      this.$axios({
        method: 'POST',
        url: this.type === 1 ? '/api/product/size/addSize' : '/api/product/size/updateSize',
        data: {
          'sid': this.sid,
          'size': this.size
        }
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          this.$Message.success(this.type === 1 ? '添加成功' : '更改成功')
          this.modal1 = false
          this.sizeList()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 删除礼服信息
    deleteSize (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '是否确认删除？',
        onOk: () => {
          this.$axios({
            method: 'get',
            url: `/api/product/size/deleteSize/${id}`
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.sizeList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.sizeList()
    },
    closeModal () {
      this.modal1 = false
      this.size = ''
      this.$refs['formValidate'].resetFields()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Size{
  &-table{
    margin: 20px 0;
  }
}
</style>
