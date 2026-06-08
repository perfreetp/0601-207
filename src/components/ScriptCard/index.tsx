import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import Tag from '@/components/Tag'
import { sceneLabelMap, toneLabelMap, type Script } from '@/types/script'
import styles from './index.module.scss'

interface ScriptCardProps {
  script: Script
  onFavorite?: (id: string, isFav: boolean) => void
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, onFavorite }) => {
  const [isFav, setIsFav] = useState(script.isFavorite)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setIsFav(script.isFavorite)
  }, [script.isFavorite])

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    Taro.setClipboardData({
      data: script.content,
      success: () => {
        Taro.showToast({ title: '已复制到剪贴板', icon: 'success' })
        console.log('[ScriptCard] Copy script:', script.id)
      }
    })
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newFav = !isFav
    setIsFav(newFav)
    onFavorite?.(script.id, newFav)
    Taro.showToast({ title: newFav ? '已收藏' : '已取消收藏', icon: 'none' })
    console.log('[ScriptCard] Toggle favorite:', script.id, newFav)
  }

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <View className={styles.tags}>
          <Tag text={sceneLabelMap[script.scene]} color="#2563eb" bgColor="rgba(37, 99, 235, 0.1)" />
          <Tag text={toneLabelMap[script.tone]} color="#7c3aed" bgColor="rgba(124, 58, 237, 0.1)" />
          {script.tags.slice(0, 2).map(t => (
            <Tag key={t} text={t} color="#475569" bgColor="#f1f5f9" />
          ))}
        </View>
        <View
          className={classnames(styles.favBtn, isFav && styles.favActive)}
          onClick={handleFavorite}
        >
          <Text>{isFav ? '★' : '☆'}</Text>
        </View>
      </View>

      <Text className={styles.title}>{script.title}</Text>

      <View className={classnames(styles.content, expanded && styles.contentExpanded)}>
        <Text>{script.content}</Text>
      </View>

      {script.content.length > 60 && (
        <View className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
          <Text className={styles.expandText}>{expanded ? '收起' : '展开全文'}</Text>
        </View>
      )}

      <View className={styles.footer}>
        <Text className={styles.usage}>已使用 {script.usageCount} 次</Text>
        <View className={styles.actions}>
          <View className={styles.copyBtn} onClick={handleCopy}>
            <Text className={styles.copyText}>复制文案</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ScriptCard
