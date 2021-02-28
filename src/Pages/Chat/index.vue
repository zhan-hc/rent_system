<template>
  <div class="container">
    <div class="chat">
      <div class="chat-text">
        <div  v-for="(item, i) in this.customerChatLog[id]" :key='i' >
          <div class="chat-text-user" v-show="item.type === 'user'">
          {{id}}：<span>{{item.content}}</span>
        </div>
        <div class="chat-text-mine" v-show="item.type === 'customer'">
          我：<span>{{item.content}}</span>
        </div>
        </div>
      </div>
      <div class="chat-userList">
        <Avatar class="userList-avatar" :class="item == id ? 'active' : false"  :size='50' v-for='(item, i) in userList' :key="i" @click.native='hrefUserChat(item)'>{{item}}</Avatar>
      </div>
    </div>
    <Input type="text"  v-model='content.text'/>
    <button @click="sendText">发送</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      contentText: '',
      content: {id: 'customer', text: '', recUser: ''},
      ws: null,
      id: 0,
      customerChatLog: {},
      userList: []
    }
  },
  mounted () {
    this.getChatLog()
    this.openWs()
  },
  created () {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn (e) {
      if (this.id !== 0) {
        localStorage.setItem('customerChatLog', JSON.stringify(this.customerChatLog))
      }
    },
    openWs () {
      let that = this
      that.ws = new WebSocket('ws://192.168.43.97:8022')
      if (window.WebSocket) {
        that.ws.onopen = function (e) {
          console.log('链接服务器成功')
          that.ws.send(JSON.stringify(that.content))
        }
        that.ws.onclose = function (e) {
          console.log('服务器关闭')
        }
        that.ws.onerror = function () {
          console.log('服务器出错')
        }
        that.ws.onmessage = function (e) {
          let resData = JSON.parse(e.data)
          that.id = resData.id
          if (!that.customerChatLog.hasOwnProperty(that.id)) { // 如果聊天记录不存在该id
            that.customerChatLog[that.id] = []
          }
          for (let i = 0; i < resData.text.length; i++) {
            if (resData.text[i]) {
              that.customerChatLog[that.id].push({type: 'user', content: resData.text[i]})
            }
          }
          if (that.userList.indexOf(that.id) === -1) {
            that.$set(that.userList, that.userList.length, that.id)
          }
        }
      }
    },
    sendText () {
      let that = this
      this.backText(function () {
        that.contentText = ''
      })
    },
    backText (callback) {
      let that = this
      if (window.WebSocket) {
        that.customerChatLog[that.id].push({type: 'customer', content: that.content.text})
        that.content.recUser = that.id
        that.ws.send(JSON.stringify(that.content))
        that.content.text = ''
      }
    },
    getChatLog () { // 获取聊天记录
      let chatLog = localStorage.getItem('customerChatLog')
      if (chatLog != null) {
        this.customerChatLog = JSON.parse(chatLog)
        Object.keys(this.customerChatLog).forEach((key) => {
          this.userList.push(key)
          this.list = this.customerChatLog[key]
        })
        this.id = this.userList[0]
      }
    },
    hrefUserChat (item) {
      this.id = item
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  .chat {
    display: flex;
    &-text{
      flex: 1;
      height: 300px;
      overflow: scroll;
      &-user{
        margin: 20px 10px 0 0;
        text-align: right;
        span{
          background:#E6E6FA;
          padding: 5px 10px;
          border-radius: 5px;
        }
      }
      &-mine{
        margin-top: 20px;
        span{
          background:#7FFFAA;
          padding: 5px 10px;
          border-radius: 5px;
        }
      }
    }
    &-userList{
      margin: 0 20px;
      .userList-avatar {
        display: block;
        color: #f56a00;
        background-color: #fde3cf;
        cursor: pointer;
        margin-bottom: 20px;
        &:hover,&.active {
          border:1px solid red;
        }
      }
    }
  }
}

</style>
