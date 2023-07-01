import AuthBtn from '@/components/common/AuthBtn/index.vue'
import FollowBtn from '@/components/common/FollowBtn/index.vue'
import ArticleItem from '@/components/item/ArticleItem.vue'
import ArticleListLoad from '@/components/list/load/ArticleList.vue'
import Empty from '@/components/common/Empty/index.vue'
import BarItem from '@/components/item/BarItem.vue'
import FollowBarBtn from '@/components/common/FollowBarBtn/index.vue'
import BarListLoad from '@/components/list/load/BarList.vue'

declare module 'vue' {
  export interface GlobalComponents {
    AuthBtn: typeof AuthBtn,
    FollowBtn: typeof FollowBtn,
    ArticleItem: typeof ArticleItem,
    ArticleListLoad: typeof ArticleListLoad,
    Empty: typeof Empty,
    BarItem: typeof BarItem,
    FollowBarBtn: typeof FollowBarBtn,
    BarListLoad: typeof BarListLoad
  }
}
