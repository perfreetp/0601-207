import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface PageHeaderProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
  gradient?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right, gradient = false }) => {
  return (
    <View className={gradient ? styles.headerGradient : styles.header}>
      <View className={styles.headerContent}>
        <View className={styles.titleWrap}>
          <Text className={styles.title}>{title}</Text>
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </View>
        {right && <View className={styles.right}>{right}</View>}
      </View>
    </View>
  )
}

export default PageHeader
