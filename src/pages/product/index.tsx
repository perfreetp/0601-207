import React, { useState, useMemo } from 'react'
import { View, Text, Image, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useProductStore } from '@/store/product'
import { stockLabelMap, stockColorMap, type Product } from '@/types/product'
import styles from './index.module.scss'

const categories = ['全部', '客厅家具', '卧室家具', '餐厅家具', '办公家具']

const ProductPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const products = useProductStore(s => s.products)

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === '全部' || p.category === activeCategory
      const matchSearch = !searchText || p.name.includes(searchText) || p.category.includes(searchText)
      return matchCategory && matchSearch
    })
  }, [products, searchText, activeCategory])

  const handleAdd = () => {
    console.log('[ProductPage] Navigate to add product form')
    Taro.navigateTo({ url: '/pages/product-form/index' })
  }

  const handleEdit = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    console.log('[ProductPage] Edit product:', product.id)
    Taro.navigateTo({ url: `/pages/product-form/index?id=${product.id}` })
  }

  const handleGenerateScript = (product: Product) => {
    if (product.stock === 0) {
      Taro.showToast({ title: '该商品已售罄，建议推荐预售', icon: 'none' })
      return
    }
    console.log('[ProductPage] Generate script for product:', product.id)
    const context = `${product.name}，售价¥${product.price}，卖点：${product.sellingPoints.slice(0, 2).join('、')}`
    Taro.showToast({ title: '正在生成产品话术...', icon: 'none' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/script/index' })
    }, 600)
  }

  const handleViewMatch = (product: Product) => {
    console.log('[ProductPage] View match suggestions for:', product.id)
    Taro.showToast({ title: `查看${product.name}搭配`, icon: 'none' })
  }

  React.useEffect(() => {
    console.log('[ProductPage] Loaded, products:', products.length)
  }, [products.length])

  return (
    <View className={styles.pageContainer}>
      <View style={{
        padding: '48rpx 32rpx 32rpx',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: '#fff'
      }}>
        <Text style={{ fontSize: '40rpx', fontWeight: '600', display: 'block' }}>商品知识库</Text>
        <Text style={{ fontSize: '24rpx', opacity: 0.85, marginTop: '8rpx', display: 'block' }}>掌握产品卖点，轻松应对客户</Text>
      </View>

      <View className={styles.searchBar}>
        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索商品名称或分类"
            placeholderStyle="color: #94a3b8; font-size: 26rpx;"
            value={searchText}
            onInput={e => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <ScrollView scrollX className={styles.categoryTabs}>
        {categories.map(c => (
          <View
            key={c}
            className={classnames(styles.categoryTab, activeCategory === c && styles.categoryTabActive)}
            onClick={() => setActiveCategory(c)}
            style={{ display: 'inline-flex', verticalAlign: 'top', whiteSpace: 'normal' }}
          >
            <Text>{c}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <View key={p.id} className={styles.productCard}>
              <View className={styles.editBtn} onClick={(e) => handleEdit(e, p)}>
                <Text>✎</Text>
              </View>
              <View className={styles.productHeader}>
                <Image className={styles.productImage} src={p.image} mode="aspectFill" />
                <View className={styles.productInfo}>
                  <View>
                    <View className={styles.productTop}>
                      <Text className={styles.productName}>{p.name}</Text>
                      <Text
                        className={styles.stockBadge}
                        style={{
                          color: stockColorMap[p.stockStatus],
                          backgroundColor: `${stockColorMap[p.stockStatus]}15`
                        }}
                      >
                        {stockLabelMap[p.stockStatus]}（{p.stock}件）
                      </Text>
                    </View>
                    <Text className={styles.productCategory}>{p.category}</Text>
                  </View>
                  <View className={styles.priceRow}>
                    <Text className={styles.productPrice}>¥{p.price.toLocaleString()}</Text>
                    <Text className={styles.productOriginalPrice}>¥{p.originalPrice.toLocaleString()}</Text>
                  </View>
                </View>
              </View>

              <View className={styles.productBody}>
                <Text className={styles.sectionTitle}>✨ 核心卖点</Text>
                <View className={styles.pointsList}>
                  {p.sellingPoints.map((point, i) => (
                    <View key={i} className={styles.pointItem}>
                      <Text className={styles.pointBullet}>{i + 1}</Text>
                      <Text style={{ flex: 1 }}>{point}</Text>
                    </View>
                  ))}
                </View>

                <Text className={styles.sectionTitle} style={{ marginTop: '32rpx' }}>🎯 搭配建议</Text>
                <View className={styles.matchList}>
                  {p.matchSuggestions.map((m, i) => (
                    <Text key={i} className={styles.matchTag}>{m}</Text>
                  ))}
                </View>
              </View>

              <View className={styles.productFooter}>
                <View
                  className={classnames(styles.footerBtn, styles.footerBtnOutline)}
                  onClick={() => handleViewMatch(p)}
                >
                  <Text>查看搭配</Text>
                </View>
                <View
                  className={classnames(styles.footerBtn, p.stock === 0 ? styles.footerBtnDisabled : styles.footerBtnPrimary)}
                  onClick={() => handleGenerateScript(p)}
                >
                  <Text>{p.stock === 0 ? '已售罄' : '生成话术'}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无相关商品</Text>
          </View>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleAdd}>
        <Text className={styles.addBtnText}>+</Text>
      </View>
    </View>
  )
}

export default ProductPage
