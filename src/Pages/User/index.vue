<template>
  <div class="User">
    <Table border max-height="500" align="center" :columns="columns1" :data="Userdata" class="User-table"></Table>
    <Page :total="total" @on-change="changePage"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '用户id',
          key: 'uid'
        },
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '密码',
          key: 'password'
        },
        {
          title: '手机号',
          key: 'mobile'
        }
      ],
      Userdata: [],
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.userList()
  },
  methods: {
    userList () {
      this.$axios({
        method: 'get',
        url: '/api/user/userList',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.Userdata = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.userList()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.User{
  &-table{
    margin-bottom: 20px;
  }
}
</style>
