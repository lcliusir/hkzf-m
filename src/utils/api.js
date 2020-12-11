import axios from 'axios'
import { BASE_URL } from './url'
import { getToken, removeToken } from './auth'

const API = axios.create({
  baseURL: BASE_URL
})

// 请求拦截器
API.interceptors.request.use(config => {
  const { url } = config
  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
    config.headers.Authorization = getToken()
  }
  return config
})

// 响应拦截器
API.interceptors.response.use(response => {
  const { status } = response.data
  if (status === 400) {
    removeToken()
  }
  return response
})

export { API }