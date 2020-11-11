import axios from 'axios'
import router from '@/router'
import store from '@/store'
import qs from 'qs'

// const ajax = axios.create({
//   // 联调
//   baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
//   headers: {
//     get: {
//       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
//     },
//     post: {
//       'Content-Type': 'application/json;charset=utf-8'
//     }
//   },
//   // 是否跨站点访问控制请求
//   withCredentials: true,
//   timeout: 30000,
//   transformRequest: [(data) => {
//     data = JSON.stringify(data)
//     return data
//   }],
//   validateStatus () {
//     // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
//     return true
//   },
//   transformResponse: [(data) => {
//     if (typeof data === 'string' && data.startsWith('{')) {
//       data = JSON.parse(data)
//     }
//     return data
//   }]
// })
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
