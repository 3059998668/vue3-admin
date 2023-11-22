<script setup>
import { ref } from 'vue'
import { userUpdatePwdService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores' // 导入用户模块的pinia
import router from '@/router/index'
const userStore = useUserStore()
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const rules = {
  old_pwd: [
    { required: true, message: '请输入老密码', trigger: 'blur' },
    {
      pattern: /^[\S]{6,15}$/,
      message: '老密码必须为6-15位非空格字符',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^[\S]{6,15}$/,
      message: '新密码必须为6-15位非空格字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value === form.value.old_pwd) {
          callback(new Error('新密码不能与老密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      pattern: /^[\S]{6,15}$/,
      message: '确认新密码必须为6-15位非空格字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.new_pwd) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const formRef = ref(null)
const handleChangePwd = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      console.log(form.value)
      //  发送请求重置密码
      await userUpdatePwdService(form.value)
      // 提示重置密码成功
      ElMessage({
        type: 'success',
        message: '重置密码成功'
      })
      // 清除用户的token信息
      userStore.removeToken()
      // 设置用户的user信息
      userStore.setInfo({})
      // 需要跳转到登录页面
      router.push('/login')
    }
  })
}
const handleReset = () => {
  form.value.old_pwd = ''
  form.value.new_pwd = ''
  form.value.re_pwd = ''
}
</script>
<template>
  <PageContainer title="重置密码">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      style="width: 50%"
    >
      <el-form-item label="老密码" prop="old_pwd">
        <el-input v-model="form.old_pwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="form.new_pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="form.re_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleChangePwd">修改密码</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
