import axios from 'axios'
import router from '@/router'
import store from '@/store'
import qs from 'qs'

// 在开发环境中的测试 development
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8080'
}
// 在生产环境中的测试 production
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://121.196.151.65:8080'
}
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    if (store.state.token) {
      config.headers.common['token'] = store.state.token
    }
    return config
  },
  error => {
    // 对请求错误做什么
    return Promise.reject(error)
  })

// http reponse响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          router.replace({
            path: '/Login',
            query: {redirect: router.currentRoute.fullPath} // 登录成功后跳入浏览的当前页面
          })
      }
    }
  })

export default axios
