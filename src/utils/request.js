import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  timeout: 5000
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 设置请求拦截器
request.interceptors.request.use(config => {
  config.baseURL = getBaseURL(config.url)
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储是否正在更新Token的状态
let isRefreshing = false
// 存储因为等待 Token 而挂起的请求
let requests = []

// 设置响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码为2xx时（响应成功时）执行这部分功能
  // console.log('响应成功了', response)
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接收完毕但状态码为失败的情况
    // 1.判断状态码情况（主要处理401的情况）
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 1.无Token信息
      if (!store.state.user) {
        // 跳转登录页
        redirectLogin()
        return Promise.reject(error)
      }
      // 检测是否已经存在了正在刷新Token的请求
      if (isRefreshing) {
        // 将当前失败的请求存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，自动发送本次失败请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 2.Token 无效处理（错误Token或者Token过期）
      // 发送请求，获取access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 刷新token失败
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          // 跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        // - 存储新的token
        store.commit('setUser', res.data.content)
        // - 重新发送失败请求（根据requests发送失败请求）
        requests.forEach(callback => callback())
        // - 发送完毕清除requests内容
        requests = []
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求完成将状态改为false即可
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限 请联系管理员'
    } else if (status === 404) {
      errorMessage = '资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但未接收到响应
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    console.log('Error', error.message)
  }
  // 将本次请求的错误，继续向后抛出，让接收响应的处理函数接收进行操作
  return Promise.reject(error)
})

export default request
