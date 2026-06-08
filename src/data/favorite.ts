import type { Script } from '@/types/script'

export const mockFavorites: Script[] = [
  {
    id: 'f1',
    scene: 'opening',
    title: '新客破冰开场白',
    content: '您好，欢迎光临！很高兴为您服务。请问您是第一次来我们店吗？方便告诉我您今天主要想了解哪类产品，我好为您做更专业的推荐~',
    tone: 'friendly',
    tags: ['新客', '破冰', '通用'],
    isFavorite: true,
    usageCount: 128,
    createdAt: '2026-06-01'
  },
  {
    id: 'f2',
    scene: 'objection',
    title: '价格太贵异议处理',
    content: '非常理解您的感受。其实很多客户刚开始和您想法一样。但您看，这款产品采用的是进口材质，光这一项就比普通产品耐用5年，平均下来每天才几块钱，更重要的是品质有保障，售后服务也更省心。',
    tone: 'professional',
    tags: ['价格异议', '价值塑造'],
    isFavorite: true,
    usageCount: 234,
    createdAt: '2026-06-01'
  },
  {
    id: 'f3',
    scene: 'closing',
    title: '限时优惠促单',
    content: '刚好告诉您一个好消息，这个款式是我们本月活动款，今天下单还能享受85折优惠，而且赠送价值599元的配套服务，明天就恢复原价了。您看是现在定下来还是再考虑一下？',
    tone: 'concise',
    tags: ['限时', '优惠', '促单'],
    isFavorite: true,
    usageCount: 189,
    createdAt: '2026-06-04'
  },
  {
    id: 'f4',
    scene: 'followup',
    title: '3天回访关怀',
    content: '王姐您好，我是XX店的小X。您前两天来看过那款沙发，不知道您和家人商量得怎么样了？有什么疑问随时可以问我，我帮您解答~',
    tone: 'warm',
    tags: ['回访', '关怀', '跟进'],
    isFavorite: true,
    usageCount: 203,
    createdAt: '2026-06-02'
  }
]
