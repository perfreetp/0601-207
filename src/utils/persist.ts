import Taro from '@tarojs/taro'

const PERSIST_PREFIX = 'ai_sales_'

export const saveToStorage = <T>(key: string, data: T) => {
  try {
    Taro.setStorageSync(PERSIST_PREFIX + key, JSON.stringify(data))
    console.log('[Persist] Saved:', key)
  } catch (e) {
    console.error('[Persist] Save error:', key, e)
  }
}

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = Taro.getStorageSync(PERSIST_PREFIX + key)
    if (raw) {
      const parsed = JSON.parse(raw)
      console.log('[Persist] Loaded:', key, parsed?.length || parsed)
      return parsed as T
    }
  } catch (e) {
    console.error('[Persist] Load error:', key, e)
  }
  return fallback
}

export const clearStorage = () => {
  try {
    Taro.clearStorageSync()
    console.log('[Persist] All cleared')
  } catch (e) {
    console.error('[Persist] Clear error:', e)
  }
}
