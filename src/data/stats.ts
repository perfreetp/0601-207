import type { UsageStats, ConversionRecord, RankRecord, DailyUsage } from '@/types/stats'

export const mockUsageStats: UsageStats = {
  totalScripts: 586,
  totalChats: 234,
  totalFavorites: 48,
  weekGrowth: 12.5
}

export const mockConversionRecords: ConversionRecord[] = [
  {
    id: '1',
    customerName: '刘女士',
    product: '实木儿童床 + 配套',
    amount: 5899,
    date: '2026-06-01',
    status: 'success'
  },
  {
    id: '2',
    customerName: '周先生',
    product: '北欧简约三人沙发',
    amount: 6999,
    date: '2026-06-03',
    status: 'success'
  },
  {
    id: '3',
    customerName: '吴女士',
    product: '轻奢岩板餐桌椅套装',
    amount: 8599,
    date: '2026-06-05',
    status: 'success'
  },
  {
    id: '4',
    customerName: '李先生',
    product: '智能升降办公桌',
    amount: 3599,
    date: '2026-06-07',
    status: 'pending'
  }
]

export const mockRankRecords: RankRecord[] = [
  {
    rank: 1,
    name: '林小美',
    avatar: 'https://picsum.photos/id/64/200/200',
    score: 9850,
    isMe: false
  },
  {
    rank: 2,
    name: '陈思雨',
    avatar: 'https://picsum.photos/id/91/200/200',
    score: 8720,
    isMe: false
  },
  {
    rank: 3,
    name: '我',
    avatar: 'https://picsum.photos/id/338/200/200',
    score: 7680,
    isMe: true
  },
  {
    rank: 4,
    name: '王志强',
    avatar: 'https://picsum.photos/id/177/200/200',
    score: 6540,
    isMe: false
  },
  {
    rank: 5,
    name: '赵敏',
    avatar: 'https://picsum.photos/id/1027/200/200',
    score: 5890,
    isMe: false
  }
]

export const mockDailyUsage: DailyUsage[] = [
  { date: '06-03', count: 18 },
  { date: '06-04', count: 24 },
  { date: '06-05', count: 31 },
  { date: '06-06', count: 28 },
  { date: '06-07', count: 36 },
  { date: '06-08', count: 42 },
  { date: '06-09', count: 15 }
]
