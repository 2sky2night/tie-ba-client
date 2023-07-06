import AuthBtn from '@/components/common/AuthBtn/index.vue'
import FollowBtn from '@/components/common/FollowBtn/index.vue'
import ArticleItem from '@/components/item/ArticleItem.vue'
import ArticleListLoad from '@/components/list/load/ArticleList.vue'
import Empty from '@/components/common/Empty/index.vue'
import BarItem from '@/components/item/BarItem.vue'
import FollowBarBtn from '@/components/common/FollowBarBtn/index.vue'
import BarListLoad from '@/components/list/load/BarList.vue'
import UserItem from '@/components/item/UserItem.vue'
import UserList from '@/components/list/pagination/UserList.vue'
import ArticleListInf from '@/components/list/load/ArticleListInf.vue'
import ArticleListSkeleton from '@/components/skeleton/list/ArticleSkeletonList.vue'
import BarListSkeleton from '@/components/skeleton/list/BarListSkeleton.vue'
import UserListSkeleton from '@/components/skeleton/list/UserListSkeleton.vue'

declare module 'vue' {
  export interface GlobalComponents {
    AuthBtn: typeof AuthBtn,
    FollowBtn: typeof FollowBtn,
    ArticleItem: typeof ArticleItem,
    ArticleListLoad: typeof ArticleListLoad,
    Empty: typeof Empty,
    BarItem: typeof BarItem,
    FollowBarBtn: typeof FollowBarBtn,
    BarListLoad: typeof BarListLoad,
    UserItem: typeof UserItem,
    UserList: typeof UserList,
    ArticleListInf: typeof ArticleListInf,
    ArticleListSkeleton: typeof ArticleListSkeleton,
    BarListSkeleton: typeof BarListSkeleton,
    UserListSkeleton:typeof UserListSkeleton,
  }
}
