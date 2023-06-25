import model from "../index";
import UserData from '@/components/common/UserData/index.vue'
import { h } from 'vue'

export default function userDataModel() {
    const userDataVNode = () => h(UserData)
    model('用户数据', userDataVNode)
}