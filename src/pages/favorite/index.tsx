import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import ScriptCard from '@/components/ScriptCard'
import { useFavoriteStore } from '@/store/favorite'
import { useScriptStore } from '@/store/script'
import { sceneLabelMap, type ScriptScene } from '@/types/script'
import styles from './index.module.scss'

const filters: { key: ScriptScene | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'opening', label: '开场' },
  { key: 'objection', label: '异议处理' },
  { key: 'closing', label: '促单' },
  { key: 'followup', label: '回访' }
]

const FavoritePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ScriptScene | 'all'>('all')
  const { favorites, refreshFromScripts } = useFavoriteStore()
  const toggleFavorite = useScriptStore(s => s.toggleFavorite)

  const filteredFavorites = useMemo(() => {
    return favorites.filter(s => activeFilter === 'all' || s.scene === activeFilter)
  }, [favorites, activeFilter])

  const handleFavorite = (id: string, isFav: boolean) => {
    console.log('[FavoritePage] Remove from favorites:', id)
    toggleFavorite(id)
    refreshFromScripts()
  }

  const handleExplore = () => {
    Taro.switchTab({ url: '/pages/script/index' })
  }

  useEffect(() => {
    console.log('[FavoritePage] Refresh from scripts on mount')
    refreshFromScripts()
  }, [])

  return (
    <View className={styles.pageContainer}>
      <View style={{
        padding: '48rpx 32rpx 32rpx',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: '#fff'
      }}>
        <Text style={{ fontSize: '40rpx', fontWeight: '600', display: 'block' }}>优秀案例库</Text>
        <Text style={{ fontSize: '24rpx', opacity: 0.85, marginTop: '8rpx', display: 'block' }}>沉淀优质话术，随时复用参考</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{favorites.length}</Text>
          <Text className={styles.statsLabel}>收藏总数</Text>
        </View>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>
            {favorites.reduce((acc, f) => acc + f.usageCount, 0)}
          </Text>
          <Text className={styles.statsLabel}>累计使用</Text>
        </View>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>
            {new Set(favorites.map(f => f.scene)).size}
          </Text>
          <Text className={styles.statsLabel}>场景覆盖</Text>
        </View>
      </View>

      <ScrollView scrollX className={styles.filterBar}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterItem, activeFilter === f.key && styles.filterItemActive)}
            onClick={() => setActiveFilter(f.key)}
            style={{ display: 'inline-flex', verticalAlign: 'top', whiteSpace: 'normal' }}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.scriptList}>
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map(s => (
            <ScriptCard key={s.id} script={s} onFavorite={handleFavorite} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>⭐</Text>
            <Text className={styles.emptyText}>
              {activeFilter === 'all' ? '还没有收藏任何话术\n去话术页面收藏优质案例吧~' : `暂无${sceneLabelMap[activeFilter as ScriptScene]}场景的收藏`}
            </Text>
            <View className={styles.emptyTip} onClick={handleExplore}>
              <Text>去话术页面看看</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default FavoritePage
