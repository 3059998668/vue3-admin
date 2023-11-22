<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './component/ChannelSelect.vue'
import ArticleEdit from './component/ArticleEdit.vue'
import { artGetManageService, artDeleteManageService } from '@/api/article'
import { formatTime } from '@/utils/format' // 时间格式化

const artlist = ref([]) // 文章列表
const total = ref(0) // 数据总条数
const loading = ref(false)

// 定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

// 获取文章列表的请求
const getManageService = async () => {
  loading.value = true
  const res = await artGetManageService(params.value)
  artlist.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

getManageService()

const articleEditRef = ref()
// 添加逻辑
const addArticleBtn = () => {
  articleEditRef.value.open({}) // 拿到组件实例里面的open方法,然后传入一个空对象,代表是点击了添加按钮
}

// 编辑逻辑
const arthandleEdit = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const arthandleDelete = async (row) => {
  ElMessageBox.confirm('确认删除当前的文章吗?', '温馨提示!', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 发送请求删除
      await artDeleteManageService(row.id)
      //   提示删除成功
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      //   刷新当前的列表数据
      getManageService()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 搜索按钮事件
const searchBtn = () => {
  // 当点击搜索时候判断select有没有选中
  if (params.value.cate_id === '' && params.value.state === '')
    return ElMessage.error('请选择需要搜索的选项')
  // 从新发送请求，获取选中后的数据
  getManageService()
}

// 重置按钮事件
const resetBtn = () => {
  params.value.cate_id = ''
  params.value.state = ''
  getManageService()
}

// 分页事件

// 选中了多少条数据，则触发的事件
const handleSizeChange = (size) => {
  // 只要是每页条数变化了，那么原本正则访问的当前页意义不大，数据大概率已经不再原来那一页了
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  getManageService()
}

// 点击第几页触发的事件
const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getManageService()
}

// 监听子传父的方法
const onSuccess = (type) => {
  if (type === 'add') {
    // 说明是发布文章，需要刷新到最后一页
    //( 总条数 + 1 ) / params.pagesize 拿到最后一页 Math.ceil 向上取整
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 让params.value.pagenum 更新成最大页数
    params.value.pagenum = lastPage
  }
  getManageService()
}
</script>
<template>
  <PageContainer title="文章管理">
    <!-- 具名插槽 -->
    <template #extra>
      <el-button type="primary" @click="addArticleBtn">发布文章</el-button>
    </template>
    <!-- 内容插槽 -->
    <!-- inline 在一行显示 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- vue2 => v-model :value 和 @input 的简写 -->
        <!-- vue3 => v-model :modelVlue 和 @update:modelvalue 的简写 -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select clearable v-model="params.state">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">搜索</el-button>
        <el-button @click="resetBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格内容 -->
    <el-table :data="artlist" v-loading="loading">
      <el-table-column prop="title" label="文章标题">
        <!-- 链接的效果 -->
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
          <!-- 调用格式化时间的方法 -->
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            size="small"
            @click="arthandleEdit(scope.row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            size="small"
            type="danger"
            @click="arthandleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无文章列表" />
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑的抽屉 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>
