import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useCustomerStore } from '@/store/customer'
import { stageLabelMap, type PurchaseStage } from '@/types/customer'
import styles from './index.module.scss'

const stages: PurchaseStage[] = ['awareness', 'interest', 'comparison', 'decision', 'closed']

const budgetOptions = [
  '5000以下',
  '5000-8000',
  '8000-12000',
  '12000-15000',
  '15000-20000',
  '20000以上'
]

const preferencePresets = ['简约风格', '环保材质', '浅色系列', '深色系列', '科技感', '多功能', '性价比', '实木材质', '定制款']
const concernPresets = ['甲醛问题', '售后服务', '配送周期', '产品耐用性', '安装服务', '价格优惠', '尺寸适配', '储物空间', '安全性', '环保等级']

interface FormState {
  name: string
  phone: string
  budget: string
  preferences: string[]
  concerns: string[]
  stage: PurchaseStage
  note: string
  tags: string[]
}

interface FormErrors {
  name?: string
  phone?: string
}

const CustomerFormPage: React.FC = () => {
  const addCustomer = useCustomerStore(s => s.addCustomer)
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    budget: '',
    preferences: [],
    concerns: [],
    stage: 'awareness',
    note: '',
    tags: []
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [prefInput, setPrefInput] = useState('')
  const [concernInput, setConcernInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) {
      newErrors.name = '请输入客户姓名'
    }
    if (!form.phone.trim()) {
      newErrors.phone = '请输入手机号'
    } else if (!/^1\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = '请输入正确的11位手机号'
    }
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
    console.log('[CustomerForm] Submit:', form)
    addCustomer({
      name: form.name.trim(),
      avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/200`,
      phone: form.phone.trim(),
      budget: form.budget || '未设置',
      preferences: form.preferences,
      concerns: form.concerns,
      stage: form.stage,
      note: form.note,
      tags: form.tags
    })
    setTimeout(() => {
      Taro.showToast({ title: '客户已保存', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 500)
    }, 300)
  }

  const toggleTag = (field: 'preferences' | 'concerns', value: string) => {
    setForm(prev => {
      const list = prev[field]
      const exists = list.includes(value)
      return {
        ...prev,
        [field]: exists ? list.filter(x => x !== value) : [...list, value]
      }
    })
  }

  const addCustomTag = (field: 'preferences' | 'concerns', value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (form[field].includes(trimmed)) return
    setForm(prev => ({ ...prev, [field]: [...prev[field], trimmed] }))
    if (field === 'preferences') setPrefInput('')
    else setConcernInput('')
  }

  const removeTag = (field: 'preferences' | 'concerns', value: string) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter(x => x !== value) }))
  }

  return (
    <View className={styles.pageContainer}>
      <View style={{
        padding: '48rpx 32rpx 32rpx',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: '#fff'
      }}>
        <Text style={{ fontSize: '40rpx', fontWeight: '600', display: 'block' }}>登记新客户</Text>
        <Text style={{ fontSize: '24rpx', opacity: 0.85, marginTop: '8rpx', display: 'block' }}>完善客户画像，AI精准生成话术</Text>
      </View>

      <View className={styles.formContent}>
        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>基本信息
          </Text>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>客户姓名</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入客户姓名"
              placeholderStyle="color: #94a3b8; font-size: 26rpx;"
              value={form.name}
              onInput={e => { setForm(prev => ({ ...prev, name: e.detail.value })); setErrors(p => ({ ...p, name: undefined })) }}
            />
            {errors.name && <Text className={styles.formError}>{errors.name}</Text>}
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>手机号</Text>
            <Input
              className={styles.formInput}
              type="number"
              maxlength={11}
              placeholder="请输入11位手机号"
              placeholderStyle="color: #94a3b8; font-size: 26rpx;"
              value={form.phone}
              onInput={e => { setForm(prev => ({ ...prev, phone: e.detail.value })); setErrors(p => ({ ...p, phone: undefined })) }}
            />
            {errors.phone && <Text className={styles.formError}>{errors.phone}</Text>}
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>预算范围</Text>
            <View className={styles.stageOptions}>
              {budgetOptions.map(b => (
                <View
                  key={b}
                  className={classnames(styles.stageOption, form.budget === b && styles.stageOptionActive)}
                  onClick={() => setForm(prev => ({ ...prev, budget: b }))}
                >
                  <Text>¥{b}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>购买阶段</Text>
            <View className={styles.stageOptions}>
              {stages.map(s => (
                <View
                  key={s}
                  className={classnames(styles.stageOption, form.stage === s && styles.stageOptionActive)}
                  onClick={() => setForm(prev => ({ ...prev, stage: s }))}
                >
                  <Text>{stageLabelMap[s]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎯</Text>客户画像
          </Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>客户偏好</Text>
            <View className={styles.tagInputWrap}>
              {form.preferences.map(p => (
                <View key={p} className={styles.tagChip}>
                  <Text>{p}</Text>
                  <Text className={styles.tagChipClose} onClick={() => removeTag('preferences', p)}>×</Text>
                </View>
              ))}
              <Input
                className={styles.tagInputInner}
                placeholder="自定义"
                placeholderStyle="color: #94a3b8; font-size: 24rpx;"
                value={prefInput}
                onInput={e => setPrefInput(e.detail.value)}
                confirmType="done"
                onConfirm={() => addCustomTag('preferences', prefInput)}
              />
            </View>
            <View style={{ marginTop: '16rpx', display: 'flex', flexWrap: 'wrap', gap: '12rpx' }}>
              {preferencePresets.filter(p => !form.preferences.includes(p)).map(p => (
                <View
                  key={p}
                  onClick={() => toggleTag('preferences', p)}
                  style={{
                    padding: '8rpx 20rpx',
                    borderRadius: '32rpx',
                    background: '#f1f5f9',
                    fontSize: '24rpx',
                    color: '#64748b'
                  }}
                >
                  <Text>+ {p}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>客户顾虑</Text>
            <View className={styles.tagInputWrap}>
              {form.concerns.map(c => (
                <View key={c} className={styles.tagChip} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Text>{c}</Text>
                  <Text className={styles.tagChipClose} onClick={() => removeTag('concerns', c)}>×</Text>
                </View>
              ))}
              <Input
                className={styles.tagInputInner}
                placeholder="自定义"
                placeholderStyle="color: #94a3b8; font-size: 24rpx;"
                value={concernInput}
                onInput={e => setConcernInput(e.detail.value)}
                confirmType="done"
                onConfirm={() => addCustomTag('concerns', concernInput)}
              />
            </View>
            <View style={{ marginTop: '16rpx', display: 'flex', flexWrap: 'wrap', gap: '12rpx' }}>
              {concernPresets.filter(c => !form.concerns.includes(c)).map(c => (
                <View
                  key={c}
                  onClick={() => toggleTag('concerns', c)}
                  style={{
                    padding: '8rpx 20rpx',
                    borderRadius: '32rpx',
                    background: '#f1f5f9',
                    fontSize: '24rpx',
                    color: '#64748b'
                  }}
                >
                  <Text>+ {c}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>备注</Text>
            <Input
              className={styles.formInput}
              placeholder="记录客户特殊需求、家庭成员等..."
              placeholderStyle="color: #94a3b8; font-size: 26rpx;"
              value={form.note}
              onInput={e => setForm(prev => ({ ...prev, note: e.detail.value }))}
            />
          </View>
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
          <Text>保存客户</Text>
        </View>
      </View>
    </View>
  )
}

export default CustomerFormPage
