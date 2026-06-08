import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Tag from '@/components/Tag'
import { stageLabelMap, stageColorMap, type Customer } from '@/types/customer'
import styles from './index.module.scss'

interface CustomerCardProps {
  customer: Customer
  onClick?: () => void
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  const handleClick = () => {
    onClick?.()
    console.log('[CustomerCard] Click customer:', customer.id)
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={customer.avatar} mode="aspectFill" />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{customer.name}</Text>
            <Tag
              text={stageLabelMap[customer.stage]}
              color={stageColorMap[customer.stage]}
              bgColor={`${stageColorMap[customer.stage]}15`}
            />
          </View>
          <Text className={styles.phone}>{customer.phone} · 预算¥{customer.budget}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionLabel}>偏好</Text>
        <View className={styles.tagList}>
          {customer.preferences.slice(0, 3).map(p => (
            <Tag key={p} text={p} color="#475569" bgColor="#f1f5f9" />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionLabel}>顾虑</Text>
        <View className={styles.tagList}>
          {customer.concerns.slice(0, 3).map(c => (
            <Tag key={c} text={c} color="#f59e0b" bgColor="rgba(245, 158, 11, 0.1)" />
          ))}
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.footerTags}>
          {customer.tags.map(t => (
            <Tag key={t} text={t} color="#7c3aed" bgColor="rgba(124, 58, 237, 0.1)" />
          ))}
        </View>
        <Text className={styles.lastContact}>上次联系：{customer.lastContact}</Text>
      </View>
    </View>
  )
}

export default CustomerCard
