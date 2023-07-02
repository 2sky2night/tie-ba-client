import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
import { useMessage } from "naive-ui";
import tips from "@/config/tips";

/**
 * 检查路由参数(只能检查一个参数 且参数检查的类型为number)
 * @param key 路由参数中的那个key 
 * @param type params参数还是query参数
 */
export default function (key: string, type: 'params' | 'query' = 'params') {

    const route = useRoute()
    const router = useRouter()
    const message = useMessage()

    /**
     * 检查路由参数 (传入路由信息,默认为当前路由)
     * @param currentRoutes 需要检查的路由 
     * @returns 
     */
    function checkRoutes(currentRoutes: RouteLocationNormalizedLoaded = route) {
        const value = currentRoutes[type][key]
        if (value) {
            // 携带参数
            const temp = +value
            if (isNaN(temp)) {
                // 参数非法
                message.error(tips.errorParams)
                router.replace('/')
                return Promise.reject()
            } else {
                return Promise.resolve(temp)
            }
        } else {
            // 未携带参数
            message.error(tips.emptyParams)
            router.replace('/')
            return Promise.reject()
        }
    }

    return checkRoutes
}