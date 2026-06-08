export interface UsageStats {
  totalScripts: number
  totalChats: number
  totalFavorites: number
  weekGrowth: number
}

export interface ConversionRecord {
  id: string
  customerName: string
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
