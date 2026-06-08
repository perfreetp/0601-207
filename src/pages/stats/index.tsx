import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PageHeader from '@/components/PageHeader'
import { mockUsageStats, mockConversionRecords, mockRankRecords, mockDailyUsage } from '@/data/stats'
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
  const maxCount = Math.max(...mockDailyUsage.map(d => d.count))

  React.useEffect(() => {
    console.log('[StatsPage] Loaded, stats:', mockUsageStats)
  }, [])

  const handleViewDetail = (type: string) => {
    Taro.showToast({ title: `查看${type}详情`, icon: 'none' })
  }

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="数据统计"
        subtitle="AI助力，业绩增长"
        gradient
      />

      <View className={styles.statsGrid}>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('话术生成')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{mockUsageStats.totalScripts}</Text>
            <Text className={styles.statsUnit}>次</Text>
          </View>
          <Text className={styles.statsLabel}>话术生成</Text>
          <Text className={styles.statsTrend}>+{mockUsageStats.weekGrowth}% 周同比</Text>
        </View>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('对话')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{mockUsageStats.totalChats}</Text>
            <Text className={styles.statsUnit}>次</Text>
          </View>
          <Text className={styles.statsLabel}>AI对话</Text>
          <Text className={styles.statsTrend}>+{mockUsageStats.weekGrowth + 3}% 周同比</Text>
        </View>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('收藏')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{mockUsageStats.totalFavorites}</Text>
            <Text className={styles.statsUnit}>条</Text>
          </View>
          <Text className={styles.statsLabel}>收藏话术</Text>
        </View>
        <View className={styles.statsGridItem} onClick={() => handleViewDetail('转化')}>
          <View className={styles.statsValue}>
            <Text className={styles.statsNum}>{mockConversionRecords.filter(c => c.status === 'success').length}</Text>
            <Text className={styles.statsUnit}>单</Text>
          </View>
          <Text className={styles.statsLabel}>本月成交</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>📊 近7天使用趋势</Text>
        <Text className={styles.sectionTitleMore}>查看详情</Text>
      </View>

      <View className={styles.chartCard}>
        <View className={styles.chartHeader}>
          <View>
            <Text className={styles.chartTitle}>话术生成次数</Text>
            <Text className={styles.chartSubtitle}>近7天 · 共 {mockDailyUsage.reduce((a, b) => a + b.count, 0)} 次</Text>
          </View>
        </View>
        <View className={styles.chartBars}>
          {mockDailyUsage.map(d => (
            <View key={d.date} className={styles.barItem}>
              <View
                className={styles.barFill}
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              />
              <Text className={styles.barValue}>{d.count}</Text>
              <Text className={styles.barLabel}>{d.date}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>💰 转化记录</Text>
        <Text className={styles.sectionTitleMore}>查看全部</Text>
      </View>

      <View className={styles.conversionList}>
        {mockConversionRecords.slice(0, 3).map(c => (
          <View key={c.id} className={styles.conversionItem}>
            <View className={styles.conversionInfo}>
              <Text className={styles.conversionCustomer}>
                {c.customerName}
                <Text
                  style={{
                    marginLeft: '12rpx',
                    fontSize: '22rpx',
                    color: statusColorMap[c.status],
                    background: `${statusColorMap[c.status]}15`,
                    padding: '2rpx 12rpx',
                    borderRadius: '8rpx'
                  }}
                >
                  {statusTextMap[c.status]}
                </Text>
              </Text>
              <Text className={styles.conversionProduct}>{c.product}</Text>
            </View>
            <View className={styles.conversionRight}>
              <Text className={styles.conversionAmount}>¥{c.amount.toLocaleString()}</Text>
              <Text className={styles.conversionDate}>{c.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>🏆 个人排行</Text>
        <Text className={styles.sectionTitleMore}>本月</Text>
      </View>

      <View className={styles.rankList}>
        {mockRankRecords.map(r => (
          <View key={r.rank} className={classnames(styles.rankItem, r.isMe && styles.rankItemMe)}>
            <Text className={styles.rankNum}>{r.rank}</Text>
            <Image className={styles.rankAvatar} src={r.avatar} mode="aspectFill" />
            <View className={styles.rankInfo}>
              <Text className={styles.rankName}>{r.name}{r.isMe ? '（我）' : ''}</Text>
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
