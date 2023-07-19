// hooks
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
// apis
import { loginAPI } from '@/apis/login'
import { getUserInfoAPI } from '@/apis/my/index'
import { getUserBaseInfoAPI } from '@/apis/public/user'
import { editUserInfoAPI, editUserPasswordAPI } from '@/apis/edit'
// types
import { UserData } from './types'
import { EditUserInfoBody, EditUserPasswordBody } from '@/apis/edit/types'
// utils
import Token from '@/utils/token'

const useUserStore = defineStore(
    'user',
    () => {

        /**
         * 用户token 记录用户登录状态
         */
        const token = ref<null | string>(null)

        /**
         * 用户信息
         */
        const userData = ref<UserData>({
            avatar: '',
            uid: 0,
            username: '',
            createTime: '',
            udesc: ''
        })

        /**
         * 用户浏览的历史记录帖子
         */
        const historyAids = ref<number[]>([])

        const historySearch = ref<({ time: number; title: string })[]>([])

        /**
         * 用户登录
         * @param username 用户名 
         * @param password 密码
         */
        const toLogin = async (username: string, password: string) => {
            try {
                const res = await loginAPI({ username, password })
                // 登录成功 在仓库和本地保存token
                token.value = res.data
                Token.setToken(res.data)
                // 登陆成功后获取用户数据
                await toGetUserInfo()
            } catch (error) {
                return Promise.reject(error)
            }
        }

        /**
         * 获取当前登录的用户数据
         * @returns 
         */
        const toGetUserInfo = async () => {
            try {
                const res = await getUserBaseInfoAPI()
                // 获取当前登录的用户数据
                userData.value.uid = res.data.uid
                userData.value.username = res.data.username
                userData.value.avatar = res.data.avatar
                userData.value.createTime = res.data.createTime
                userData.value.udesc = res.data.udesc
            } catch (error) {
                return Promise.reject(error)
            }
        }

        /**
         * 编辑用户信息
         * @param data 
         */
        const toEditUserInfo = async (data: EditUserInfoBody) => {
            try {
                await editUserInfoAPI(data)
                // 编辑成功 修改用户数据
                userData.value.avatar = data.avatar
                userData.value.username = data.username
                userData.value.udesc = data.udesc
            } catch (error) {
                return Promise.reject(error)
            }
        }

        /**
         * 编辑用户密码 成功后注销用户重新登录
         * @param data 
         */
        const toEditUserPassword = async (data: EditUserPasswordBody) => {
            await editUserPasswordAPI(data)
            // 注销并重新登录
            toLogout()
        }

        /**
         * 清空用户数据并清除本地数据(token和用户数据) 返回登陆页
         */
        const toLogout = () => {
            token.value = null
            userData.value.avatar = ''
            userData.value.createTime = ''
            userData.value.username = ''
            userData.value.uid = 0
            router.replace('/login')
            Token.removeToken()
        }

        /**
         * 添加帖子历史记录
         * @param aid 
         */
        const addHistory = (aid: number) => {
            // 查询历史记录是否存在
            const index = historyAids.value.findIndex(ele => ele === aid)

            if (index !== -1) {
                // 若存在该帖子的历史记录 则删除该帖子记录
                historyAids.value.splice(index, 1)
            }
            // 将帖子id保存在历史记录中
            historyAids.value.unshift(aid)
        }

        /**
         * 删除某项帖子历史记录
         * @param aid 
         */
        const deleteHistory = (aid: number) => {
            historyAids.value.some((ele, index, arr) => {
                if (ele === aid) {
                    arr.splice(index, 1)
                }
            })
        }

        /**
         * 清除所有帖子历史记录
         */
        const clearAllHistory = () => {
            historyAids.value.length = 0
        }

        /**
         * 添加搜索历史记录
         * @param title 
         */
        const addSearchHistroy = (title: string) => {
            const index = historySearch.value.findIndex(ele => ele.title === title)
            // 若存在该搜索词条 则删除该历史记录
            if (index !== -1) {
                historySearch.value.splice(index, 1)
            }
            // 保存历史记录
            historySearch.value.unshift({
                time: Date.now(),
                title
            })
        }

        /**
         * 删除搜索历史记录
         * @param time 
         */
        const deleteSearchHistory = (time: number) => {
            historySearch.value.some((ele, index, arr) => {
                if (ele.time === time) {
                    arr.splice(index, 1)
                }
            })
        }

        /**
         * 用户是否登录
         */
        const isLogin = computed(() => {
            return token.value ? true : false
        })

        // 若加载页面时 当前已经登录了 就获取最新的用户个人信息来更新本地用户数据
        setTimeout(() => {
            if (isLogin.value) {
                toGetUserInfo()
            }
        })

        return {
            token,
            userData,
            historyAids,
            historySearch,
            isLogin,
            toLogin,
            toGetUserInfo,
            toLogout,
            toEditUserInfo,
            toEditUserPassword,
            addHistory,
            deleteHistory,
            clearAllHistory,
            addSearchHistroy,
            deleteSearchHistory
        }
    },
    {
        persist: true
    }
)

export default useUserStore

