<script setup>
import { ref } from 'vue'
// 发送请求，渲染数据
import { artGetChannelService } from '@/api/article'

const articleList = ref([])
const loading = ref(false)
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelService()
  loading.value = false
  articleList.value = res.data.data
  //   console.log(res)
}

getChannelList()

defineProps({
  // 接收到父亲v-model 里传递过来的  modelValue值
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <!--  :modelValue="modelValue" 这里的modelValue就等于 父亲页面传递过来的modelValue-->
  <!-- @update:modelValue="emit('update:modelValue', $event)"  一旦修改了，就会触发@update:modelValue事件，进行子传父，将触发得到的值更新到父页面的cateId里面 相当于完成了双向绑定 -->
  <el-select
    v-loading="loading"
    clearable
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <!--  :style="{ width }" 动态设置 style的样式 -->
    <!-- 使用v-for 渲染 -->
    <el-option
      v-for="data in articleList"
      :key="data.id"
      :label="data.cate_name"
      :value="data.id"
    />
  </el-select>
</template>
