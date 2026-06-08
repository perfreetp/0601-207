import type { Customer } from '@/types/customer'

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '王女士',
    avatar: 'https://picsum.photos/id/64/200/200',
    phone: '138****8888',
    budget: '8000-12000',
    preferences: ['简约风格', '环保材质', '浅色系列'],
    concerns: ['甲醛问题', '售后服务', '配送周期'],
    stage: 'comparison',
    lastContact: '2026-06-08',
    note: '对比3家品牌中，倾向简约北欧风，关注环保指标',
    tags: ['高意向', 'VIP']
  },
  {
    id: '2',
    name: '李先生',
    avatar: 'https://picsum.photos/id/91/200/200',
    phone: '139****6666',
    budget: '15000-20000',
    preferences: ['科技感', '多功能', '深色系列'],
    concerns: ['产品耐用性', '安装服务', '价格优惠'],
    stage: 'decision',
    lastContact: '2026-06-07',
    note: '已来看过2次，对智能款很感兴趣，本周可促成',
    tags: ['急单', '高客单']
  },
  {
    id: '3',
    name: '张小姐',
    avatar: 'https://picsum.photos/id/338/200/200',
    phone: '137****5555',
    budget: '5000-8000',
    preferences: ['性价比', '时尚外观', '小户型适配'],
    concerns: ['尺寸适配', '储物空间', '颜色选择'],
    stage: 'interest',
    lastContact: '2026-06-05',
    note: '初次到店，出租屋使用，预算有限',
    tags: ['新客']
  },
  {
    id: '4',
    name: '陈先生',
    avatar: 'https://picsum.photos/id/177/200/200',
    phone: '136****2222',
    budget: '20000以上',
    preferences: ['高端品质', '定制款', '实木材质'],
    concerns: ['定制周期', '品质保障', '品牌实力'],
    stage: 'awareness',
    lastContact: '2026-06-06',
    note: '高端客户，别墅装修，需要整屋方案',
    tags: ['高端客户', '整屋方案']
  },
  {
    id: '5',
    name: '刘女士',
    avatar: 'https://picsum.photos/id/1027/200/200',
    phone: '135****1111',
    budget: '10000-15000',
    preferences: ['儿童友好', '圆角设计', '多功能收纳'],
    concerns: ['安全性', '环保等级', '质保政策'],
    stage: 'closed',
    lastContact: '2026-06-01',
    note: '已成交，可回访复购儿童房配套',
    tags: ['已成交', '复购潜力']
  },
  {
    id: '6',
    name: '赵先生',
    avatar: 'https://picsum.photos/id/64/200/200',
    phone: '134****9999',
    budget: '6000-10000',
    preferences: ['办公用', '人体工学', '简约'],
    concerns: ['久坐舒适', '组装难度', '承重能力'],
    stage: 'comparison',
    lastContact: '2026-06-04',
    note: '办公室采购，需要5-10套',
    tags: ['团购', 'B端客户']
  }
]
