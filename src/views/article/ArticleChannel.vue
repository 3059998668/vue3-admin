<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelService, artDeleteChannelService } from '@/api/article' // 文章的api接口
import ChannelEdit from './component/ChannelEdit.vue'
// 获取文章分类
const activeList = ref([]) // 文章的分类
const dialog = ref() // 判断是编辑还是添加
const loading = ref(false) // 加载效果 发送请求的时候加载,请求完成了则不加载

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelService()
  console.log(res)
  activeList.value = res.data.data
  loading.value = false
}
getChannelList()

// 编辑事件
const handleEdit = (index, row) => {
  dialog.value.open(row)
}
// 添加分类事件
const addChannel = () => {
  dialog.value.open({})
}
// 删除事件
const handleDelete = async (index, row) => {
  //   console.log(row, index)
  ElMessageBox.confirm('确定要删除该文章分类吗?', '温馨提示!', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      //   调用删除文章分类的api
      await artDeleteChannelService(row.id)
      //  删除成功需要提示用户已删除成功
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      //   删除成功后需要刷新页面,从新调用一下 getChannelList()
      getChannelList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 子组件里触发emit事件,则在父组件执行
const onSuccess = () => {
  getChannelList() // 从新刷新页面
}
</script>
<template>
  <PageContainer title="文章分类">
    <template #extra>
      <!-- 具名插槽的用法 -->
      <el-button type="primary" @click="addChannel">添加分类</el-button>
    </template>
    <!-- 主体内容 -->
    <el-table :data="activeList" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>

      <!-- 空数据显示 -->
      <template #empty>
        <el-empty description="暂无分类列表" />
      </template>
    </el-table>

    <!-- 分类编辑弹窗  父组件监听到子组件里success  emit方法 -->
    <!-- <Channel-Edit ref="dialog" @success="onSuccess"></Channel-Edit> -->
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </PageContainer>
</template>
