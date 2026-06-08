import type { Task } from '@/types/task'

export const mockTasks: Task[] = [
  {
    id: '1',
    type: 'followup',
    title: '回访王女士了解对比进展',
    description: '王女士对比3家品牌中，本周需跟进了解最新意向',
    customerName: '王女士',
    customerId: '1',
    dueTime: '2026-06-09 15:00',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    type: 'deal',
    title: '跟进李先生促成本周成交',
    description: '李先生已来看过2次，本周可促成智能升降桌订单',
    customerName: '李先生',
    customerId: '2',
    dueTime: '2026-06-09 10:30',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '3',
    type: 'material',
    title: '补充陈先生整屋方案报价单',
    description: '需要为陈先生准备详细的整屋定制方案报价',
    customerName: '陈先生',
    customerId: '4',
    dueTime: '2026-06-10 18:00',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'followup',
    title: '回访刘女士了解使用体验',
    description: '刘女士已成交，回访了解使用情况并推荐儿童房配套',
    customerName: '刘女士',
    customerId: '5',
    dueTime: '2026-06-08 14:00',
    status: 'done',
    priority: 'medium'
  },
  {
    id: '5',
    type: 'deal',
    title: '赵先生团购方案确认',
    description: '赵先生办公室采购5-10套办公家具，需确认最终方案',
    customerName: '赵先生',
    customerId: '6',
    dueTime: '2026-06-07 16:00',
    status: 'overdue',
    priority: 'high'
  },
  {
    id: '6',
    type: 'material',
    title: '发送张小姐小户型方案',
    description: '为张小姐整理适合出租屋的高性价比方案',
    customerName: '张小姐',
    customerId: '3',
    dueTime: '2026-06-11 12:00',
    status: 'pending',
    priority: 'low'
  }
]
