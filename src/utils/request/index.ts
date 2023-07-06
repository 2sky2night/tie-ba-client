import { star, end } from '@/plugins/nprogress'
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type BaseResponse from './types'
import Token from '../token'
import router from '@/router'
import useUserStore from '@/store/user'
import tips from '@/config/tips'

// axios实例
const http = axios.create({
  baseURL: '/api'
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 开启进度条
    star()
    // 根据当前登录状态 在请求头部携带Authorization
    const userStore = useUserStore()
    if (userStore.isLogin) {
      config.headers.Authorization = 'Bearer ' + userStore.token
    }
    return config
  },
  (error) => {
    end()
    window.$message.error('请求失败!')
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  async (response: AxiosResponse<BaseResponse>): Promise<any> => {
    if (response.data.code === 200) {
      // 业务请求成功
      end()
      console.log('业务请求成功')
      return response.data
    } else {
      // 业务请求失败
      end()
      console.log('业务请求失败')
      window.$message.error(response.data.message)
      return Promise.reject(response)
    }
  },
  (error: AxiosError<BaseResponse>) => {
    end()
    console.log('响应拦截器走的是失败的回调', error)
    if (error.response) {
      // 服务器响应了内容
      const status = error.response.status
      if (status === 401) {
        // token过期或没有token、token非法的错误 根据登录状态返回登陆页并注销用户
        const userStore = useUserStore()
        if (userStore.isLogin) {
          // 若用户登陆 则注销用户信息
          userStore.toLogout()
        } else {
          // 未登录 返回登陆页
          router.replace('/login')
        }
        window.$message.error(error.response.data.message)
      } else if (status === 404) {
        // 资源请求不存在
        window.$message.error(tips.notFound)
        router.replace('/')
      } else {
        window.$message.error(error.response.data.message)
      }
    } else {
      // 其他错误
      window.$message.error('响应出错了!')
    }
    return Promise.reject(error)
  }
)


export default {
  get<T> (url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return http.get(url, config)
  },
  post<T> (url: string, data: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return http.post(url, data, config)
  },
  put<T> (url: string, data: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return http.put(url, data, config)
  },
  delete<T> (url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return http.delete(url, config)
  }
}