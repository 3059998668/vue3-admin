import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // 导入pinia 的持久化插件库

const pinia = createPinia().use(persist)

export default pinia

// 仓库统一导出
export * from './modules/user'
export * from './modules/counter'
