import { create } from 'zustand'
import type { Customer, PurchaseStage, CommunicationRecord } from '@/types/customer'
import { mockCustomers } from '@/data/customer'
import { saveToStorage, loadFromStorage } from '@/utils/persist'

interface CustomerState {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id' | 'lastContact' | 'communications' | 'completedTasks'>) => void
  updateCustomer: (id: string, data: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  updateStage: (id: string, stage: PurchaseStage) => void
  addCommunication: (id: string, comm: Omit<CommunicationRecord, 'id'>) => void
  updateNextFollowUp: (id: string, date?: string) => void
  updateNote: (id: string, note: string) => void
  updateIntent: (id: string, intent?: 'low' | 'medium' | 'high') => void
  updatePendingMaterial: (id: string, material?: string) => void
  markTaskCompleted: (customerId: string, taskId: string) => void
  getCustomerById: (id: string) => Customer | undefined
}

export const useCustomerStore = create<CustomerState>((set, get) => {
  const persisted = loadFromStorage<Customer[]>('customers', mockCustomers)
  console.log('[CustomerStore] Loaded customers from storage:', persisted.length)

  const persist = () => saveToStorage('customers', get().customers)

  return {
    customers: persisted,

    addCustomer: (data) => {
      const newCustomer: Customer = {
        ...data,
        id: Date.now().toString(),
        lastContact: new Date().toISOString().split('T')[0],
        communications: [],
        completedTasks: []
      }
      console.log('[CustomerStore] Add new customer:', newCustomer)
      set({ customers: [newCustomer, ...get().customers] })
      persist()
    },

    updateCustomer: (id, data) => {
      console.log('[CustomerStore] Update customer:', id, data)
      set({ customers: get().customers.map(c => c.id === id ? { ...c, ...data } : c) })
      persist()
    },

    deleteCustomer: (id) => {
      console.log('[CustomerStore] Delete customer:', id)
      set({ customers: get().customers.filter(c => c.id !== id) })
      persist()
    },

    updateStage: (id, stage) => {
      const customer = get().customers.find(c => c.id === id)
      console.log('[CustomerStore] Update stage:', id, customer?.stage, '->', stage)
      set({
        customers: get().customers.map(c =>
          c.id === id ? { ...c, stage, lastContact: new Date().toISOString().split('T')[0] } : c
        )
      })
      persist()
      try {
        const { useStatsStore } = require('./stats')
        useStatsStore.getState().updateStageConversion(customer?.stage, stage, stage === 'closed')
      } catch {}
    },

    addCommunication: (id, comm) => {
      const newComm: CommunicationRecord = { ...comm, id: Date.now().toString() }
      console.log('[CustomerStore] Add communication:', id, newComm)
      set({
        customers: get().customers.map(c =>
          c.id === id ? {
            ...c,
            communications: [newComm, ...c.communications],
            lastContact: newComm.date
          } : c
        )
      })
      persist()
      try {
        const { useStatsStore } = require('./stats')
        useStatsStore.getState().recordCustomerFollowed()
      } catch {}
    },

    updateNextFollowUp: (id, date) => {
      console.log('[CustomerStore] Update nextFollowUp:', id, date)
      set({ customers: get().customers.map(c => c.id === id ? { ...c, nextFollowUp: date } : c) })
      persist()
    },

    updateNote: (id, note) => {
      set({ customers: get().customers.map(c => c.id === id ? { ...c, note } : c) })
      persist()
    },

    updateIntent: (id, intent) => {
      set({ customers: get().customers.map(c => c.id === id ? { ...c, dealIntent: intent } : c) })
      persist()
    },

    updatePendingMaterial: (id, material) => {
      set({ customers: get().customers.map(c => c.id === id ? { ...c, pendingMaterial: material } : c) })
      persist()
    },

    markTaskCompleted: (customerId, taskId) => {
      set({
        customers: get().customers.map(c =>
          c.id === customerId
            ? { ...c, completedTasks: [...c.completedTasks, taskId], lastContact: new Date().toISOString().split('T')[0] }
            : c
        )
      })
      persist()
    },

    getCustomerById: (id) => get().customers.find(c => c.id === id)
  }
})
