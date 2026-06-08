import React, { useState, useRef, useEffect } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PageHeader from '@/components/PageHeader'
import { toneLabelMap, type ScriptTone } from '@/types/script'
import styles from './index.module.scss'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  highlights?: number[][]
}

const tones: ScriptTone[] = ['professional', 'friendly', 'warm', 'concise']

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: '您好！我是AI销售助手。您可以直接输入客户说的话，我会帮您生成专业的回复话术。支持语音输入、快速改写和语气切换哦~',
      highlights: [[20, 24], [41, 45]]
    }
  ])
  const [input, setInput] = useState('')
  const [tone, setTone] = useState<ScriptTone>('friendly')
  const scrollRef = useRef<any>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 99999, animated: true })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    console.log('[ChatPage] Send message:', input, 'tone:', tone)
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateReply(input, tone),
        highlights: [[5, 12], [28, 34]]
      }
      setMessages(prev => [...prev, aiMsg])
      Taro.showToast({ title: 'AI已生成回复', icon: 'success' })
    }, 800)
  }

  const generateReply = (text: string, t: ScriptTone): string => {
    const toneText = toneLabelMap[t]
    const templates = {
      professional: `非常专业的分析！根据您提到的"${text.slice(0, 20)}"，建议从以下几点切入：1. 强调产品核心优势 2. 用数据和案例支撑 3. 主动询问客户深层需求。请问您需要我进一步细化哪部分？`,
      friendly: `太好了！针对客户说的"${text.slice(0, 20)}"，我建议您可以这样回复：先表示理解和认同，然后自然地引出我们产品的优势，最后以轻松的方式引导下一步沟通。需要我帮您组织具体语言吗？`,
      warm: `非常理解~客户提到"${text.slice(0, 20)}"，可以先站在客户的角度表示关切，让客户感受到您的真诚，然后再介绍我们的解决方案。您看需要我生成更亲切的版本吗？`,
      concise: `针对"${text.slice(0, 15)}"，核心回复三要点：1. 认同客户 2. 突出价值 3. 引导行动。需要简洁版完整话术吗？`
    }
    return templates[t] || templates.friendly
  }

  const handleVoice = () => {
    Taro.showToast({ title: '开始语音输入...', icon: 'none' })
    console.log('[ChatPage] Voice input started')
    setTimeout(() => {
      setInput('客户说价格太贵了，别家更便宜')
    }, 1500)
  }

  const handleQuick = (action: string) => {
    console.log('[ChatPage] Quick action:', action)
    Taro.showToast({ title: `${action}功能演示中`, icon: 'none' })
  }

  const handleMsgAction = (action: string, msg: ChatMessage) => {
    console.log('[ChatPage] Message action:', action, msg.id)
    if (action === 'copy') {
      Taro.setClipboardData({ data: msg.content, success: () => Taro.showToast({ title: '已复制', icon: 'success' }) })
    } else if (action === 'mark') {
      Taro.showToast({ title: '已标记重点', icon: 'success' })
    } else if (action === 'rewrite') {
      Taro.showToast({ title: '正在重新生成...', icon: 'none' })
    }
  }

  const renderContent = (msg: ChatMessage) => {
    if (!msg.highlights || msg.highlights.length === 0) {
      return <Text className={styles.msgText}>{msg.content}</Text>
    }
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    msg.highlights.forEach(([start, end], i) => {
      if (start > lastIndex) {
        parts.push(<Text key={`t-${i}`}>{msg.content.slice(lastIndex, start)}</Text>)
      }
      parts.push(
        <Text key={`h-${i}`} className={styles.msgHighlight}>
          {msg.content.slice(start, end)}
        </Text>
      )
      lastIndex = end
    })
    if (lastIndex < msg.content.length) {
      parts.push(<Text key="t-end">{msg.content.slice(lastIndex)}</Text>)
    }
    return <Text className={styles.msgText}>{parts}</Text>
  }

  return (
    <View className={styles.pageContainer}>
      <PageHeader title="智能对话助手" subtitle="实时生成专业回复" gradient />

      <ScrollView className={styles.chatArea} scrollY ref={scrollRef}>
        {messages.map(msg => (
          <View
            key={msg.id}
            className={classnames(styles.msgItem, msg.role === 'user' && styles.msgItemUser)}
          >
            <View className={styles.msgAvatar}>
              <Text>{msg.role === 'ai' ? 'AI' : '我'}</Text>
            </View>
            <View className={styles.msgBubble}>
              {renderContent(msg)}
              {msg.role === 'ai' && (
                <View className={styles.msgActions}>
                  <Text className={styles.msgActionBtn} onClick={() => handleMsgAction('copy', msg)}>复制</Text>
                  <Text className={styles.msgActionBtn} onClick={() => handleMsgAction('rewrite', msg)}>改写</Text>
                  <Text className={styles.msgActionBtn} onClick={() => handleMsgAction('mark', msg)}>标记重点</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className={styles.toolbar}>
        <View className={styles.toneRow} style={{ whiteSpace: 'nowrap' }}>
          <Text style={{ fontSize: '24rpx', color: '#94a3b8', marginRight: '8rpx', alignSelf: 'center' }}>语气：</Text>
          {tones.map(t => (
            <View
              key={t}
              className={classnames(styles.toneBtn, tone === t && styles.toneBtnActive)}
              onClick={() => setTone(t)}
              style={{ display: 'inline-flex', verticalAlign: 'top', whiteSpace: 'normal' }}
            >
              <Text>{toneLabelMap[t]}</Text>
            </View>
          ))}
        </View>

        <View className={styles.inputRow}>
          <View className={styles.inputBox}>
            <View className={styles.voiceBtn} onClick={handleVoice}>
              <Text className={styles.voiceIcon}>🎤</Text>
            </View>
            <Input
              className={styles.msgInput}
              placeholder="输入客户说的话或描述场景..."
              placeholderStyle="color: #94a3b8; font-size: 26rpx;"
              value={input}
              onInput={e => setInput(e.detail.value)}
              confirmType="send"
              onConfirm={handleSend}
            />
          </View>
          <View className={styles.sendBtn} onClick={handleSend}>
            <Text className={styles.sendText}>发送</Text>
          </View>
        </View>

        <View className={styles.quickActions}>
          <View className={styles.quickBtn} onClick={() => handleQuick('改写')}>
            <Text>✨ 快速改写</Text>
          </View>
          <View className={styles.quickBtn} onClick={() => handleQuick('扩写')}>
            <Text>📝 内容扩写</Text>
          </View>
          <View className={styles.quickBtn} onClick={() => handleQuick('翻译')}>
            <Text>🌐 中英互译</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ChatPage
