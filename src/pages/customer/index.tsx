import React, { useState, useMemo } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageHeader from '@/components/PageHeader'
import CustomerCard from '@/components/CustomerCard'
import { useCustomerStore } from '@/store/customer'
import { stageLabelMap, type PurchaseStage } from '@/types/customer'
import styles from './index.module.scss'
import classnames from 'classnames'

const stages: (PurchaseStage | 'all')[] = ['all', 'awareness', 'interest', 'comparison', 'decision', 'closed']

const CustomerPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [activeStage, setActiveStage] = useState<PurchaseStage | 'all'>('all')
  const customers = useCustomerStore(s => s.customers)

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchStage = activeStage === 'all' || c.stage === activeStage
      const matchSearch = !searchText || c.name.includes(searchText) || c.phone.includes(searchText)
      return matchStage && matchSearch
    })
  }, [customers, searchText, activeStage])

  const handleAdd = () => {
    console.log('[CustomerPage] Navigate to add customer form')
    Taro.navigateTo({ url: '/pages/customer-form/index' })
  }

  const handleRefresh = () => {
    console.log('[CustomerPage] Pull to refresh')
    setTimeout(() => {
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '刷新成功', icon: 'success' })
    }, 1000)
  }

  React.useEffect(() => {
    console.log('[CustomerPage] Page loaded, customers count:', customers.length)
  }, [customers.length])

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="客户管理"
        subtitle={`共 ${customers.length} 位客户`}
        gradient
        right={
          <View
            onClick={() => Taro.navigateTo({ url: '/pages/product/index' })}
            style={{
              padding: '8rpx 20rpx',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '32rpx',
              color: '#fff',
              fontSize: '24rpx'
            }}
          >
            商品库
          </View>
        }
      />

      <View className={styles.toolbar}>
        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索客户姓名/手机号"
            placeholderClass={styles.searchInput}
            value={searchText}
            onInput={e => setSearchText(e.detail.value)}
          />
        </View>
        <View
          className={classnames(styles.filterBtn, activeStage !== 'all' && styles.filterBtnActive)}
          onClick={() => Taro.navigateTo({ url: '/pages/favorite/index' })}
        >
          <Text>收藏夹</Text>
        </View>
      </View>

      <ScrollView scrollX className={styles.stageTabs}>
        {stages.map(s => (
          <View
            key={s}
            className={classnames(styles.stageTab, activeStage === s && styles.stageTabActive)}
            onClick={() => setActiveStage(s)}
          >
            <Text>{s === 'all' ? '全部' : stageLabelMap[s]}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.customerList}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(c => <CustomerCard key={c.id} customer={c} />)
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无客户数据</Text>
          </View>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleAdd}>
        <Text className={styles.addBtnText}>+</Text>
      </View>
    </View>
  )
}

export default CustomerPage
