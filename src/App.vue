<script setup>
import { RouterView } from 'vue-router'
// 导入使用store
import { useUserStore, useCountStore } from './stores/index' //导入store后需要注册才能使用
const UserStore = useUserStore() // 注册store
const CountStore = useCountStore()
</script>

<template>
  <header>
    <el-button @click="UserStore.setToken('aaaaaaaaaaaaaaaa')" type="primary"
      >登录</el-button
    >
    <el-button @click="UserStore.removeToken" type="success">退出</el-button>
    <h1>{{ UserStore.token }}</h1>
    <h2>{{ CountStore.count }}</h2>
    <el-button @click="CountStore.setCount(2)">++</el-button>
  </header>
  <RouterView />
</template>

<style scoped></style>
