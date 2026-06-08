export type PurchaseStage = 'awareness' | 'interest' | 'comparison' | 'decision' | 'closed'

export interface CommunicationRecord {
  id: string
  date: string
  type: 'call' | 'visit' | 'wechat' | 'other'
  content: string
  result?: string
}

export interface Customer {
  id: string
  name: string
  avatar: string
  phone: string
  budget: string
  preferences: string[]
  concerns: string[]
  stage: PurchaseStage
  lastContact: string
  nextFollowUp?: string
  note: string
  tags: string[]
  communications: CommunicationRecord[]
  dealIntent?: 'low' | 'medium' | 'high'
  pendingMaterial?: string
  completedTasks: string[]
}

export const stageLabelMap: Record<PurchaseStage, string> = {
  awareness: '认知期',
  interest: '兴趣期',
  comparison: '对比期',
  decision: '决策期',
  closed: '已成交'
}

export const stageColorMap: Record<PurchaseStage, string> = {
  awareness: '#94a3b8',
  interest: '#3b82f6',
  comparison: '#f59e0b',
  decision: '#8b5cf6',
  closed: '#10b981'
}

export const commTypeLabel: Record<CommunicationRecord['type'], string> = {
  call: '电话',
  visit: '到店',
  wechat: '微信',
  other: '其他'
}

export const intentLabelMap: Record<NonNullable<Customer['dealIntent']>, string> = {
  low: '低',
  medium: '中',
  high: '高'
}
