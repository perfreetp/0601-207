import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface StatCardProps {
  value: string | number
  label: string
  suffix?: string
  trend?: number
  color?: string
}

const StatCard: React.FC<StatCardProps> = ({ value, label, suffix, trend, color = '#2563eb' }) => {
  return (
    <View className={styles.card}>
      <View className={styles.valueRow}>
        <Text className={styles.value} style={{ color }}>{value}</Text>
        {suffix && <Text className={styles.suffix}>{suffix}</Text>}
      </View>
      <View className={styles.labelRow}>
        <Text className={styles.label}>{label}</Text>
        {trend !== undefined && (
          <Text className={classnames(styles.trend, trend >= 0 ? styles.trendUp : styles.trendDown)}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Text>
        )}
      </View>
    </View>
  )
}

export default StatCard
