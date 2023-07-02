import { formatNumber } from '@/utils/tools'
import { reactive, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'

/**
 * 分页的钩子函数 传入获取数据的函数
 * 监听页码或路由查询参数page更新
 * 支持校验路由的page参数
 * @param cb 
 * @returns 
 */
export default function (cb: any) {

    const router = useRouter()
    const route = useRoute()
    let routePage = 1

    // 初始化解析路由参数page
    if (route.query.page !== undefined) {
        const res = formatNumber(route.query.page as string)
        if (typeof res === 'number') {
            // 是一个数字
            if (res < 1) {
                // 小于一 重置为1 更新路由
                router.replace({ path: route.path, query: { ...route.query, page: 1 } })
            } else {
                routePage = res
            }
        } else {
            // 不是一个数字 重置为1 更新路由
            router.replace({ path: route.path, query: { ...route.query, page: 1 } })
        }
    } else {
        // 未携带page参数
        router.replace({ path: route.path, query: { ...route.query, page: 1 } })
    }

    const pagination = reactive({
        page: routePage,
        pageSize: 20,
        total: 0,
        has_more: false
    })

    // 页长度更新的回调
    watch(() => pagination.pageSize, () => {
        if (pagination.page === 1) {
            cb()
            router.push({ path: route.path, query: { ...route.query, page: 1 } })
        } else {
            pagination.page = 1
        }

    })

    // 页码更新的回调
    watch(() => pagination.page, (v) => {
        cb()
        router.push({ path: route.path, query: { ...route.query, page: v } })
    })


    // 路由更新时解析路由 (路由查询参数更新的回调)
    onBeforeRouteUpdate((to) => {
        if (to.query.page !== undefined) {
            const res = formatNumber(to.query.page as string)
            if (typeof res === 'number') {
                // 是一个数字
                if (res < 1) {
                    // 小于一 重置为1 更新路由
                    pagination.page = 1
                    router.replace({ path: to.path, query: { ...to.query, page: 1 } })
                } else {
                    // 大于1 获取页码
                    pagination.page = res
                }
            } else {
                // 不是一个数字 重置为1 更新路由
                pagination.page = 1
                router.replace({ path: to.path, query: { ...to.query, page: 1 } })
            }
        } else {
            // 未携带参数
            pagination.page = 1
            router.replace({ path: to.path, query: { ...to.query, page: 1 } })
        }
    })

    return pagination
}