import type { Product } from '@/types/product'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '北欧简约三人沙发',
    category: '客厅家具',
    price: 6999,
    originalPrice: 8999,
    image: 'https://picsum.photos/id/103/300/300',
    sellingPoints: [
      '进口实木框架，质保10年',
      '高密度海绵，久坐不塌',
      '科技布面料，防污耐刮',
      '可拆洗设计，清洁无忧'
    ],
    stock: 15,
    stockStatus: 'sufficient',
    matchSuggestions: ['搭配简约茶几', '同系列单人椅', '原木色边柜'],
    description: '经典北欧设计，适合小户型客厅，简约不简单'
  },
  {
    id: '2',
    name: '智能升降办公桌',
    category: '办公家具',
    price: 3599,
    originalPrice: 4599,
    image: 'https://picsum.photos/id/119/300/300',
    sellingPoints: [
      '电动升降，坐站交替',
      '记忆高度，一键切换',
      '防夹感应，安全可靠',
      '静音电机，运行平稳'
    ],
    stock: 3,
    stockStatus: 'low',
    matchSuggestions: ['搭配人体工学椅', '桌面收纳套装', '显示器支架'],
    description: '专为久坐办公人群设计，守护腰椎健康'
  },
  {
    id: '3',
    name: '实木儿童床',
    category: '卧室家具',
    price: 4299,
    originalPrice: 5299,
    image: 'https://picsum.photos/id/225/300/300',
    sellingPoints: [
      'FAS级橡木，环保无异味',
      '圆角打磨，全方位防撞',
      '护栏加高，安全防摔',
      '水性漆涂装，即买即用'
    ],
    stock: 0,
    stockStatus: 'out',
    matchSuggestions: ['配套床头柜', '儿童收纳柜', '天然椰棕床垫'],
    description: '专为儿童设计，从材质到细节全方位守护'
  },
  {
    id: '4',
    name: '轻奢岩板餐桌',
    category: '餐厅家具',
    price: 5899,
    originalPrice: 7599,
    image: 'https://picsum.photos/id/230/300/300',
    sellingPoints: [
      '进口岩板台面，耐刮耐高温',
      '碳素钢框架，稳固承重',
      '可伸缩设计，灵活适配人数',
      '意式轻奢，颜值出众'
    ],
    stock: 8,
    stockStatus: 'sufficient',
    matchSuggestions: ['配套餐椅4把', '餐边柜', '轻奢吊灯'],
    description: '意式轻奢风格，让餐厅成为家中的美学空间'
  }
]
