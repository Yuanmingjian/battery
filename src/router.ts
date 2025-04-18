import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Dashboard1 from './views/Dashboard1.vue'
import Login from './views/Login.vue'
import WarrantyRegulations from './views/WarrantyRegulations.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty', requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard1',
    name: 'Dashboard1',
    component: Dashboard1,
    meta: { requiresAuth: true },
  },
  {
    path: '/warranty-regulations',
    name: 'WarrantyRegulations',
    component: WarrantyRegulations,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录则重定向到登录页
      next({ name: 'Login' })
    } else {
      // 已登录则允许访问
      next()
    }
  } else {
    // 不需要登录权限的页面直接放行
    next()
  }
})

export default router
