// hooks
import { reactive, onBeforeUnmount, ref,onMounted } from 'vue'
import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router'
// configs
import PubSub from 'pubsub-js'
// utils
import { formatNumber } from '@/utils/tools'

// 搜索页的钩子
// 有一个bug 就是当路由有keywords和page时 通过修改路由url去除查询参数 本不能进行发送请求查询的 但还是会发起请求
export default function (cb: any) {

  const router = useRouter()
  const route = useRoute()
  // 路由查询参数中的keywords
  const searchKeywords = ref(route.query.keywords ? route.query.keywords as string:'')
  let isFirst = true

  // 分页数据
  const pagination = reactive({
    page: 1,
    total: 0,
    pageSize: 20
  })

  // 初始化page
  getRouteQueryPage()

  // 获取路由查询参数的page 非法就重置为1
  function getRouteQueryPage(currentRoute = route) {
    // 携带了page参数
    if (currentRoute.query.page !== undefined) {
      const temp = formatNumber(currentRoute.query.page as string)
      if (temp === false || temp < 1) {
        console.log('page参数非法 恢复为1')
        // 恢复页码为1
        router.replace({
          path: route.path,
          query: {
            ...route.query,
            page: 1
          }
        })
      } else {
        pagination.page = temp
      }
    }
  }


  // 点击页码按钮的回调
  const onHandleUpdatePage = (value: number) => {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        page: value
      }
    })
  }

  // pageSize更新的回调
  const onHandleUpdatePageSize = (value: number) => {
    pagination.pageSize = value
    // 重置页码为1
    router.push({
      path: route.path,
      query: {
        ...route.query,
        page: 1
      }
    })
  }

  // 监听search事件 keywords路由参数变化时 重置页码
  PubSub.subscribe('search', (_, value: string | null) => {

    if (value !== null) {
      searchKeywords.value = value

      // 重置页码 路由更新
      router.push({
        path: route.path,
        query: {
          ...route.query,
          // 第一次加载？
          page: isFirst ? pagination.page : 1
        }
      })
      if (isFirst) {
        // 初始化获取数据
        isFirst = false
      }
      console.log('search pubsub---有搜索关键词');
    } else {
      searchKeywords.value = ''
      console.log('search pubsub---无搜索关键词');
    }
  })

  // 初始化若携带了query参数就加载数据
  onMounted(() => {
    if (searchKeywords.value) {
      cb()
    }
  })

  // 路由更新的回调
  onBeforeRouteUpdate((to) => {
    if (searchKeywords.value.length) {
      // 更新page
      getRouteQueryPage(to)
      // 页码更新发送请求获取最新数据 (由于路由更新钩子是同时按顺序执行的 需要等待该钩子获取了当前的搜索关键词后才能进行获取数据)
      setTimeout(() => {
        cb()
      })
    }

  })

  onBeforeUnmount(() => {
    //取消关注
    PubSub.unsubscribe('search')
  })

  return { pagination, searchKeywords, onHandleUpdatePage, onHandleUpdatePageSize }

}