import React, { useState, useMemo } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PageHeader from '@/components/PageHeader'
import ScriptCard from '@/components/ScriptCard'
import { mockScripts } from '@/data/script'
import { sceneLabelMap, sceneDescMap, type ScriptScene } from '@/types/script'
import styles from './index.module.scss'

const scenes: ScriptScene[] = ['opening', 'objection', 'closing', 'followup']

const ScriptPage: React.FC = () => {
  const [activeScene, setActiveScene] = useState<ScriptScene>('opening')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredScripts = useMemo(() => {
    return mockScripts.filter(s => s.scene === activeScene)
  }, [activeScene])

  const handleGenerate = () => {
    console.log('[ScriptPage] Generate script with context:', context)
    if (!context.trim()) {
      Taro.showToast({ title: '请输入客户或产品信息', icon: 'none' })
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      Taro.showToast({ title: '已生成新话术', icon: 'success' })
    }, 1500)
  }

  const handleFavorite = (id: string, isFav: boolean) => {
    console.log('[ScriptPage] Favorite changed:', id, isFav)
  }

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="AI 话术生成"
        subtitle="智能生成专业销售话术"
        gradient
      />

      <View className={styles.generateCard}>
        <Text className={styles.generateTitle}>🎯 智能生成话术</Text>
        <Text className={styles.generateDesc}>输入客户信息或产品特点，AI为您定制专属话术</Text>

        <View className={styles.generateForm}>
          <View className={styles.formRow}>
            <Text className={styles.formLabel}>场景</Text>
            <View style={{ flex: 1, display: 'flex', gap: '16rpx', flexWrap: 'wrap' }}>
              {scenes.map(s => (
                <Text
                  key={s}
                  onClick={() => setActiveScene(s)}
                  style={{
                    padding: '8rpx 20rpx',
                    borderRadius: '32rpx',
                    fontSize: '24rpx',
                    background: activeScene === s ? '#fff' : 'rgba(255,255,255,0.2)',
                    color: activeScene === s ? '#6366f1' : '#fff'
                  }}
                >
                  {sceneLabelMap[s]}
                </Text>
              ))}
            </View>
          </View>

          <View className={styles.formRow}>
            <Text className={styles.formLabel}>描述</Text>
            <Input
              className={styles.formInput}
              placeholder="如：客户预算1万，偏好简约北欧风，顾虑环保问题"
              placeholderStyle="color: rgba(255,255,255,0.6); font-size: 26rpx;"
              value={context}
              onInput={e => setContext(e.detail.value)}
            />
          </View>

          <View className={styles.generateBtn} onClick={handleGenerate}>
            <Text className={styles.generateBtnText}>✨ AI 生成话术</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs} style={{ whiteSpace: 'nowrap' }}>
        {scenes.map(s => (
          <View
            key={s}
            className={classnames(styles.tabItem, activeScene === s && styles.tabItemActive)}
            onClick={() => setActiveScene(s)}
            style={{ display: 'inline-flex', verticalAlign: 'top', whiteSpace: 'normal' }}
          >
            <Text className={styles.tabName}>{sceneLabelMap[s]}</Text>
            <Text className={styles.tabDesc}>{sceneDescMap[s]}</Text>
          </View>
        ))}
      </View>

      <View className={styles.scriptList}>
        {loading ? (
          <View className={styles.loading}>
            <View className={styles.spinner} />
            <Text className={styles.loadingText}>AI 正在为您生成专属话术...</Text>
          </View>
        ) : (
          filteredScripts.map(s => (
            <ScriptCard key={s.id} script={s} onFavorite={handleFavorite} />
          ))
        )}
      </View>
    </View>
  )
}

export default ScriptPage
