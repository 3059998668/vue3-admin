<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ChannelSelect from './ChannelSelect.vue'
// 导入富文本编辑器 vue-quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishManageService,
  artArticleInfoManageService,
  artUpdateManageService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const isDrawer = ref(false) // 控制抽屉显示隐藏
const loading = ref(false) // 控制loding
const editorRef = ref()
const formRef = ref() // 意思是给该表单元素注册一个引用信息，并且这个引用信息的名称是 formRef。然后，我们就可以通过这个 formRef 在 Vue 实例中访问到这个表单元素。

// 默认数据,基于api来定义
const defaultData = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
// 准备数据
const formModel = ref({
  ...defaultData
})

// 验证规则
const rules = {
  // 文章标题
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    {
      pattern: /^\S{1,30}$/, // \S 不能为空 文章标题(1-30个任意字符)
      message: '文章标题需要是 1-30 位的非空字符',
      trigger: 'blur'
    }
  ],
  //   文章分类
  cate_id: [
    {
      required: true,
      message: '请选择文章分类',
      trigger: 'blur'
    }
  ],
  // 图片
  cover_img: [
    {
      required: true,
      message: '请选择文章封面图片',
      trigger: 'blur'
    }
  ],
  //   文章内容
  content: [
    {
      required: true,
      message: '请输入文章内容',
      trigger: 'blur'
    }
  ]
}

// 图片上传相关逻辑
const imageUrl = ref('') // 判断是否有图片 有图片则显示图片，没有图片则显示默认的icon

// 预览图片
const onSelectFile = (uploadFile) => {
  // uploadFile 拿到单个上传文件的file地址 ，  uploadFiles 拿到的是多个图片的fil地址
  //   console.log(uploadFile.arw) // 创建预览地址是要基于arw来创建的
  imageUrl.value = URL.createObjectURL(uploadFile.raw) // 创建好预览地址后，把他赋值给imageUrl
  //   把uploadFile.raw 存到 fromModel.value.cover_img 这样提交才能拿到图片地址
  formModel.value.cover_img = uploadFile.raw
}

// 发布和草稿的点击事件
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 1、需要验证表单
  // 拿到form表单的实例 formRef 在调用 validate() 进行表单验证
  await formRef.value.validate(async (valid) => {
    if (valid) {
      formModel.value.state = state // 让formModel.value.state 等于当前的状态
      //   发送请求，注意传递的格式需要是formData对象
      //   需要将普通对象转换成formData对象
      const fd = new FormData()
      for (let key in formModel.value) {
        // 吧数据追加到formData对象里的 使用 append 方法追加
        fd.append(key, formModel.value[key])
      }

      //   发请求 需要判断是编辑还是添加
      if (formModel.value.id) {
        // 有id 说明是编辑操作
        // 1、发送更新文章的请求
        loading.value = true
        await artUpdateManageService(fd)
        loading.value = false
        //2、 弹出更新成功提示
        ElMessage({
          type: 'success',
          message: '更新文章成功'
        })
        emit('success') // 定义好后，需要在父页面调用监听success 方法 第二个add是参数
      } else {
        // 1、添加操作,发送发布文章的请求
        loading.value = true
        await artPublishManageService(fd)
        loading.value = false
        //2、 弹出添加成功提示
        ElMessage({
          type: 'success',
          message: '发布新文章成功'
        })
        emit('success', 'add') // 定义好后，需要在父页面调用监听success 方法 第二个add是参数
      }
      // 3、关闭抽屉
      isDrawer.value = false
      // 4,刷新页面 => 需要刷新的是父组件，需要通过子传父的方式去刷新，使用 emit
      //   emit('success', 'add') // 定义好后，需要在父页面调用监听success 方法 第二个add是参数
    }
  }) //对整个表单的内容进行验证。 校验表单的内容 这个操作是异步的,需要加上await
}

// 组件对外暴露一个方法 open 基于open传来的参数,区分添加还是编辑
// open({}) => 表单无需渲染 ,说明是添加
// open({id, ..., ...})  => 表单需要渲染,说明是编辑
// open调用后,可以打开弹窗

const open = async (row) => {
  isDrawer.value = true //控制抽屉的显示
  if (row.id) {
    // 需要基于 row.id 发送请求,获取编辑对应的详情数据,进行回显
    const res = await artArticleInfoManageService(row.id)
    // 然后进行数据的回显
    formModel.value = res.data.data
    // 需要单独对图片进行回显 后台返回的是没有带基地址的路径，需要我们手动去拼接上基地址
    imageUrl.value = baseURL + formModel.value.cover_img
    // 注意： 提交给后台，需要的数据的格式，是file对象
    // 需要将网络图片地址 => 转换成 file 对象，存储起来
    formModel.value.cover_img = await imageUrlToFile(
      imageUrl.value,
      formModel.value.cover_img
    )
    await formRef.value.validate() // 一进编辑页面就需要进行校验
  } else {
    // 如果没有id说明是添加,则需要清空表单里的内容,保证表单里是没有数据的
    formModel.value = { ...defaultData } // 基于默认数据,重置form数据
    // 图片和富文本编辑器需要手动重置内容
    imageUrl.value = ''
    if (editorRef.value) return editorRef.value.setHTML('') // 调用富文本的setHTML方法，重置内容
  }
  //   console.log(row)
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 向外暴露方法 ,向租价外部暴露 方法 defineExpose
defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="isDrawer"
    :title="formModel.id ? '编辑文章' : '发布文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form
      v-loading="loading"
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <!-- 显示图片 -->
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <!-- theme="snow" 主题
            v-model:content="formModel.content"  // 数据内容双向绑定
            content-type="html"  内容的格式是html
         -->
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">{{
          formModel.id ? '更新' : '发布'
        }}</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  // 在 SCSS（Sass）中，:deep() 是一个选择器语法，用于在更深的层级上选择元素。它的主要目的是避免样式冲突和继承问题，以及简化嵌套选择器的使用。
  // 使用 :deep() 可以让你在更深的层级上应用样式，而不会影响其他同级元素。它通常与类名或标签名一起使用，以选择特定元素的后代。
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
