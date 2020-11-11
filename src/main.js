// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from './utils/http'
import router from './router'
import ViewUI from 'view-design'
import store from './store'
import 'view-design/dist/styles/iview.css'
Vue.use(ViewUI)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
