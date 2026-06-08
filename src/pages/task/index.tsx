import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PageHeader from '@/components/PageHeader'
import TaskCard from '@/components/TaskCard'
import { mockTasks } from '@/data/task'
import { typeLabelMap, type TaskType, type TaskStatus } from '@/types/task'
import styles from './index.module.scss'

type FilterStatus = TaskStatus | 'all'
const statusFilters: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待完成' },
  { key: 'done', label: '已完成' },
  { key: 'overdue', label: '已逾期' }
]
const typeFilters: (TaskType | 'all')[] = ['all', 'followup', 'deal', 'material']

const TaskPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all')
  const [tasks, setTasks] = useState(mockTasks)

  const summary = useMemo(() => ({
    pending: tasks.filter(t => t.status === 'pending').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  }), [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchType = typeFilter === 'all' || t.type === typeFilter
      return matchStatus && matchType
    })
  }, [tasks, statusFilter, typeFilter])

  const handleStatusChange = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' as const } : t))
    console.log('[TaskPage] Task completed:', id)
  }

  React.useEffect(() => {
    console.log('[TaskPage] Loaded, total tasks:', tasks.length)
  }, [])

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="任务中心"
        subtitle="跟进客户，高效管理"
        gradient
      />

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryValue, styles.summaryValueHigh)}>{summary.overdue}</Text>
          <Text className={styles.summaryLabel}>已逾期</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryValue, styles.summaryValueNormal)}>{summary.pending}</Text>
          <Text className={styles.summaryLabel}>待完成</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryValue, styles.summaryValueDone)}>{summary.done}</Text>
          <Text className={styles.summaryLabel}>已完成</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {statusFilters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterTab, statusFilter === f.key && styles.filterTabActive)}
            onClick={() => setStatusFilter(f.key)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollX className={styles.typeTabs}>
        {typeFilters.map(t => (
          <View
            key={t}
            className={classnames(styles.typeTab, typeFilter === t && styles.typeTabActive)}
            onClick={() => setTypeFilter(t)}
          >
            <Text>{t === 'all' ? '全部类型' : typeLabelMap[t]}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.taskList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(t => (
            <TaskCard key={t.id} task={t} onStatusChange={handleStatusChange} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>✅</Text>
            <Text className={styles.emptyText}>暂无相关任务</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TaskPage
