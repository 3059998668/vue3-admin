import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'
// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    // define Token data
    const token = ref('')
    const forgetPassword = ref(false) // 定义忘记密码的状态,默认为false
    const storeObj = ref({}) // 定义一个空对象来存用户的账号密码

    // set Token
    const setToken = (newToken) => {
      token.value = newToken
    }

    // remove Token
    const removeToken = () => {
      token.value = ''
    }

    // getUserInfo
    const user = ref({}) // 定义数据
    const userInfo = async () => {
      // 发送请求调用接口
      const res = await userGetInfoService() // 获取数据
      user.value = res.data.data //吧数据存到user.value 方便调用
      console.log(res)
    }
    //  设置用户信息
    const setInfo = (obj) => {
      user.value = obj
    }

    // get 获取用户的账号密码
    const getStoreObj = () => {
      return storeObj.value // 返回用户的账号密码
    }

    // set 忘记密码
    const setForgetPassword = (newForget, obj) => {
      console.log(obj)
      // 把当前的状态存到forgetPassword变量中
      // 1，设置需要把状态存起来
      // 2，需要存当前传递过来的用户名和密码
      forgetPassword.value = newForget // 设置忘记密码的状态
      storeObj.value = obj // 设置用户的账号密码
    }

    // remove 删除用户的账号密码
    const removeStoreObj = () => {
      storeObj.value = {}
    }

    //  return data and method
    return {
      token,
      setToken,
      removeToken,
      user,
      userInfo,
      setInfo,
      setForgetPassword,
      forgetPassword,
      getStoreObj,
      removeStoreObj,
      storeObj
    }
  },
  {
    // 设置为true 代表所有的方法数据都做持久化操作
    persist: true // 配置持久化，可以是一个对象，对象里面可以自定义，详情请查看官网官方文档：https://prazdevs.github.io/pinia-plugin-persistedstate/zh/
  }
)
