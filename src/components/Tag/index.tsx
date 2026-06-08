import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface TagProps {
  text: string
  color?: string
  bgColor?: string
  size?: 'sm' | 'md'
  className?: string
}

const Tag: React.FC<TagProps> = ({ text, color = '#2563eb', bgColor = 'rgba(37, 99, 235, 0.1)', size = 'sm', className }) => {
  return (
    <View
      className={classnames(styles.tag, size === 'md' && styles.tagMd, className)}
      style={{ color, backgroundColor: bgColor }}
    >
      <Text>{text}</Text>
    </View>
  )
}

export default Tag
