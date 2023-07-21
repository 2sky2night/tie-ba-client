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
  }
]