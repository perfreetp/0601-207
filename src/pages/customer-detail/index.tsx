import { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, Textarea, ScrollView, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useCustomerStore } from '@/store/customer'
import { useTaskStore, createFollowUpTask, createMaterialTask, createDealTask } from '@/store/task'
import { stageLabelMap, stageColorMap, commTypeLabel, intentLabelMap, PurchaseStage, CommunicationRecord } from '@/types/customer'
import Tag from '@/components/Tag'
import styles from './index.module.scss'

const CustomerDetail = () => {
  const router = useRouter()
  const customerId = router.params.id || ''
  const getCustomerById = useCustomerStore(s => s.getCustomerById)
  const updateStage = useCustomerStore(s => s.updateStage)
  const updateNote = useCustomerStore(s => s.updateNote)
  const updateNextFollowUp = useCustomerStore(s => s.updateNextFollowUp)
  const updateIntent = useCustomerStore(s => s.updateIntent)
  const updatePendingMaterial = useCustomerStore(s => s.updatePendingMaterial)
  const addCommunication = useCustomerStore(s => s.addCommunication)
  const getTasksByCustomer = useTaskStore(s => s.getTasksByCustomer)

  const customer = getCustomerById(customerId)
  const tasks = getTasksByCustomer(customerId)

  const [editingNote, setEditingNote] = useState('')
  const [showNoteEdit, setShowNoteEdit] = useState(false)
  const [newComm, setNewComm] = useState<Omit<CommunicationRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'call',
    content: '',
    result: ''
  })
  const [showCommForm, setShowCommForm] = useState(false)
  const [newMaterial, setNewMaterial] = useState('')
  const [showMaterialForm, setShowMaterialForm] = useState(false)

  useEffect(() => {
    if (customer) setEditingNote(customer.note)
  }, [customer?.id])

  const pendingTasks = useMemo(() => tasks.filter(t => t.status !== 'done'), [tasks])

  if (!customer) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>客户不存在或已删除</View>
      </View>
    )
  }

  const handleStageChange = (stage: PurchaseStage) => {
    updateStage(customer.id, stage)
    Taro.showToast({ title: `已更新为${stageLabelMap[stage]}`, icon: 'success' })
  }

  const handleSaveNote = () => {
    updateNote(customer.id, editingNote)
    setShowNoteEdit(false)
    Taro.showToast({ title: '备注已保存', icon: 'success' })
  }

  const handleSaveComm = () => {
    if (!newComm.content.trim()) {
      Taro.showToast({ title: '请填写沟通内容', icon: 'none' })
      return
    }
    addCommunication(customer.id, newComm)
    setNewComm({ date: new Date().toISOString().split('T')[0], type: 'call', content: '', result: '' })
    setShowCommForm(false)
    Taro.showToast({ title: '沟通记录已添加', icon: 'success' })
  }

  const handleSetFollowUp = () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    updateNextFollowUp(customer.id, tomorrow)
    createFollowUpTask(customer.id, customer.name, tomorrow, '回访跟进最新意向')
    Taro.showToast({ title: `已设置明天回访`, icon: 'success' })
  }

  const handleSaveMaterial = () => {
    if (!newMaterial.trim()) {
      Taro.showToast({ title: '请填写资料内容', icon: 'none' })
      return
    }
    updatePendingMaterial(customer.id, newMaterial.trim())
    createMaterialTask(customer.id, customer.name, newMaterial.trim())
    setNewMaterial('')
    setShowMaterialForm(false)
    Taro.showToast({ title: '资料待办已创建', icon: 'success' })
  }

  const handleCreateDealTask = () => {
    createDealTask(customer.id, customer.name, '重点跟进，争取成交')
    Taro.showToast({ title: '成交任务已创建', icon: 'success' })
  }

  const gotoRecommend = () => {
    Taro.navigateTo({ url: `/pages/recommend/index?customerId=${customer.id}` })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.hero}>
        <Image className={styles.avatar} src={customer.avatar} />
        <View className={styles.name}>{customer.name}</View>
        <View className={styles.phone}>📞 {customer.phone}</View>
        <View className={styles.stageRow}>
          <Tag color={stageColorMap[customer.stage]}>{stageLabelMap[customer.stage]}</Tag>
          {customer.dealIntent && <Tag color="#f59e0b">意向 {intentLabelMap[customer.dealIntent]}</Tag>}
          {customer.tags.map(t => <Tag key={t} color="#64748b">{t}</Tag>)}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>基础信息</Text>
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>预算范围</Text>
            <Text className={styles.infoValue}>¥ {customer.budget}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>最近联系</Text>
            <Text className={styles.infoValue}>{customer.lastContact}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>下次跟进</Text>
            <Text className={styles.infoValue} style={{ color: '#2563eb' }}>
              {customer.nextFollowUp || '未设置'}
            </Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>已完成任务</Text>
            <Text className={styles.infoValue}>{customer.completedTasks.length} 个</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>购买阶段</Text>
        </View>
        <View className={styles.stagePicker}>
          {(Object.keys(stageLabelMap) as PurchaseStage[]).map(s => (
            <View
              key={s}
              className={`${styles.stageChip} ${customer.stage === s ? styles.stageChipActive : ''}`}
              onClick={() => handleStageChange(s)}
            >
              {stageLabelMap[s]}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>客户偏好</Text>
        </View>
        <View className={styles.tagList}>
          {customer.preferences.length ? customer.preferences.map(p => (
            <Tag key={p} color="#3b82f6" outline>💡 {p}</Tag>
          )) : <Text className={styles.empty}>暂未录入偏好</Text>}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>客户顾虑</Text>
        </View>
        <View className={styles.tagList}>
          {customer.concerns.length ? customer.concerns.map(c => (
            <Tag key={c} color="#ef4444" outline>⚠️ {c}</Tag>
          )) : <Text className={styles.empty}>暂无顾虑记录</Text>}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>备注</Text>
          {showNoteEdit ? (
            <Text className={styles.editLink} onClick={handleSaveNote}>保存</Text>
          ) : (
            <Text className={styles.editLink} onClick={() => setShowNoteEdit(true)}>编辑</Text>
          )}
        </View>
        {showNoteEdit ? (
          <Textarea
            className={styles.noteTextarea}
            value={editingNote}
            onInput={(e) => setEditingNote(e.detail.value)}
            placeholder="补充客户备注信息..."
            maxlength={500}
          />
        ) : (
          <Text style={{ fontSize: '28rpx', color: '#475569', lineHeight: 1.7 }}>
            {customer.note || '暂无备注，点击右上角编辑'}
          </Text>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>下次跟进</Text>
          <Text className={styles.editLink} onClick={handleSetFollowUp}>
            {customer.nextFollowUp ? '更改时间' : '设置明天'}
          </Text>
        </View>
        <View className={styles.dateRow}>
          <Text className={styles.dateLabel}>预定回访时间</Text>
          <Text className={styles.dateValue}>{customer.nextFollowUp || '未安排'}</Text>
        </View>
        <View className={styles.dateRow}>
          <Text className={styles.dateLabel}>成交意向</Text>
          <View className={styles.stagePicker}>
            {(['low', 'medium', 'high'] as const).map(i => (
              <View
                key={i}
                className={`${styles.stageChip} ${customer.dealIntent === i ? styles.stageChipActive : ''}`}
                onClick={() => updateIntent(customer.id, i)}
                style={{ padding: '8rpx 20rpx', fontSize: '24rpx' }}
              >
                {intentLabelMap[i]}
              </View>
            ))}
          </View>
        </View>
        <View className={styles.dateRow}>
          <Text className={styles.dateLabel}>待补资料</Text>
          {showMaterialForm ? (
            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '12rpx', alignItems: 'center' }}>
              <Input
                className={styles.inputField}
                style={{ flex: 1 }}
                value={newMaterial}
                onInput={e => setNewMaterial(e.detail.value)}
                placeholder="如：报价单、检测报告..."
              />
              <View className={styles.btnTiny} onClick={handleSaveMaterial}>保存</View>
            </View>
          ) : (
            customer.pendingMaterial ? (
              <Text className={styles.dateValue} onClick={() => setShowMaterialForm(true)}>
                📋 {customer.pendingMaterial}
              </Text>
            ) : (
              <Text className={styles.editLink} onClick={() => setShowMaterialForm(true)}>+ 添加</Text>
            )
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>待办任务（{pendingTasks.length}）</Text>
          <Text className={styles.editLink} onClick={handleCreateDealTask}>+ 成交任务</Text>
        </View>
        {pendingTasks.length ? (
          <View>
            {pendingTasks.map(t => (
              <View key={t.id} className={styles.taskMiniItem}>
                <Text className={styles.taskMiniTitle}>📌 {t.title}</Text>
                <Text className={styles.taskMiniTime}>{t.dueTime}</Text>
              </View>
            ))}
          </View>
        ) : <Text className={styles.empty}>暂无待办</Text>}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>沟通记录（{customer.communications.length}）</Text>
          <Text className={styles.editLink} onClick={() => setShowCommForm(!showCommForm)}>
            {showCommForm ? '取消' : '+ 新增'}
          </Text>
        </View>
        {showCommForm && (
          <View style={{ marginBottom: '24rpx', padding: '20rpx', background: '#f8fafc', borderRadius: '16rpx', display: 'flex', flexDirection: 'column', gap: '16rpx' }}>
            <View style={{ display: 'flex', gap: '12rpx' }}>
              {(['call', 'visit', 'wechat', 'other'] as const).map(t => (
                <View
                  key={t}
                  className={`${styles.stageChip} ${newComm.type === t ? styles.stageChipActive : ''}`}
                  style={{ padding: '8rpx 20rpx', fontSize: '24rpx' }}
                  onClick={() => setNewComm({ ...newComm, type: t })}
                >
                  {commTypeLabel[t]}
                </View>
              ))}
            </View>
            <Textarea
              className={styles.noteTextarea}
              style={{ minHeight: '120rpx' }}
              value={newComm.content}
              onInput={e => setNewComm({ ...newComm, content: e.detail.value })}
              placeholder="记录本次沟通内容..."
            />
            <Input
              className={styles.inputField}
              value={newComm.result || ''}
              onInput={e => setNewComm({ ...newComm, result: e.detail.value })}
              placeholder="沟通结果（选填）"
            />
            <View className={`${styles.btn} ${styles.btnPrimary}`} style={{ height: '72rpx', fontSize: '28rpx' }} onClick={handleSaveComm}>
              保存沟通记录
            </View>
          </View>
        )}
        <View className={styles.commList}>
          {customer.communications.length ? customer.communications.map(c => (
            <View key={c.id} className={styles.commItem}>
              <View className={styles.commHead}>
                <Text className={styles.commType}>{commTypeLabel[c.type]}沟通</Text>
                <Text className={styles.commDate}>{c.date}</Text>
              </View>
              <Text className={styles.commContent}>{c.content}</Text>
              {c.result && <Text className={styles.commResult}>✅ {c.result}</Text>}
            </View>
          )) : <Text className={styles.empty}>暂无沟通记录</Text>}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleCreateDealTask}>
          创建成交任务
        </View>
        <View className={`${styles.btn} ${styles.btnOutline}`} onClick={gotoRecommend}>
          生成推荐方案
        </View>
        <View className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSetFollowUp}>
          设置明天回访
        </View>
      </View>
    </ScrollView>
  )
}

export default CustomerDetail
