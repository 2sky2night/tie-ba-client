import { star, end } from '@/plugins/nprogress'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type BaseResponse from './types'

// axios实例
const http = axios.create({
  baseURL: '/api'
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 开启进度条
    star()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  async (response: AxiosResponse<BaseResponse>) => {
    try {
      if (response.data.code === 200) {
        // 业务请求成功
        console.log('业务请求成功')
        end()
        return response.data.data
      } else {
        // 业务请求失败
        console.log('业务请求失败')
        end()
        await Promise.reject(response.data.message)
      }
    } catch (error) {
      return error
    }
  },
  (error) => {
    console.log('响应拦截器走的是失败的回调')
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