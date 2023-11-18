import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户模块 token setToken removeToken
export const useCountStore = defineStore('big-count', () => {
  // define Count data
  const count = ref(100)

  // set Count
  const setCount = (newCount) => {
    count.value += newCount
  }

  //  return data and method
  return {
    count,
    setCount
  }
})
