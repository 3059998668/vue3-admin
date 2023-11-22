<script setup>
import { ref } from 'vue'
// 基于pinia 获取到user数据，进行渲染
import { useUserStore } from '@/stores' // 拿到本地的用户信息
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'
const {
  user: { id, email, nickname, username }
} = useUserStore()
const form = ref({
  id,
  username,
  nickname,
  email
})
const rules = ref({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度应在2-10个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})
const formRef = ref(null)
const submitForm = async () => {
  // 触发表单校验
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求，修改基本资料
      await userUpdateInfoService(form.value)
      // 提示用户信息更新成功
      ElMessage({
        type: 'success',
        message: '修改用户信息成功'
      })
      // 通知user 模块 ，进行数据的更新 就是从新获取一下userInfo
      useUserStore().userInfo()
      // location.reload()
      // window.location.reload()
    }
  })
}
</script>
<template>
  <PageContainer title="基本资料">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="width: 50%"
    >
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
