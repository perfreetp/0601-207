import { create } from 'zustand'
import { saveToStorage, loadFromStorage } from '@/utils/persist'
import type { DailyStats, StageConversion, ConversionRecord } from '@/types/stats'

interface StatsState {
  dailyStats: DailyStats[]
  conversionRecords: ConversionRecord[]
  stageConversions: StageConversion[]
  totalScriptsGenerated: number
  totalFavorites: number
  totalCustomersFollowed: number
  recordScriptGenerated: () => void
  recordFavorite: (added: boolean) => void
  recordCustomerFollowed: () => void
  recordTaskCompleted: () => void
  recordConversion: (record: Omit<ConversionRecord, 'id' | 'date'>) => void
  updateStageConversion: (fromStage?: string, toStage?: string, closed?: boolean) => void
  getTodayStats: () => DailyStats
}

const todayStr = () => new Date().toISOString().split('T')[0]

const defaultDailyStats: DailyStats = {
  date: todayStr(),
  scriptsGenerated: 0,
  favoritesAdded: 0,
  customersFollowed: 0,
  tasksCompleted: 0
}

const defaultStageConversions: StageConversion[] = [
  { stage: '认知期', count: 0, converted: 0, rate: 0 },
  { stage: '兴趣期', count: 0, converted: 0, rate: 0 },
  { stage: '对比期', count: 0, converted: 0, rate: 0 },
  { stage: '决策期', count: 0, converted: 0, rate: 0 },
  { stage: '已成交', count: 0, converted: 0, rate: 0 }
]

export const useStatsStore = create<StatsState>((set, get) => {
  const initial = loadFromStorage<{
    dailyStats: DailyStats[]
    conversionRecords: ConversionRecord[]
    stageConversions: StageConversion[]
    totalScriptsGenerated: number
    totalFavorites: number
    totalCustomersFollowed: number
  }>('stats', {
    dailyStats: [],
    conversionRecords: [],
    stageConversions: defaultStageConversions,
    totalScriptsGenerated: 0,
    totalFavorites: 0,
    totalCustomersFollowed: 0
  })

  return {
    dailyStats: initial.dailyStats,
    conversionRecords: initial.conversionRecords,
    stageConversions: initial.stageConversions,
    totalScriptsGenerated: initial.totalScriptsGenerated,
    totalFavorites: initial.totalFavorites,
    totalCustomersFollowed: initial.totalCustomersFollowed,

    _persist: () => {
      const s = get()
      saveToStorage('stats', {
        dailyStats: s.dailyStats,
        conversionRecords: s.conversionRecords,
        stageConversions: s.stageConversions,
        totalScriptsGenerated: s.totalScriptsGenerated,
        totalFavorites: s.totalFavorites,
        totalCustomersFollowed: s.totalCustomersFollowed
      })
    },

    _getToday: () => {
      const today = todayStr()
      let list = get().dailyStats
      let todayData = list.find(d => d.date === today)
      if (!todayData) {
        todayData = { ...defaultDailyStats, date: today }
        list = [...list, todayData]
        set({ dailyStats: list })
      }
      return todayData
    },

    recordScriptGenerated: () => {
      const today = get()._getToday()
      set({
        dailyStats: get().dailyStats.map(d =>
          d.date === today.date ? { ...d, scriptsGenerated: d.scriptsGenerated + 1 } : d
        ),
        totalScriptsGenerated: get().totalScriptsGenerated + 1
      })
      get()._persist()
      console.log('[Stats] Script generated, total:', get().totalScriptsGenerated)
    },

    recordFavorite: (added: boolean) => {
      const today = get()._getToday()
      set({
        dailyStats: get().dailyStats.map(d =>
          d.date === today.date ? { ...d, favoritesAdded: d.favoritesAdded + (added ? 1 : 0) } : d
        ),
        totalFavorites: get().totalFavorites + (added ? 1 : -1)
      })
      get()._persist()
      console.log('[Stats] Favorite:', added ? 'added' : 'removed')
    },

    recordCustomerFollowed: () => {
      const today = get()._getToday()
      set({
        dailyStats: get().dailyStats.map(d =>
          d.date === today.date ? { ...d, customersFollowed: d.customersFollowed + 1 } : d
        ),
        totalCustomersFollowed: get().totalCustomersFollowed + 1
      })
      get()._persist()
      console.log('[Stats] Customer followed')
    },

    recordTaskCompleted: () => {
      const today = get()._getToday()
      set({
        dailyStats: get().dailyStats.map(d =>
          d.date === today.date ? { ...d, tasksCompleted: d.tasksCompleted + 1 } : d
        )
      })
      get()._persist()
      console.log('[Stats] Task completed')
    },

    recordConversion: (record) => {
      const newRecord: ConversionRecord = {
        ...record,
        id: Date.now().toString(),
        date: todayStr()
      }
      set({ conversionRecords: [newRecord, ...get().conversionRecords] })
      get()._persist()
      console.log('[Stats] Conversion recorded:', newRecord)
    },

    updateStageConversion: (fromStage, toStage, closed) => {
      const stageMap: Record<string, string> = {
        awareness: '认知期', interest: '兴趣期', comparison: '对比期', decision: '决策期', closed: '已成交'
      }
      set({
        stageConversions: get().stageConversions.map(s => {
          if (toStage && stageMap[toStage] === s.stage) {
            const count = s.count + 1
            return { ...s, count, converted: closed ? s.converted + 1 : s.converted, rate: count > 0 ? Math.round((s.converted / count) * 100) : 0 }
          }
          if (closed && s.stage === '已成交') {
            return { ...s, count: s.count + 1, converted: s.converted + 1 }
          }
          return s
        })
      })
      get()._persist()
    },

    getTodayStats: () => {
      return get()._getToday()
    }
  } as StatsState & any
})
