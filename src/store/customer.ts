import { create } from 'zustand'
import type { Customer, PurchaseStage } from '@/types/customer'
import { mockCustomers } from '@/data/customer'

interface CustomerState {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id' | 'lastContact'>) => void
  updateCustomer: (id: string, data: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [...mockCustomers],

  addCustomer: (data) => {
    const newCustomer: Customer = {
      ...data,
      id: Date.now().toString(),
      lastContact: new Date().toISOString().split('T')[0]
    }
    console.log('[CustomerStore] Add new customer:', newCustomer)
    set({ customers: [newCustomer, ...get().customers] })
  },

  updateCustomer: (id, data) => {
    console.log('[CustomerStore] Update customer:', id, data)
    set({
      customers: get().customers.map(c => c.id === id ? { ...c, ...data } : c)
    })
  },

  deleteCustomer: (id) => {
    console.log('[CustomerStore] Delete customer:', id)
    set({ customers: get().customers.filter(c => c.id !== id) })
  }
}))
