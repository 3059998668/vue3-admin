import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage', // 重定向到文章分类
      children: [
        // 二级路由
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 => 默认是直接放行的 可在vue-router官网的路由前置守卫查看对应的文档
// 根据返回值决定,是放行还是拦截
// 返回值:
// 1, undefined  / true 直接放行
// 2, false 拦截from的地址页面
// 3, 具体路径 或 路径对象 拦截到对应的地址
//    'login' { name:'login'}

router.beforeEach((to) => {
  // 如果没有token,且访问的是非登录页,拦截到登录,其他情况正常放行
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login' // 说明没有token 并且访问的不是登录页,是需要授权的页面
})

export default router
