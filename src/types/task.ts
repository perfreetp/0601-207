export type TaskType = 'followup' | 'deal' | 'material'
export type TaskStatus = 'pending' | 'done' | 'overdue'

export interface Task {
  id: string
  type: TaskType
  title: string
  description: string
  customerName: string
  customerId: string
  dueTime: string
  status: TaskStatus
  priority: 'high' | 'medium' | 'low'
}

export const typeLabelMap: Record<TaskType, string> = {
  followup: '回访提醒',
  deal: '成交跟进',
  material: '待补资料'
}

export const statusLabelMap: Record<TaskStatus, string> = {
  pending: '待完成',
  done: '已完成',
  overdue: '已逾期'
}

export const statusColorMap: Record<TaskStatus, string> = {
  pending: '#2563eb',
  done: '#10b981',
  overdue: '#ef4444'
}

export const priorityLabelMap: Record<Task['priority'], string> = {
  high: '高',
  medium: '中',
  low: '低'
}
