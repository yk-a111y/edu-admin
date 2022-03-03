import request from '@/utils/request'

// 获取资源列表
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类列表
export const getResourceCategory = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 根据资源Id获取资源
export const getResourceById = id => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 保存或更新资源分类
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 删除资源
export const deleteResource = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
