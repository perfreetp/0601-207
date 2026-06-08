import { create } from 'zustand'
import type { Task, TaskType, Task['priority'] } from '@/types/task'
import { mockTasks } from '@/data/task'
import { saveToStorage, loadFromStorage } from '@/utils/persist'

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'status'> & { status?: Task['status'] }) => Task
  updateTask: (id: string, data: Partial<Task>) => void
  completeTask: (id: string, note?: string) => void
  deleteTask: (id: string) => void
  getTasksByCustomer: (customerId: string) => Task[]
  getPendingTasks: () => Task[]
}

export const useTaskStore = create<TaskState>((set, get) => {
  const persisted = loadFromStorage<Task[]>('tasks', mockTasks)
  console.log('[TaskStore] Loaded tasks from storage:', persisted.length)

  const persist = () => saveToStorage('tasks', get().tasks)

  return {
    tasks: persisted,

    addTask: (data) => {
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        status: data.status || 'pending'
      }
      console.log('[TaskStore] Add new task:', newTask)
      set({ tasks: [newTask, ...get().tasks] })
      persist()
      return newTask
    },

    updateTask: (id, data) => {
      console.log('[TaskStore] Update task:', id, data)
      set({ tasks: get().tasks.map(t => t.id === id ? { ...t, ...data } : t) })
      persist()
    },

    completeTask: (id, note) => {
      const task = get().tasks.find(t => t.id === id)
      console.log('[TaskStore] Complete task:', id, task?.title)
      set({
        tasks: get().tasks.map(t => t.id === id ? { ...t, status: 'done' as const } : t)
      })
      persist()
      if (task?.customerId) {
        try {
          const { useCustomerStore } = require('./customer')
          const customerStore = useCustomerStore.getState()
          customerStore.markTaskCompleted(task.customerId, id)
          if (note) {
            customerStore.addCommunication(task.customerId, {
              date: new Date().toISOString().split('T')[0],
              type: 'other',
              content: `完成任务「${task.title}」：${note}`,
              result: '已完成'
            })
          } else {
            customerStore.addCommunication(task.customerId, {
              date: new Date().toISOString().split('T')[0],
              type: 'other',
              content: `完成任务「${task.title}」`,
              result: '已完成'
            })
          }
        } catch (e) { console.warn(e) }
      }
      try {
        const { useStatsStore } = require('./stats')
        useStatsStore.getState().recordTaskCompleted()
      } catch {}
    },

    deleteTask: (id) => {
      console.log('[TaskStore] Delete task:', id)
      set({ tasks: get().tasks.filter(t => t.id !== id) })
      persist()
    },

    getTasksByCustomer: (customerId) => get().tasks.filter(t => t.customerId === customerId),

    getPendingTasks: () => get().tasks.filter(t => t.status !== 'done')
  }
})

export const createFollowUpTask = (customerId: string, customerName: string, dueDate: string, desc?: string) => {
  return useTaskStore.getState().addTask({
    type: 'followup',
    title: `回访${customerName}`,
    description: desc || '跟进客户最新意向和进展',
    customerName,
    customerId,
    dueTime: `${dueDate} 10:00`,
    priority: 'high'
  })
}

export const createMaterialTask = (customerId: string, customerName: string, material: string, dueDate?: string) => {
  const date = dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  return useTaskStore.getState().addTask({
    type: 'material',
    title: `为${customerName}准备「${material}」`,
    description: `需要准备并发送：${material}`,
    customerName,
    customerId,
    dueTime: `${date} 18:00`,
    priority: 'medium'
  })
}

export const createDealTask = (customerId: string, customerName: string, desc?: string, dueDate?: string) => {
  const date = dueDate || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  return useTaskStore.getState().addTask({
    type: 'deal',
    title: `促成${customerName}成交`,
    description: desc || '重点跟进，争取尽快成交',
    customerName,
    customerId,
    dueTime: `${date} 15:00`,
    priority: 'high'
  })
}
