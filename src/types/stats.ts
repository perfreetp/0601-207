export interface UsageStats {
  totalScripts: number
  totalChats: number
  totalFavorites: number
  weekGrowth: number
}

export interface ConversionRecord {
  id: string
  customerName: string
  customerId: string
  product: string
  amount: number
  date: string
  status: 'success' | 'pending' | 'failed'
}

export interface RankRecord {
  rank: number
  name: string
  avatar: string
  score: number
  isMe: boolean
}

export interface DailyUsage {
  date: string
  count: number
}

export interface DailyStats {
  date: string
  scriptsGenerated: number
  favoritesAdded: number
  customersFollowed: number
  tasksCompleted: number
}

export interface StageConversion {
  stage: string
  count: number
  converted: number
  rate: number
}
