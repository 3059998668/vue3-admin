import request from '@/utils/request'

// 获取文章分类
export const artGetChannelService = () => request.get('/my/cate/list')

//添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data) // 如果是对象的写法需要加上return 否则返回不了最新数据
}

// 删除文章分类
export const artDeleteChannelService = (id) =>
  request.delete('/my/cate/del', {
    // Query 参数 需要params 接收
    params: { id }
  })

// 更新文章分类
export const artUpdateChannelService = (data) =>
  request.put('/my/cate/info', data)

// 获取文章分类详情
export const artGetCateInfoChannelService = (id) =>
  request.get('/my/cate/info', id)

//   获取文章管理列表
export const artGetManageService = (data) =>
  request.get('/my/article/list', {
    params: data
  })

//   发布文章
// 注意： 这里需要提交的是一个formData格式的对象
export const artPublishManageService = (formData) =>
  request.post('/my/article/add', formData)

//   更新文章 需要formDate格式的对象
export const artUpdateManageService = (formDate) =>
  request.put('/my/article/info', formDate)

//   获取文章详情
export const artArticleInfoManageService = (id) =>
  request.get('/my/article/info', { params: { id } })

//   删除文章
export const artDeleteManageService = (id) =>
  request.delete('/my/article/info', {
    params: { id }
  })
