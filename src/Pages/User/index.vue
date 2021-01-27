<template>
  <div class="User">
    <Input v-model="mobile" style="width:150px;margin: 0 20px 20px 0" placeholder="手机号查询"/>
    <Button type="primary" @click="userList()" style="margin: 0 0 20px 0">搜索</Button>
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
          title: '手机号',
          key: 'mobile'
        }
      ],
      Userdata: [],
      mobile: null,
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
        url: '/user/userList',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          mobile: this.mobile || null
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.Userdata = res.data.data
          this.total = res.data.total
        } else {
          this.Userdata = []
          this.total = 0
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
