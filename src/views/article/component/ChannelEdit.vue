<script setup>
import { ref } from 'vue'
import { artUpdateChannelService, artAddChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false) //弹窗
const formRef = ref() // 意思是给该表单元素注册一个引用信息，并且这个引用信息的名称是 formRef。然后，我们就可以通过这个 formRef 在 Vue 实例中访问到这个表单元素。
// 定义表单的modele
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

//定义校验规则的rules
const rules = {
  cate_name: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
    // { min: 4, max: 8, message: '请输入 4-8 位的分类名称', trigger: 'blur' }
    {
      pattern: /^\S{4,15}$/, // \S 不能为空
      message: '分类名称需要是 4-15 位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '分类别名不能为空', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{4,15}$/, //[a-zA-Z0-9]只允许字母或数字
      message: '分类别名需要是 4-15 位的字母或数字',
      trigger: 'blur'
    }
  ]
}

// 组件对外暴露一个方法 open 基于open传来的参数,区分添加还是编辑
// open({}) => 表单无需渲染 ,说明是添加
// open({id, cate_name, ...})  => 表单需要渲染,说明是编辑
// open调用后,可以打开弹窗

const open = async (row) => {
  dialogVisible.value = true //控制弹窗的显示
  console.log(row)
  formModel.value = { ...row } //让当前返回的数据赋值给formModel.value 来做回显
}

// 向外暴露方法 ,向租价外部暴露方法 defineExpose
defineExpose({
  open
})

// 确认按钮
const emit = defineEmits(['success']) // 定义一个emit
const onSubmit = async () => {
  await formRef.value.validate() // 校验表单的内容 这个操作是异步的,需要加上await
  // 判断是调用编辑,还是添加的api

  formModel.value.id
    ? await artUpdateChannelService(formModel.value)
    : await artAddChannelService(formModel.value)

  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  // if (formModel.value.id) {
  //   // 如果有id说明是编辑
  //   await artUpdateChannelService(formModel.value)
  // } else {
  //   await artAddChannelService(formModel.value)
  // }
  //   关闭弹窗
  dialogVisible.value = false
  //   通过子传父更新父页面
  emit('success') // 触发success 事件,然后在父页面定义这个success事件,执行刷新操作
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 50px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
