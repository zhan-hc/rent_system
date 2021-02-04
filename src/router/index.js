import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/Pages/index'
import Login from '@/Pages/Login/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/Index/Data'
    },
    {
      path: '/Index',
      name: 'Index',
      redirect: '/Index/Data', // 重定向
      component: Index,
      meta: {
        requireAuth: true // 是否需要登录验证
      },
      children: [
        {
          path: 'Data',
          name: '数据统计',
          component: () => import('@/Pages/Data/index')
        },
        {
          path: 'User',
          name: '会员管理',
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
        },
        {
          path: 'Product/category',
          name: '类别管理',
          component: () => import('@/Pages/Product/category')
        },
        {
          path: 'Product/supplier',
          name: '供应商管理',
          component: () => import('@/Pages/Product/supplier')
        },
        {
          path: 'Order',
          name: '订单管理',
          component: () => import('@/Pages/Order/index')
        },
        {
          path: 'Appraises',
          name: '评价管理',
          component: () => import('@/Pages/Appraises/index')
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
      next()
    } else if (to.path !== '/Login') {
      let token = window.localStorage.token
      if (token === 'null' || token === '' || token === undefined) {
        next({path: '/Login'})
        alert('检测到您还未登录,请登录后操作！')
      }
    } else {
      next()
    }
  } else { // 不需要登录
    next()
  }
})

export default router
