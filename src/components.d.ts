import AuthBtn from '@/components/common/AuthBtn/index.vue'
import FollowBtn from '@/components/common/FollowBtn/index.vue'

declare module 'vue' {
  export interface GlobalComponents {
    AuthBtn: typeof AuthBtn,
    FollowBtn: typeof FollowBtn
  }
}
