<template>
  <div class="login">
    <Card class="login-card">
      <p slot="title">
        <b>欢迎登录</b>
      </p>
      <div class="card-item">
        <Icon type="md-contact" class="item-icon"/>
        <input name="username" v-model="username" type="text" placeholder="请输入用户名"/>
      </div>
      <div class="card-item">
        <Icon type="md-lock" class="item-icon" />
        <input name="password" v-model="password" type="password" placeholder="请输入密码"/>
      </div>
      <Button type="primary" long @click="submit">登录</Button>
    </Card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
  },
  methods: {
    submit () {
      this.$axios({
        method: 'POST',
        url: '/Login/checkLogin',
        data: {
          'admin_name': this.username,
          'admin_pass': this.password
        }
      }).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          this.$store.commit('$_setToken', res.data.token)
          this.$store.commit('$_setUser', this.username)
          this.$Message.success('登陆成功')
          this.$router.push('/Index/User')
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.login{
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url(login-bg.jpg);
  &-card{
    position: absolute;
    top: 50%;
    right: 100px;
    width:340px;
    padding: 10px;
    transform: translateY(-50%);
    .card-item{
      display: flex;
      .item-icon{
        line-height: 34px;
        width: 34px;
        height: 34px;
        font-size: 24px;
        background: #F5F5F5;
        border-radius: 3px 0 0 3px;
        border: 1px solid #ccc;
        border-right: none;
      }
      input{
        flex: 1;
        height: 34px;
        margin-bottom: 20px;
        border-style: none;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 0 3px 3px 0;
      }
    }

  }
}
</style>
