import type { Script } from '@/types/script'

export const mockScripts: Script[] = [
  {
    id: '1',
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
    id: '2',
    scene: 'opening',
    title: '高端客户开场',
    content: '欢迎光临！看得出您品味不凡。我们这里有几款设计师定制款非常适合您的气质，方便带您体验一下吗？',
    tone: 'professional',
    tags: ['高端', '定制', 'VIP'],
    isFavorite: false,
    usageCount: 56,
    createdAt: '2026-06-02'
  },
  {
    id: '3',
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
    id: '4',
    scene: 'objection',
    title: '我再对比对比',
    content: '当然可以，货比三家不吃亏！不过为了帮您更方便对比，我帮您把这款产品的核心优势和参考价格整理一下，您不管去哪家对比心里都有底，您看方便吗？',
    tone: 'warm',
    tags: ['对比', '留客', '跟进'],
    isFavorite: false,
    usageCount: 167,
    createdAt: '2026-06-03'
  },
  {
    id: '5',
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
    id: '6',
    scene: 'closing',
    title: '稀缺营造促单',
    content: '这款是我们的爆款，您看上的这个颜色门店就剩最后2套了，上周有个客户犹豫了一天结果被别人订走了。我先帮您预留下来？',
    tone: 'professional',
    tags: ['稀缺', '库存', '逼单'],
    isFavorite: false,
    usageCount: 142,
    createdAt: '2026-06-05'
  },
  {
    id: '7',
    scene: 'followup',
    title: '3天回访关怀',
    content: '王姐您好，我是XX店的小X。您前两天来看过那款沙发，不知道您和家人商量得怎么样了？有什么疑问随时可以问我，我帮您解答~',
    tone: 'warm',
    tags: ['回访', '关怀', '跟进'],
    isFavorite: true,
    usageCount: 203,
    createdAt: '2026-06-02'
  },
  {
    id: '8',
    scene: 'followup',
    title: '成交后关怀',
    content: '李总您好，您订的那套餐桌椅已经安排配送了，预计后天上午送到。安装师傅会提前联系您，有任何问题随时找我，祝您生活愉快！',
    tone: 'friendly',
    tags: ['售后', '关怀', '复购'],
    isFavorite: false,
    usageCount: 98,
    createdAt: '2026-06-06'
  }
]
