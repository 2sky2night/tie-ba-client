// hooks
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import useNavigation from '@/hooks/useNavigation'
// apis
import { loginAPI } from '@/apis/login'
import { getUserInfoAPI } from '@/apis/my/index'
// types
import { UserData } from './types'
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
            createTime: ''
        })

        const { goLogin } = useNavigation()

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
                const res = await getUserInfoAPI()
                // 获取当前登录的用户数据
                userData.value.uid = res.data.uid
                userData.value.username = res.data.username
                userData.value.avatar = res.data.avatar
                userData.value.createTime = res.data.createTime
            } catch (error) {
                return Promise.reject(error)
            }
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
            goLogin()
            Token.removeToken()
        }

        /**
         * 用户是否登录
         */
        const isLogin = computed(() => {
            return token.value && userData.value.uid && userData.value.username ? true : false
        })


        return {
            token,
            userData,
            isLogin,
            toLogin,
            toGetUserInfo,
            toLogout
        }
    },
    {
        persist: true
    }
)

export default useUserStore

