import { useState, useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useProductStore } from '@/store/product'
import { useCustomerStore } from '@/store/customer'
import { stockStatusLabelMap, stockStatusColorMap } from '@/types/product'
import Tag from '@/components/Tag'
import styles from './index.module.scss'

const parseBudgetMax = (budget: string): number => {
  const match = budget.match(/(\d+)(?:-(\d+))?/)
  if (!match) return 999999
  if (match[2]) return parseInt(match[2])
  if (budget.includes('以上')) return parseInt(match[1]) * 2
  return parseInt(match[1])
}

const parseBudgetMin = (budget: string): number => {
  const match = budget.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

const RecommendPage = () => {
  const router = useRouter()
  const customerId = router.params.customerId || ''
  const products = useProductStore(s => s.products)
  const getCustomerById = useCustomerStore(s => s.getCustomerById)
  const customer = getCustomerById(customerId)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const selectedProducts = useMemo(() => (
    products.filter(p => selectedIds.includes(p.id))
  ), [products, selectedIds])

  const inStockItems = useMemo(() => (
    selectedProducts.filter(p => p.stockStatus !== 'out')
  ), [selectedProducts])

  const outOfStockItems = useMemo(() => (
    selectedProducts.filter(p => p.stockStatus === 'out')
  ), [selectedProducts])

  const totalPrice = useMemo(() => (
    inStockItems.reduce((sum, p) => sum + (p.price || 0), 0)
  ), [inStockItems])

  const budgetMax = customer ? parseBudgetMax(customer.budget) : 999999
  const budgetMin = customer ? parseBudgetMin(customer.budget) : 0

  const budgetStatus = useMemo(() => {
    if (!customer) return 'none'
    if (totalPrice > budgetMax) return 'over'
    if (totalPrice >= budgetMax * 0.85) return 'near'
    return 'ok'
  }, [totalPrice, budgetMax, customer])

  const alternatives = useMemo(() => {
    if (!customer?.preferences?.length) return []
    return products.filter(p =>
      p.stockStatus !== 'out' &&
      !selectedIds.includes(p.id) &&
      p.sellingPoints.some(sp => customer.preferences.some(pref => sp.includes(pref) || pref.includes(sp)))
    ).slice(0, 2)
  }, [products, selectedIds, customer])

  const handleGenerate = () => {
    if (selectedIds.length === 0) {
      Taro.showToast({ title: '请先选择商品', icon: 'none' })
      return
    }
    setShowResult(true)
  }

  const handleSendToCustomer = () => {
    Taro.showToast({ title: '方案已发送至客户沟通记录', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.hero}>
        <View className={styles.heroTitle}>
          {customer ? `为 ${customer.name} 生成推荐方案` : '商品推荐方案'}
        </View>
        <View className={styles.heroSub}>
          {customer ? `预算 ¥${customer.budget} · 偏好${customer.preferences.slice(0, 2).join('、')}` : '请从下方商品库选择'}
        </View>
      </View>

      {!showResult ? (
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>选择商品（{selectedIds.length}）</Text>
            <Text className={styles.sectionCount}>共 {products.length} 款</Text>
          </View>
          <View className={styles.productPickerList}>
            {products.map(p => (
              <View
                key={p.id}
                className={`${styles.pickerItem} ${selectedIds.includes(p.id) ? styles.pickerItemSelected : ''}`}
                onClick={() => toggleSelect(p.id)}
              >
                <View className={`${styles.checkbox} ${selectedIds.includes(p.id) ? styles.checkboxChecked : ''}`}>
                  {selectedIds.includes(p.id) && '✓'}
                </View>
                <Image className={styles.thumb} src={p.image} mode="aspectFill" />
                <View className={styles.pInfo}>
                  <View className={styles.pName}>{p.name}</View>
                  <View className={styles.pMeta}>
                    <Text className={styles.pPrice}>¥{p.price?.toLocaleString() || 0}</Text>
                    <Tag color={stockStatusColorMap[p.stockStatus]} small>
                      {stockStatusLabelMap[p.stockStatus]} {p.stock}件
                    </Tag>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <>
          {inStockItems.length > 0 && (
            <View className={styles.section}>
              <View className={styles.sectionTitle}>
                <Text>✅ 现货推荐清单（{inStockItems.length}款）</Text>
              </View>
              {inStockItems.map(p => (
                <View key={p.id} className={styles.resultCard}>
                  <View className={styles.rHead}>
                    <Text className={styles.rName}>{p.name}</Text>
                    <Text className={styles.rPrice}>¥{p.price?.toLocaleString() || 0}</Text>
                  </View>
                  <View className={`${styles.rStockBadge} ${p.stockStatus === 'sufficient' ? styles.rStockOk : p.stockStatus === 'low' ? styles.rStockLow : styles.rStockOut}`}>
                    {stockStatusLabelMap[p.stockStatus]} · 库存 {p.stock} 件
                  </View>
                  <View className={styles.rSelling}>💡 卖点：{p.sellingPoints.join('、')}</View>
                  {customer?.preferences?.length && p.sellingPoints.some(sp => customer.preferences.some(pref => sp.includes(pref) || pref.includes(sp))) && (
                    <View className={styles.rMatch}>
                      ⭐ 匹配客户偏好：{p.sellingPoints.filter(sp => customer.preferences.some(pref => sp.includes(pref) || pref.includes(sp))).slice(0, 2).join('、')}
                    </View>
                  )}
                  {p.pairingSuggestions?.length > 0 && (
                    <View className={styles.rMatch} style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#047857' }}>
                      🤝 搭配建议：{p.pairingSuggestions.slice(0, 2).join(' + ')}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {outOfStockItems.length > 0 && (
            <View className={styles.section}>
              <View className={styles.sectionTitle}>
                <Text style={{ color: '#b45309' }}>⚠️ 预售 / 缺货商品（{outOfStockItems.length}款）</Text>
              </View>
              {outOfStockItems.map(p => (
                <View key={p.id} className={`${styles.resultCard} ${styles.resultCardOut}`}>
                  <View className={styles.rHead}>
                    <Text className={styles.rName} style={{ color: '#64748b' }}>{p.name}</Text>
                    <Text className={styles.rPrice} style={{ color: '#94a3b8' }}>¥{p.price?.toLocaleString() || 0}</Text>
                  </View>
                  <View className={`${styles.rStockBadge} ${styles.rStockOut}`}>
                    已售罄 · 预计补货7-14天
                  </View>
                  <View className={styles.rSelling}>💡 卖点：{p.sellingPoints.join('、')}</View>
                  <View className={styles.rPreorderTip}>
                    🔔 此商品暂无现货，可告知客户接受预售（定金50%锁定价格）或推荐替代方案。
                    {alternatives.length > 0 && ` 可考虑替代：${alternatives.map(a => a.name).join('、')}`}
                  </View>
                </View>
              ))}
              {alternatives.length > 0 && (
                <View className={styles.alternateBox}>
                  💜 替代推荐（现货）：{alternatives.map(a => `${a.name}¥${a.price}`).join(' / ')}
                </View>
              )}
            </View>
          )}

          <View className={styles.section}>
            <View className={styles.sectionTitle}><Text>方案汇总</Text></View>
            <View className={styles.summaryBox}>
              <View className={styles.summaryRow}>
                <Text className={styles.summaryLabel}>现货商品</Text>
                <Text className={styles.summaryValue}>{inStockItems.length} 款</Text>
              </View>
              {outOfStockItems.length > 0 && (
                <View className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>预售商品</Text>
                  <Text className={styles.summaryValue}>{outOfStockItems.length} 款</Text>
                </View>
              )}
              <View className={styles.summaryRow}>
                <Text className={styles.summaryLabel}>客户预算</Text>
                <Text className={styles.summaryValue}>¥{customer?.budget || '未设置'}</Text>
              </View>
              <View className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <Text className={styles.summaryLabel}>现货总价</Text>
                <Text className={styles.totalPrice}>¥{totalPrice.toLocaleString()}</Text>
              </View>
              {customer && budgetStatus !== 'none' && (
                <View className={`${styles.budgetHint} ${budgetStatus === 'ok' ? styles.budgetOk : budgetStatus === 'near' ? styles.budgetNear : styles.budgetOver}`}>
                  {budgetStatus === 'ok' && `✅ 在预算范围内，剩余额度 ¥${(budgetMax - totalPrice).toLocaleString()}`}
                  {budgetStatus === 'near' && `⚠️ 已接近预算上限（¥${budgetMax}），建议客户确认`}
                  {budgetStatus === 'over' && `❌ 超出预算 ¥${(totalPrice - budgetMax).toLocaleString()}，建议精简或调整档次`}
                </View>
              )}
            </View>
          </View>
        </>
      )}

      <View className={styles.bottomBar}>
        {showResult ? (
          <>
            <View className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowResult(false)}>
              重新选择
            </View>
            <View className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSendToCustomer}>
              发送给客户
            </View>
          </>
        ) : (
          <View
            className={`${styles.btn} ${selectedIds.length === 0 ? styles.btnDisabled : styles.btnPrimary}`}
            onClick={handleGenerate}
          >
            生成推荐方案（{selectedIds.length}）
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default RecommendPage
