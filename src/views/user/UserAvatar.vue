<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
// 基于stores的数据，初始化imgUrl的初始值
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
const userStore = useUserStore() // 拿到用户信息
const uploadRef = ref() // 上传组件的引用
const imgUrl = ref(userStore.user.user_pic) // 用户头像

// 图片上传成功后的回调
const onUploadFile = (file) => {
  // 基于 fileReader 读取图片的预览
  const reader = new FileReader() // 创建一个文件读取对象
  reader.readAsDataURL(file.raw) // 读取文件
  reader.onload = () => {
    // 读取成功后的回调
    imgUrl.value = reader.result // 将读取到的结果赋值给 imgUrl
  }
}
// 点击上传图片
const onUpdateAvatar = async () => {
  await userUpdateAvatarService(imgUrl.value) // 发送请求
  await userStore.userInfo() // 更新用户信息
  ElMessage({ type: 'success', message: '更换头像成功' })
}
</script>
<template>
  <PageContainer title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onUploadFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      >选择图片</el-button
    >
    <el-button @click="onUpdateAvatar" type="success" :icon="Upload"
      >上传图片</el-button
    >
  </PageContainer>
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 300px;
  height: 300px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
