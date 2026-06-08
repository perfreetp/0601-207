export type PurchaseStage = 'awareness' | 'interest' | 'comparison' | 'decision' | 'closed'

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
  note: string
  tags: string[]
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
