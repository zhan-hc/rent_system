<template>
  <div class="Color">
    <Button type="primary" @click="modal1= true;type=1">新增颜色</Button>
    <Table border max-height="500" align="center" :columns="columns1" :data="data" class="Color-table"></Table>
    <Page :total="total" @on-change="changePage"/>
    <Modal v-model="modal1" :title="title" ref="formValidate" :rules="ruleValidate">
      <div slot="header">{{type === 1 ? '新增尺寸' : '修改尺寸'}}</div>
      <Form :label-width="80">
        <FormItem label="礼服颜色" prop="color">
          <Input type="text" v-model="color" style="width:200px;"/>
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
          key: 'color'
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
                    // this.getIdColor(params.row.pid)
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
                    // this.deleteColor(params.row.pid)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      color: '',
      modal1: false,
      type: 1,
      title: '新增颜色',
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.colorList()
  },
  methods: {
    colorList () {
      this.$axios({
        method: 'get',
        url: `/api/product/color/colorList/${this.pageNo}/${this.pageSize}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.data = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    addColor () {},
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addColor()
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
