import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useProductStore } from '@/store/product'
import type { Product } from '@/types/product'
import styles from './index.module.scss'

const categories = ['客厅家具', '卧室家具', '餐厅家具', '办公家具', '户外家具', '其他']

interface FormState {
  name: string
  category: string
  price: string
  originalPrice: string
  stock: number
  sellingPoints: string[]
  matchSuggestions: string[]
  description: string
}

interface FormErrors {
  name?: string
  price?: string
  stock?: string
}

const ProductFormPage: React.FC = () => {
  const router = useRouter()
  const editId = router.params.id
  const { products, addProduct, updateProduct } = useProductStore()
  const editing: Product | undefined = editId ? products.find(p => p.id === editId) : undefined

  const [form, setForm] = useState<FormState>({
    name: editing?.name || '',
    category: editing?.category || '',
    price: editing ? String(editing.price) : '',
    originalPrice: editing ? String(editing.originalPrice) : '',
    stock: editing?.stock ?? 0,
    sellingPoints: editing?.sellingPoints || [],
    matchSuggestions: editing?.matchSuggestions || [],
    description: editing?.description || ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [pointInput, setPointInput] = useState('')
  const [matchInput, setMatchInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const stockStatusTip = (() => {
    if (form.stock === 0) return { text: '⚠️ 库存为0，客户可能无法下单', cls: styles.stockTipDanger }
    if (form.stock <= 5) return { text: '库存偏低，建议及时补货', cls: styles.stockTipWarning }
    return { text: '库存充足', cls: '' }
  })()

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = '请输入商品名称'
    if (!form.price || Number(form.price) <= 0) newErrors.price = '请输入正确的售价'
    if (form.stock < 0) newErrors.stock = '库存不能为负数'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (submitting) return
    if (!validate()) {
      Taro.showToast({ title: '请完善必填信息', icon: 'none' })
      return
    }
    setSubmitting(true)
    const image = editing?.image || `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300/300`
    const data = {
      name: form.name.trim(),
      category: form.category || '其他',
      price: Number(form.price) || 0,
      originalPrice: Number(form.originalPrice) || Number(form.price) || 0,
      image,
      sellingPoints: form.sellingPoints,
      matchSuggestions: form.matchSuggestions,
      description: form.description,
      stock: form.stock
    }
    if (editing) {
      updateProduct(editing.id, data)
      console.log('[ProductForm] Update product:', editing.id)
    } else {
      addProduct(data)
      console.log('[ProductForm] Add new product')
    }
    setTimeout(() => {
      Taro.showToast({ title: editing ? '已更新商品' : '已添加商品', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 500)
    }, 300)
  }

  const addItem = (field: 'sellingPoints' | 'matchSuggestions', value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (form[field].includes(trimmed)) return
    setForm(prev => ({ ...prev, [field]: [...prev[field], trimmed] }))
    if (field === 'sellingPoints') setPointInput('')
    else setMatchInput('')
  }

  const removeItem = (field: 'sellingPoints' | 'matchSuggestions', index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const adjustStock = (delta: number) => {
    setForm(prev => ({ ...prev, stock: Math.max(0, prev.stock + delta) }))
  }

  return (
    <View className={styles.pageContainer}>
      <View style={{
        padding: '48rpx 32rpx 32rpx',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: '#fff'
      }}>
        <Text style={{ fontSize: '40rpx', fontWeight: '600', display: 'block' }}>
          {editing ? '编辑商品' : '新增商品'}
        </Text>
        <Text style={{ fontSize: '24rpx', opacity: 0.85, marginTop: '8rpx', display: 'block' }}>
          完善商品信息，话术生成更精准
        </Text>
      </View>

      <View className={styles.formContent}>
        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📦</Text>基本信息
          </Text>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>商品名称</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入商品名称"
              placeholderStyle="color: #94a3b8; font-size: 26rpx;"
              value={form.name}
              onInput={e => { setForm(p => ({ ...p, name: e.detail.value })); setErrors(p => ({ ...p, name: undefined })) }}
            />
            {errors.name && <Text className={styles.formError}>{errors.name}</Text>}
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>商品分类</Text>
            <View className={styles.categoryOptions}>
              {categories.map(c => (
                <View
                  key={c}
                  className={classnames(styles.categoryOption, form.category === c && styles.categoryOptionActive)}
                  onClick={() => setForm(p => ({ ...p, category: c }))}
                >
                  <Text>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <View className={styles.priceRow}>
              <View className={styles.priceItem}>
                <Text className={classnames(styles.formLabel, styles.required)}>售价（元）</Text>
                <Input
                  className={styles.formInput}
                  type="digit"
                  placeholder="0.00"
                  placeholderStyle="color: #94a3b8; font-size: 26rpx;"
                  value={form.price}
                  onInput={e => { setForm(p => ({ ...p, price: e.detail.value })); setErrors(p => ({ ...p, price: undefined })) }}
                />
                {errors.price && <Text className={styles.formError}>{errors.price}</Text>}
              </View>
              <View className={styles.priceItem}>
                <Text className={styles.formLabel}>原价（元）</Text>
                <Input
                  className={styles.formInput}
                  type="digit"
                  placeholder="0.00"
                  placeholderStyle="color: #94a3b8; font-size: 26rpx;"
                  value={form.originalPrice}
                  onInput={e => setForm(p => ({ ...p, originalPrice: e.detail.value }))}
                />
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>库存数量</Text>
            <View className={styles.stockRow}>
              <View className={styles.stockBtn} onClick={() => adjustStock(-1)}><Text>-</Text></View>
              <Text className={styles.stockValue}>{form.stock}</Text>
              <View className={styles.stockBtn} onClick={() => adjustStock(1)}><Text>+</Text></View>
              <View className={styles.stockBtn} onClick={() => adjustStock(10)} style={{ width: 'auto', padding: '0 24rpx' }}>
                <Text style={{ fontSize: '26rpx' }}>+10</Text>
              </View>
            </View>
            <Text className={classnames(styles.stockTip, stockStatusTip.cls)}>{stockStatusTip.text}</Text>
            {errors.stock && <Text className={styles.formError}>{errors.stock}</Text>}
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✨</Text>核心卖点
          </Text>
          <View className={styles.tagInputWrap}>
            {form.sellingPoints.map((p, i) => (
              <View key={i} className={styles.tagChip}>
                <Text>{i + 1}. {p}</Text>
                <Text className={styles.tagChipClose} onClick={() => removeItem('sellingPoints', i)}>×</Text>
              </View>
            ))}
            <Input
              className={styles.tagInputInner}
              placeholder="+ 添加卖点，回车确认"
              placeholderStyle="color: #94a3b8; font-size: 24rpx;"
              value={pointInput}
              onInput={e => setPointInput(e.detail.value)}
              confirmType="done"
              onConfirm={() => addItem('sellingPoints', pointInput)}
            />
          </View>
          <Text className={styles.tagHint}>建议添加3-5条最打动客户的卖点</Text>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎯</Text>搭配建议
          </Text>
          <View className={styles.tagInputWrap}>
            {form.matchSuggestions.map((m, i) => (
              <View key={i} className={styles.tagChip} style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                <Text>{m}</Text>
                <Text className={styles.tagChipClose} onClick={() => removeItem('matchSuggestions', i)}>×</Text>
              </View>
            ))}
            <Input
              className={styles.tagInputInner}
              placeholder="+ 添加搭配建议，回车确认"
              placeholderStyle="color: #94a3b8; font-size: 24rpx;"
              value={matchInput}
              onInput={e => setMatchInput(e.detail.value)}
              confirmType="done"
              onConfirm={() => addItem('matchSuggestions', matchInput)}
            />
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>商品描述
          </Text>
          <Input
            className={styles.formTextarea}
            placeholder="简单介绍一下商品特点..."
            placeholderStyle="color: #94a3b8; font-size: 26rpx;"
            value={form.description}
            onInput={e => setForm(p => ({ ...p, description: e.detail.value }))}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          <Text>取消</Text>
        </View>
        <View
          className={classnames(styles.saveBtn, submitting && styles.saveBtnDisabled)}
          onClick={handleSubmit}
        >
          <Text>{editing ? '保存修改' : '保存商品'}</Text>
        </View>
      </View>
    </View>
  )
}

export default ProductFormPage
