<template>
  <div class="rank-info">
    <div class="title mb-10">
      <span>吧等级头衔一览</span>
      <n-button v-if="isShowEdit" :loading="isLoading" @click="onHandleEdit" size="small">{{ isEdit ? '完成' : '编辑' }}</n-button>
    </div>
    <n-data-table :row-key="(row: BarRankItem) => row.level" :columns="columns" :data="barRank" :bordered="false" />
  </div>
</template>

<script lang='ts' setup>
// apis
import { getBarRankRuleAPI, editBarBankRuleAPI } from '@/apis/bar';
// hooks
import { reactive, onBeforeMount, watch, ref, h,computed } from 'vue'
import { useMessage } from 'naive-ui';
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
// types
import type { BarRankItem } from '@/apis/bar/types';
import type { DataTableColumns, FormItemInst } from 'naive-ui'
// compoents
import RankBadge from '@/components/common/RankBadge/index.vue'
import { NInput, NFormItem } from 'naive-ui';
// config
import tips from '@/config/tips';

// 用户仓库
const { userData } = storeToRefs(useUserStore())
// 表单项实例
const formInsList = ref<FormItemInst[]>([])
// 吧等级制度列表
const barRank = reactive<BarRankItem[]>([])
// props 获取吧id
const props = defineProps<{ bid: number }>()
// 吧主的uid
const uid= ref<null | number>(null)
// 第一次加载
const isFirstLoading = ref(false)
// 正在加载
const isLoading = ref(false)
// 当前处于编辑状态？
const isEdit = ref(false)
// message
const message = useMessage()
// 当前编辑的是哪一个元素？
let currentEditIndex = 0
// 是否渲染编辑按钮
const isShowEdit = computed(() => {
  if (uid.value === userData.value.uid) {
    return true
  } else {
    return false
  }
})

// 获取吧等级制度
async function getData() {
  isFirstLoading.value = true
  const res = await getBarRankRuleAPI(props.bid)
  res.data.rank_rules.forEach(ele => barRank.push(ele))
  // 记录吧主信息
  uid.value = res.data.uid
  isFirstLoading.value = false
}

// 渲染表头
const columns: DataTableColumns<BarRankItem> = [
  {
    title: '等级',
    key: 'level'
  },
  {
    title: '头衔',
    key: 'label',
    render(row) {
      return h(
        'div',
        {
          style: 'display: flex;align-items: center;'
        },
        [
          h(RankBadge, { level: row.level, class: 'mr-5' }),
          isEdit.value ? renderInput(row) : h('span', row.label)
        ]
      )
    }
  },
  {
    title: '所需经验',
    key: 'score'
  }
]

// 渲染编辑输入框
const renderInput = (row: BarRankItem) => {
  return h(
    NFormItem,
    {
      ref(compt) {
        // 获取表单项
        formInsList.value[row.level - 1] = compt as any
      },
      size: 'small',
      rule: {
        trigger: ['input', 'blur'],
        validator() {
          if (barRank[currentEditIndex].label) {
            return true
          } else {
            return new Error(tips.formNotEmpty('头衔昵称'))
          }
        }
      }
    },
    {
      default: () => h(
        NInput,
        {
          maxlength: 15,
          value: row.label,
          onUpdateValue(value: string) {
            row.label = value.trim()
          },
          onFocus() {
            // 通过row数据来获取当前编辑的索引
            currentEditIndex = row.level - 1
          }
        }
      )
    }
  )

}

// 点击编辑/确认的回调
const onHandleEdit = async () => {
  if (isEdit.value) {
    // 点击确认

    try {
      // 需要校验每一项昵称是否合法
      for (currentEditIndex = 0; currentEditIndex < formInsList.value.length; currentEditIndex++) {
        await formInsList.value[currentEditIndex].validate()
      }
    } catch (error) {
      // 校验失败
      console.log(error);
      return
    }
    // 校验成功
    isLoading.value = true
    await editBarBankRuleAPI({ bid: props.bid, rankLableList: barRank.map(ele => ele.label) })
    message.success(tips.successEditBarRankRule)
    isLoading.value = false
    // 切换为查看状态
    isEdit.value = false
    // 当修改吧等级后 需要同步更新用户当前的等级头衔（场景：吧主修改了头衔）
    PubSub.publish('updateRank', barRank)

  } else {
    // 点击编辑
    isEdit.value = true
  }
}

// 初始化加载
onBeforeMount(getData)
// 路由更新加载最新数据
watch(() => props.bid, () => {
  barRank.length = 0
  getData()
})

</script>

<style scoped lang="scss">
.rank-info {
  .title {
    display: flex;
    justify-content: space-between;

    span {
      font-weight: 600;
      font-size: 20px;
      color: var(--primary-color);
      transition: var(--time-normal);
    }
  }
}

@media screen and (max-width:650px) {
  .rank-info {
    .title {
      span {
        font-size: 16px;
      }
    }
  }
}
</style>