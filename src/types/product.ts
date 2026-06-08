export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  image: string
  sellingPoints: string[]
  stock: number
  stockStatus: 'sufficient' | 'low' | 'out'
  matchSuggestions: string[]
  description: string
}

export const stockLabelMap: Record<Product['stockStatus'], string> = {
  sufficient: '库存充足',
  low: '库存紧张',
  out: '已售罄'
}

export const stockColorMap: Record<Product['stockStatus'], string> = {
  sufficient: '#10b981',
  low: '#f59e0b',
  out: '#ef4444'
}
