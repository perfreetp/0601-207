import { create } from 'zustand'
import type { Script } from '@/types/script'
import { mockFavorites } from '@/data/favorite'
import { useScriptStore } from './script'
import { saveToStorage, loadFromStorage } from '@/utils/persist'

interface FavoriteState {
  favorites: Script[]
  refreshFromScripts: () => void
  removeFavorite: (id: string) => void
  deleteFavorite: (id: string) => void
}

export const useFavoriteStore = create<FavoriteState>((set, get) => {
  const persisted = loadFromStorage<Script[]>('favorites', mockFavorites)
  console.log('[FavoriteStore] Loaded favorites from storage:', persisted.length)

  const persist = () => saveToStorage('favorites', get().favorites)

  return {
    favorites: persisted,

    refreshFromScripts: () => {
      const allScripts = useScriptStore.getState().scripts
      const favs = allScripts.filter(s => s.isFavorite)
      console.log('[FavoriteStore] Refresh from scripts, count:', favs.length)
      set({ favorites: favs })
      persist()
    },

    removeFavorite: (id) => {
      console.log('[FavoriteStore] Remove favorite:', id)
      useScriptStore.getState().toggleFavorite(id)
      set({ favorites: get().favorites.filter(f => f.id !== id) })
      persist()
    },

    deleteFavorite: (id) => {
      console.log('[FavoriteStore] Delete favorite (soft):', id)
      useScriptStore.getState().toggleFavorite(id)
      set({ favorites: get().favorites.filter(f => f.id !== id) })
      persist()
    }
  }
})
