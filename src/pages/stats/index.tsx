import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PageHeader from '@/components/PageHeader'
import { useStatsStore } from '@/store/stats'
import { useCustomerStore } from '@/store/customer'
import { useScriptStore } from '@/store/script'
import { stageLabelMap, stageColorMap } from '@/types/customer'
import styles from './index.module.scss'

const statusColorMap: Record<string, string> = {
  success: '#10b981',
  pending: '#f59e0b',
  failed: '#ef4444'
}
const statusTextMap: Record<string, string> = {
  success: '已成交',
  pending: '跟进中',
  failed: '已失败'
}

const StatsPage: React.FC = () => {
  const todayStats = useStatsStore(s => s.getTodayStats())
  const totalScripts = useStatsStore(s => s.totalScriptsGenerated)
  const totalFavorites = useStatsStore(s => s.totalFavorites)
  const totalFollowed = useStatsStore(s => s.totalCustomersFollowed)
  const stageConversions = useStatsStore(s => s.stageConversions)
  const conversionRecords = useStatsStore(s => s.conversionRecords)
  const customers = useCustomerStore(s => s.customers)
  const scripts = useScriptStore(s => s.scripts)

  const customersByStage = useMemo(() => {
    const counts: Record<string, number> = {
      awareness: 0, interest: 0, comparison: 0, decision: 0, closed: 0
    }
    customers.forEach(c => { counts[c.stage] = (counts[c.stage] || 0) + 1 })
    return counts
  }, [customers])

  const maxStageCount = Math.max(...Object.values(customersByStage), 1)
  const closedCount = customersByStage.closed || 0

  const todayTotal = todayStats.scriptsGenerated + todayStats.favoritesAdded + todayStats.customersFollowed + todayStats.tasksCompleted

  React.useEffect(() => {
    console.log('[StatsPage] Today stats:', todayStats)
  }, [todayStats])

  const handleViewDetail = (type: string) => {
    Taro.showToast({ title: `查看${type}`, icon: 'none' })
  }

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="数据统计"
        subtitle={`今日活跃 ${todayTotal} 次操作`}
        gradient
      />

      <View className={styles.statsGrid}>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('话术生成')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{totalScripts}</Text>
            <Text className={styles.statsUnit}>次</Text>
          </View>
          <Text className={styles.statsLabel}>累计生成话术</Text>
          <Text className={styles.statsTrend}>今日 +{todayStats.scriptsGenerated}</Text>
        </View>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('客户跟进')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{totalFollowed}</Text>
            <Text className={styles.statsUnit}>次</Text>
          </View>
          <Text className={styles.statsLabel}>客户跟进</Text>
          <Text className={styles.statsTrend}>今日 +{todayStats.customersFollowed}</Text>
        </View>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('收藏')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{Math.max(0, totalFavorites)}</Text>
            <Text className={styles.statsUnit}>条</Text>
          </View>
          <Text className={styles.statsLabel}>收藏话术</Text>
          <Text className={styles.statsTrend}>今日 +{todayStats.favoritesAdded}</Text>
        </View>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('成交')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{closedCount}</Text>
            <Text className={styles.statsUnit}>单</Text>
          </View>
          <Text className={styles.statsLabel}>已成交客户</Text>
          <Text className={styles.statsTrend}>总客户 {customers.length}</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>📊 今日数据</Text>
      </View>

      <View className={styles.chartCard}>
        <View className={styles.chartHeader}>
          <View>
            <Text className={styles.chartTitle}>今日操作明细</Text>
            <Text className={styles.chartSubtitle}>生成话术 · 收藏 · 跟进 · 完成任务</Text>
          </View>
        </View>
        <View className={styles.chartBars} style={{ flexDirection: 'row' }}>
          {[
            { label: '生成话术', count: todayStats.scriptsGenerated, color: '#2563eb' },
            { label: '收藏', count: todayStats.favoritesAdded, color: '#7c3aed' },
            { label: '客户跟进', count: todayStats.customersFollowed, color: '#10b981' },
            { label: '完成任务', count: todayStats.tasksCompleted, color: '#f59e0b' }
          ].map((d, idx) => {
            const max = Math.max(todayTotal, 1)
            return (
              <View key={idx} className={styles.barItem} style={{ flex: 1 }}>
                <Text className={styles.barValue}>{d.count}</Text>
                <View style={{ width: '100%', height: '100rpx', background: '#f1f5f9', borderRadius: '8rpx', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <View
                    style={{ width: '60%', height: `${(d.count / max) * 100}%`, background: d.color, borderRadius: '8rpx 8rpx 0 0', minHeight: d.count > 0 ? '10rpx' : 0 }}
                  />
                </View>
                <Text className={styles.barLabel} style={{ fontSize: '20rpx', marginTop: '8rpx' }}>{d.label}</Text>
              </View>
            )
          })}
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>🎯 客户阶段分布</Text>
        <Text className={styles.sectionTitleMore}>共 {customers.length} 人</Text>
      </View>

      <View className={styles.conversionList}>
        {Object.entries(customersByStage).map(([stage, count]) => (
          <View key={stage} className={styles.conversionItem}>
            <View className={styles.conversionInfo}>
              <Text className={styles.conversionCustomer}>
                <Text style={{ color: stageColorMap[stage as keyof typeof stageColorMap], fontWeight: 600, marginRight: '12rpx' }}>
                  ●
                </Text>
                {stageLabelMap[stage as keyof typeof stageLabelMap]}
              </Text>
              <Text className={styles.conversionProduct}>
                {stageConversions.find(s => s.stage === stageLabelMap[stage as keyof typeof stageLabelMap])?.rate || 0}% 历史转化率
              </Text>
            </View>
            <View className={styles.conversionRight} style={{ alignItems: 'flex-end' }}>
              <Text className={styles.conversionAmount} style={{ color: '#1e293b' }}>{count} 人</Text>
              <View style={{ width: `${Math.min(100, (count / maxStageCount) * 100)}rpx`, height: '8rpx', background: stageColorMap[stage as keyof typeof stageColorMap], borderRadius: '4rpx', minWidth: count > 0 ? '20rpx' : 0 }} />
            </View>
          </View>
        ))}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>⭐ 优秀话术 TOP</Text>
        <Text className={styles.sectionTitleMore}>按收藏</Text>
      </View>

      <View className={styles.rankList}>
        {scripts.filter(s => s.isFavorite).slice(0, 5).map((s, idx) => (
          <View key={s.id} className={styles.rankItem}>
            <Text className={styles.rankNum} style={{ background: idx === 0 ? '#ef4444' : idx === 1 ? '#f59e0b' : idx === 2 ? '#3b82f6' : '#94a3b8', color: '#fff', width: '48rpx', height: '48rpx', borderRadius: '50%', textAlign: 'center', lineHeight: '48rpx' }}>
              {idx + 1}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '28rpx', fontWeight: 600, color: '#1e293b' }}>{s.title}</Text>
              <Text style={{ fontSize: '22rpx', color: '#64748b', marginTop: '4rpx' }}>
                {s.tags?.slice(0, 3).join(' · ') || 'AI生成'}
              </Text>
            </View>
          </View>
        ))}
        {scripts.filter(s => s.isFavorite).length === 0 && (
          <View style={{ padding: '40rpx', textAlign: 'center', color: '#94a3b8', fontSize: '26rpx' }}>
            暂无收藏话术，去话术页收藏优秀案例吧~
          </View>
        )}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>🏆 团队排行</Text>
        <Text className={styles.sectionTitleMore}>本月</Text>
      </View>

      <View className={styles.rankList}>
        {[
          { rank: 1, name: '王芳（店长）', score: 1280, isMe: false },
          { rank: 2, name: '我', score: totalScripts * 5 + totalFollowed * 8 + closedCount * 50, isMe: true },
          { rank: 3, name: '李明', score: 720, isMe: false },
          { rank: 4, name: '张丽', score: 560, isMe: false },
          { rank: 5, name: '陈强', score: 420, isMe: false }
        ].map(r => (
          <View key={r.rank} className={classnames(styles.rankItem, r.isMe && styles.rankItemMe)}>
            <Text className={styles.rankNum} style={r.rank <= 3 ? { background: r.rank === 1 ? '#ef4444' : r.rank === 2 ? '#f59e0b' : '#3b82f6', color: '#fff', width: '48rpx', height: '48rpx', borderRadius: '50%', textAlign: 'center', lineHeight: '48rpx' } : {}}>
              {r.rank}
            </Text>
            <View className={styles.rankInfo} style={{ flex: 1 }}>
              <Text className={styles.rankName}>{r.name}</Text>
            </View>
            <View>
              <Text className={styles.rankScore}>{r.score}</Text>
              <Text className={styles.rankScoreLabel}>分</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default StatsPage
