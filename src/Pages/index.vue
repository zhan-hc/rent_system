<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <div class="name">礼服租赁管理系统</div>
          </div>
          <div class="layout-nav">
            <Dropdown>
              <a href="javascript:void(0)">
                <Avatar class="avatar" alt="avatar" >{{userName}}</Avatar>
                <Icon type="md-arrow-dropdown" class="dropdown"/>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="logout">退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
              <Submenu name="1" >
                  <template slot="title">
                      <Icon type="ios-navigate"></Icon>
                      用户管理
                  </template>
                  <menu-item name="1-1" to="/Index/User">用户管理</menu-item>
                  <menu-item name="1-2" to="/Index/Admin">管理员管理</menu-item>
              </Submenu>
              <Submenu name="2">
                  <template slot="title">
                      <Icon type="ios-keypad"></Icon>
                      礼服管理
                  </template>
                  <menu-item name="2-1" to="/Index/Product/info">信息管理</menu-item>
                  <menu-item name="2-2" to="/Index/Product/stock">库存管理</menu-item>
                  <menu-item name="2-3" to="/Index/Product/size">尺码管理</menu-item>
                <menu-item name="2-4" to="/Index/Product/color">颜色管理</menu-item>
              </Submenu>
              <Submenu name="3">
                  <template slot="title">
                      <Icon type="ios-analytics"></Icon>
                      Item 3
                  </template>
                  <menu-item name="3-1">Option 1</menu-item>
                  <menu-item name="3-2">Option 2</menu-item>
              </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb class="breadcrumb">
            <BreadcrumbItem to="/">主页</BreadcrumbItem>
            <BreadcrumbItem v-if="routerName !== 'index'">{{routerName}}</BreadcrumbItem>
          </Breadcrumb>
          <router-view></router-view>
        </Layout>
      </Layout>
    </Layout>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      this.$store.commit('$_removeStorage') // 清除登录信息
      this.$router.push({name: 'Login'})
      this.$Message.success('退出登陆')
    }
  },
  computed: {
    routerName () {
      return this.$route.name
    },
    userName () {
      return this.$store.state.user
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  &-logo{
    // width: 100px;
    height: 40px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    color: #000;
    line-height: 40px;
    .name{
      font-weight: bold;
      font-size: 26px;
    }
  }
  &-nav{
    float: right;
    margin: 0 auto;
    margin-right: 20px;
    .avatar{
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      color: #f56a00;
      background-color: #fde3cf;
    }
    .dropdown{
      color: #000;
      font-size: 24px;
      vertical-align: middle;
    }
  }
  .breadcrumb{
    margin: 24px 0;
    padding: 0 0 10px;
    border-bottom: 1px solid #ccc;
  }
}

</style>
