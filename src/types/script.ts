export type ScriptScene = 'opening' | 'objection' | 'closing' | 'followup'

export type ScriptTone = 'professional' | 'friendly' | 'warm' | 'concise'

export interface Script {
  id: string
  scene: ScriptScene
  title: string
  content: string
  tone: ScriptTone
  tags: string[]
  isFavorite: boolean
  usageCount: number
  createdAt: string
}

export const sceneLabelMap: Record<ScriptScene, string> = {
  opening: '开场',
  objection: '异议处理',
  closing: '促单',
  followup: '回访'
}

export const sceneDescMap: Record<ScriptScene, string> = {
  opening: '破冰开场、建立信任、激发兴趣',
  objection: '价格异议、品质疑虑、竞品对比',
  closing: '限时优惠、稀缺营造、临门一脚',
  followup: '售后关怀、复购引导、转介绍'
}

export const toneLabelMap: Record<ScriptTone, string> = {
  professional: '专业',
  friendly: '友好',
  warm: '亲切',
  concise: '简洁'
}
