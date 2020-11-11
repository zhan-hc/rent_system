import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/Pages/index'
import Login from '@/Pages/Login/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/Index',
      name: 'Index',
      component: Index,
      meta: {
        requireAuth: true // 是否需要登录验证
      },
      children: [
        {
          path: 'User',
          name: '用户管理',
          component: () => import('@/Pages/User/index')
        },
        {
          path: 'Admin',
          name: '管理员管理',
          component: () => import('@/Pages/Admin/index')
        },
        {
          path: 'Product/info',
          name: '信息管理',
          component: () => import('@/Pages/Product/info')
        },
        {
          path: 'Product/stock',
          name: '库存管理',
          component: () => import('@/Pages/Product/stock')
        },
        {
          path: 'Product/size',
          name: '尺寸管理',
          component: () => import('@/Pages/Product/size')
        },
        {
          path: 'Product/color',
          name: '颜色管理',
          component: () => import('@/Pages/Product/color')
        }
      ]
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requireAuth)) { // 需要登录
    if (window.localStorage.token) {
      console.log('1')
      next()
    } else if (to.path !== '/Login') {
      let token = window.localStorage.token
      if (token === 'null' || token === '' || token === undefined) {
        next({path: '/Login'})
        console.log('2')
        alert('检测到您还未登录,请登录后操作！')
      }
    } else {
      console.log('3')
      next()
    }
  } else { // 不需要登录
    console.log('4')
    next()
  }
})

export default router
