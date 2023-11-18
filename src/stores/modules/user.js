import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    // define Token data
    const token = ref('')

    // set Token
    const setToken = (newToken) => {
      token.value = newToken
    }

    // remove Token
    const removeToken = () => {
      token.value = ''
    }

    //  return data and method
    return {
      token,
      setToken,
      removeToken
    }
  },
  {
    // 设置为true 代表所有的方法数据都做持久化操作
    persist: true // 配置持久化，可以是一个对象，对象里面可以自定义，详情请查看官网官方文档：https://prazdevs.github.io/pinia-plugin-persistedstate/zh/
  }
)
