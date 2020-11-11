<template>
  <div class="Admin">
    <Table border max-height="500" align="center" :columns="columns1" :data="Admindata" class="Admin-table"></Table>
    <Page :total="total" @on-change="changePage"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '管理员id',
          key: 'aid'
        },
        {
          title: '用户名',
          key: 'admin_name'
        },
        {
          title: '密码',
          key: 'admin_pass'
        },
        {
          title: '邮箱',
          key: 'admin_email'
        }
      ],
      Admindata: [],
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.adminList()
  },
  methods: {
    adminList () {
      this.$axios({
        method: 'get',
        url: `/api/admin/adminList/${this.pageNo}/${this.pageSize}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.Admindata = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.adminList()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Admin{
  &-table{
    margin-bottom: 20px;
  }
}
</style>
