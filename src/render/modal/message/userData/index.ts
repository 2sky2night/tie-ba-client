// render
import modal from "../index";
// components
import UserData from '@/components/common/UserData/index.vue'
// hooks
import { h } from 'vue'
// types
import type { UserDataProps } from "@/types/components/common";

export default function userDataModal (props: UserDataProps) {
    const userDataVNode = () => h(UserData, { ...props })
    modal('用户数据', userDataVNode)
}