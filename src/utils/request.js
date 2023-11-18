// ### 1. 创建 axios 实例

// 们会使用 axios 来请求后端接口, 一般都会对 axios 进行一些配置 (比如: 配置基础地址等)

// 一般项目开发中, 都会对 axios 进行基本的二次封装, 单独封装到一个模块中, 便于使用

// 1. 安装 axios

// ```
// pnpm add axios
// ```

// 2. 新建 `utils/request.js` 封装 axios 模块

//    利用 axios.create 创建一个自定义的 axios 来使用

//    http://www.axios-js.com/zh-cn/docs/#axios-create-config

import axios from 'axios'
import { useUserStore } from '@/stores' // 导入用户token的pinia
import { ElMessage } from 'element-plus' // 导入element-plus组件库
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token 需要导入 pinia 拿到token
    const UserStore = useUserStore() // 导入后需要注册使用useUserStore
    if (UserStore.token) {
      //判断如果有token则让请求头携带token
      config.headers.Authorization = UserStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      //这里需要根据接口文档来写,请求成功返回的提示
      return res // 当请求成功,则返回res数据
    }
    // TODO 3. 处理业务失败 ,抛出错误必须 ,提示错误,使用element puls 插件来提示
    ElMessage.error(res.data.message || '服务器繁忙')
    return Promise.reject(res.data) // 将会立即拒绝 promise 并传递一个错误。通常，这个方法在请求失败的回调函数中被调用，以便将错误传递给下一个错误处理程序。
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情情况, => 401错误, 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      // ? 的意思是只有前面有值,才会继续执行下去
      router.push('/login')
    }

    // 错误的默认情况
    ElMessage.error(err.response.data.message || '服务器繁忙')
    return Promise.reject(err) // 将会立即拒绝 promise 并传递一个错误。通常，这个方法在请求失败的回调函数中被调用，以便将错误传递给下一个错误处理程序。
  }
)

export default instance
export { baseURL }
