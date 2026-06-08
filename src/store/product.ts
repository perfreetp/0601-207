import { create } from 'zustand'
import type { Product } from '@/types/product'
import { mockProducts } from '@/data/product'
import { saveToStorage, loadFromStorage } from '@/utils/persist'

interface ProductState {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'stockStatus'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const calcStockStatus = (stock: number): Product['stockStatus'] => {
  if (stock <= 0) return 'out'
  if (stock <= 5) return 'low'
  return 'sufficient'
}

export const useProductStore = create<ProductState>((set, get) => {
  const persisted = loadFromStorage<Product[]>('products', mockProducts)
  console.log('[ProductStore] Loaded products from storage:', persisted.length)

  const persist = () => saveToStorage('products', get().products)

  return {
    products: persisted,

    addProduct: (data) => {
      const stock = data.stock ?? 0
      const newProduct: Product = {
        ...data,
        id: Date.now().toString(),
        stockStatus: calcStockStatus(stock)
      }
      console.log('[ProductStore] Add new product:', newProduct)
      set({ products: [newProduct, ...get().products] })
      persist()
    },

    updateProduct: (id, data) => {
      console.log('[ProductStore] Update product:', id, data)
      set({
        products: get().products.map(p => {
          if (p.id !== id) return p
          const merged = { ...p, ...data }
          const stock = data.stock !== undefined ? data.stock : p.stock
          return { ...merged, stockStatus: calcStockStatus(stock) }
        })
      })
      persist()
    },

    deleteProduct: (id) => {
      console.log('[ProductStore] Delete product:', id)
      set({ products: get().products.filter(p => p.id !== id) })
      persist()
    }
  }
})
