import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import Tag from '@/components/Tag'
import {
  typeLabelMap,
  statusLabelMap,
  statusColorMap,
  priorityLabelMap,
  type Task
} from '@/types/task'
import styles from './index.module.scss'

interface TaskCardProps {
  task: Task
  onStatusChange?: (id: string) => void
}

const priorityColorMap = { high: '#ef4444', medium: '#f59e0b', low: '#94a3b8' }

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const handleClick = () => {
    Taro.showToast({ title: task.title, icon: 'none' })
    console.log('[TaskCard] Click task:', task.id)
  }

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (task.status !== 'done') {
      onStatusChange?.(task.id)
      Taro.showToast({ title: '已完成', icon: 'success' })
    }
  }

  return (
    <View
      className={classnames(styles.card, task.status === 'done' && styles.cardDone)}
      onClick={handleClick}
    >
      <View className={styles.left}>
        <View
          className={classnames(styles.checkbox, task.status === 'done' && styles.checked)}
          onClick={handleStatusToggle}
        >
          {task.status === 'done' && <Text className={styles.checkMark}>✓</Text>}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.topRow}>
          <View className={styles.topTags}>
            <Tag
              text={typeLabelMap[task.type]}
              color="#2563eb"
              bgColor="rgba(37, 99, 235, 0.1)"
            />
            <Tag
              text={`优先级:${priorityLabelMap[task.priority]}`}
              color={priorityColorMap[task.priority]}
              bgColor={`${priorityColorMap[task.priority]}15`}
            />
          </View>
          <Tag
            text={statusLabelMap[task.status]}
            color={statusColorMap[task.status]}
            bgColor={`${statusColorMap[task.status]}15`}
          />
        </View>

        <Text className={classnames(styles.title, task.status === 'done' && styles.titleDone)}>
          {task.title}
        </Text>
        <Text className={styles.description}>{task.description}</Text>

        <View className={styles.bottomRow}>
          <Text className={styles.customer}>关联客户：{task.customerName}</Text>
          <View className={styles.dueTime}>
            <Text className={styles.clockIcon}>⏰</Text>
            <Text className={styles.dueText}>{task.dueTime}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TaskCard
