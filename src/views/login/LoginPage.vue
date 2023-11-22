<script setup>
import { userRegisterService, userLoginService } from '@/api/user.js' //导入api接口
import { User, Lock } from '@element-plus/icons-vue' // 先安装图标库,在引入使用
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const form = ref()

// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

// 整个表单的校验规则
// 正则校验 pattern: 正则规则    \S 非空字符
// 自定义校验 validator:(rule,value,callback)
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 5,
      max: 10,
      message: '用户名必须是 5-10位 的字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 注册按钮校验方法和提交事件
const register = async () => {
  // 注册成功之前,先进行校验,校验成功 在发送请求,校验失败 自动提示
  await form.value.validate() //点击注册进行校验,validate() 该方法可以在element官网查看文档
  await userRegisterService(formModel.value) //调用注册接口.传递需要的参数
  ElMessage({
    message: '注册成功,请登录',
    type: 'success'
  })
  isRegister.value = false // 切换到login登录
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate() //点击登录进行校验,validate() 该方法可以在element官网查看文档
  //  校验成功,写对应的登录接口
  const res = await userLoginService(formModel.value)
  //   登录成功则需要使用pinia来存储token 和提示登录成功, 和使用router跳转页面
  //   吧拿到的token使用pinia存储起来
  userStore.setToken(res.data.token)

  ElMessage({
    message: '登录成功',
    type: 'success'
  })
  //   登录成功后需要跳转到首页
  router.push('/')
}

// 忘记密码
const rememberState = ref(false) // 默认不记住密码
const remember = () => {
  console.log(rememberState.value)
  rememberState.value = !rememberState.value // 选中状态是true,不选中状态是false
  if (!rememberState.value)
    return userStore.setForgetPassword(rememberState.value, {}) // 说明没选中，则不保存账号密码，则传递一个空对象
  userStore.setForgetPassword(rememberState.value, formModel.value) // 说明选中，则保存账号密码，则传递一个formModel.value
}
// 监听rememberState的变化,如果变化了,则需要将pinia中的状态值也进行修改
const changeRememberState = () => {
  rememberState.value = userStore.forgetPassword
}

rememberState.value = userStore.forgetPassword // 一进页面就调用获取到pinia的状态值

onMounted(() => {
  if (!rememberState.value) return (formModel.value = {})
  formModel.value = userStore.storeObj
}),
  // 切换注册的时候,需要重置表单内容
  // 使用watch监听
  watch(isRegister, () => {
    formModel.value = {
      username: '',
      password: '',
      repassword: ''
    }
  })
</script>

<template>
  <!-- el-row表示一行,一行分成24份
        el-col表示列
        (1) :span="12" 代表在一行中,占12份 (50%)
        (2) :span="6" 代表在一行中,占6份 (25%)
        (3) :offset="3" 代表在一行中,左侧margin份数

        el-form 整个表单组件
        el-form-item 表单的一行 (表单域)
        el-input 表单元素 (输入框)
    2.校验相关
        (1)  el-form => :model="ruleForm" 绑定是整个form的数据对象
        (2)  el-form => :rules="rules" 绑定的整个rules规则对象
        (3)  表单元素 => v-model="ruleForm.xxx" 给表单元素,绑定form的子属性
        (4)  el-form-item => prop配置生效的是那个校验规则 (和rules中的字段要对应)
     -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox
              v-model="rememberState"
              @click="remember"
              @change="changeRememberState"
              >记住我</el-checkbox
            >
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
