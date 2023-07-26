import ReplyDetail from '@/components/common/ReplyDetail/index.vue';
import drawerAPI from '..';

export default function replyDrawerAPI (cid: number) {
  drawerAPI<{ cid: number }>('所有回复',ReplyDetail, { cid })
}