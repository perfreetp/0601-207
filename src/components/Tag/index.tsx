import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface TagProps {
  text?: string
  color?: string
  bgColor?: string
  size?: 'sm' | 'md'
  small?: boolean
  outline?: boolean
  className?: string
  children?: React.ReactNode
}

const Tag: React.FC<TagProps> = ({ text, children, color = '#2563eb', bgColor, size = 'sm', small, outline, className }) => {
  const displayText = children ?? text ?? ''
  const finalSize = small ? 'sm' : size
  const finalBgColor = bgColor ?? (outline ? 'transparent' : `${color}15`)
  const finalBorder = outline ? `2rpx solid ${color}` : 'none'

  return (
    <View
      className={classnames(styles.tag, finalSize === 'md' && styles.tagMd, small && styles.tagSm, className)}
      style={{ color, backgroundColor: finalBgColor, border: finalBorder }}
    >
      <Text>{displayText}</Text>
    </View>
  )
}

export default Tag
