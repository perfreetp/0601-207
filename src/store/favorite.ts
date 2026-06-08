import { create } from 'zustand'
import type { Script } from '@/types/script'
import { mockFavorites } from '@/data/favorite'
import { useScriptStore } from './script'

interface FavoriteState {
  favorites: Script[]
  refreshFromScripts: () => void
  removeFavorite: (id: string) => void
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [...mockFavorites],

  refreshFromScripts: () => {
    const allScripts = useScriptStore.getState().scripts
    const favs = allScripts.filter(s => s.isFavorite)
    console.log('[FavoriteStore] Refresh from scripts, count:', favs.length)
    set({ favorites: favs })
  },

  removeFavorite: (id) => {
    console.log('[FavoriteStore] Remove favorite:', id)
    useScriptStore.getState().toggleFavorite(id)
    set({
      favorites: get().favorites.filter(f => f.id !== id)
    })
  }
}))
