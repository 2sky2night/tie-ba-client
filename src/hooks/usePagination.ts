import { reactive, watch } from 'vue'

/**
 * 分页的钩子函数 传入获取数据的函数
 * 监听页码page更新 重新获取数据
 * @param cb 
 * @returns 
 */
export default function (cb: any) {

    const pagination = reactive({
        page: 1,
        pageSize: 20,
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
    watch(() => pagination.page, () => {
        cb()
    })

    return pagination
}