type Status = "default" | "error" | "info" | "success" | "warning"

export interface LogsItem {
  type: Status,
  title: string;
  content: string;
  time: string;
}

// 更新日志
export const updateLogs:LogsItem[] = [
  {
    type: 'info',
    title: '项目上线🎉🎉🎉',
    content: '1.0版本',
    time:'2023-07-19 23:00:00'
  },
  {
    type: 'info',
    title: '功能增加',
    content: '首页增加下拉刷新功能',
    time:'2023-07-20 19:00:00'
  },
  {
    type: 'warning',
    title: '功能修复',
    content: '修复首页下拉刷新功能的bug',
    time:'2023-07-21 11:00:00'
  },
  {
    type: 'info',
    title: '功能增加',
    content: '首页增加检测新帖子功能+关于页面',
    time:'2023-07-21 12:00:00'
  },
  {
    type: 'info',
    title: '功能增加',
    content: '修改吧信息',
    time:'2023-07-21 17:40:00'
  },
  {
    type: 'info',
    title: '功能增加',
    content: '回复功能,与回复相关接口后续进行修改,如热帖、热评算法',
    time:'2023-07-27 12:00:00'
  },
  {
    type: 'info',
    title: '功能增加',
    content: '吧等级制度功能增加,用户可以进行签到,吧等级会在帖子详情、评论、回复、吧项组件中显示用户在该吧对应的等级',
    time:'2023-07-30 20:00:00'
  },
  {
    type: 'default',
    title: '功能增加+完善内容',
    content: '1.增加查看吧内用户等级排行榜以及吧内等级人数分布图功能 2.完善部分组件的文本显示 3.发帖支持MD语法编辑帖子内容',
    time:'2023-08-01 17:00:00'
  }
]