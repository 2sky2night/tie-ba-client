import { formatNumber } from '@/utils/tools'
import { reactive, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'

/**
 * 分页的钩子函数 传入获取数据的函数 （用了该钩子最好不要再使用onBeforeRouteUpdate，会出现意想不到的错误）
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
        // 携带了page参数
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
    }

    const pagination = reactive({
        page: routePage,
        pageSize: 10,
        total: 0,
        has_more: false
    })

    // 页长度更新的回调
    watch(() => pagination.pageSize, () => {
        if (pagination.page === 1) {
            cb()
        } else {
            pagination.page = 1
        }
    })

    // 页码更新的回调
    watch(() => pagination.page, (v) => {
        console.log('页码更新', v)
        cb()
        router.replace({ path: route.path, query: { ...route.query, page: v } })
    })


    // 路由更新时解析路由 (路由查询参数更新的回调)
    onBeforeRouteUpdate((to) => {
        console.log('分页钩子路由更新执行', pagination.page)
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
            // 不能加下面这段代码 会导致路由重复的更新也就是外层在使用路由监听的钩子会重复执行
            // router.replace({ path: to.path, query: { ...to.query, page: 1 } })
        }
    })

    // function resetPage () {
    //     if (pagination.page === 1) {
    //         cb()
    //     } else {
    //         pagination.page=1
    //     }
    // }

    return pagination
}