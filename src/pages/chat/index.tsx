import React, { useState, useRef, useEffect } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PageHeader from '@/components/PageHeader'
import Tag from '@/components/Tag'
import { toneLabelMap, type ScriptTone } from '@/types/script'
import styles from './index.module.scss'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  highlights?: number[][]
  tone?: ScriptTone
  marked?: boolean
  isVersion?: boolean
  versionOf?: string
}

const tones: ScriptTone[] = ['professional', 'friendly', 'warm', 'concise']

const replyTemplates: Record<ScriptTone, Record<string, { content: string; highlights: number[][] }>> = {
  professional: {
    default: {
      content: '非常专业的分析！根据客户的需求，我建议从以下几点切入：1. 强调产品核心优势 2. 用数据和案例支撑 3. 主动询问客户深层需求。请问您需要进一步细化哪部分？',
      highlights: [[14, 18], [26, 32]]
    }
  },
  friendly: {
    default: {
      content: '太好了！我建议您可以这样回复客户：先表示理解和认同，然后自然地引出我们产品的优势，最后以轻松的方式引导下一步沟通。需要我帮您组织更具体的语言吗？',
      highlights: [[6, 10], [28, 36]]
    }
  },
  warm: {
    default: {
      content: '非常理解客户的感受~ 可以先站在客户的角度表示关切，让客户感受到您的真诚，然后再介绍我们的解决方案。您看需要我生成更亲切、更拉近距离的版本吗？',
      highlights: [[0, 4], [40, 48]]
    }
  },
  concise: {
    default: {
      content: '核心回复三要点：1. 认同客户感受 2. 突出产品价值 3. 引导下一步行动。简洁高效，直接说重点！',
      highlights: [[0, 8], [32, 36]]
    }
  }
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: '您好！我是AI销售助手。您可以直接输入客户说的话，我会帮您生成专业的回复话术。支持语音输入、快速改写和语气切换哦~',
      highlights: [[20, 24], [41, 45]],
      tone: 'friendly'
    }
  ])
  const [input, setInput] = useState('')
  const [tone, setTone] = useState<ScriptTone>('friendly')
  const [rewritingId, setRewritingId] = useState<string | null>(null)
  const scrollRef = useRef<any>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 99999, animated: true })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateReply = (_text: string, t: ScriptTone, variant: number = 0): { content: string; highlights: number[][] } => {
    const base = replyTemplates[t].default
    if (variant === 0) return base
    const variants: Record<ScriptTone, string[]> = {
      professional: [
        '换个专业角度来看：建议采用FABE法则——Feature特点、Advantage优势、Benefit利益、Evidence证据，层层递进说服客户。',
        '专业版话术：您的顾虑我非常理解，根据行业数据报告，我们的产品在同类中返修率最低，且拥有30000+真实用户好评，品质值得信赖。'
      ],
      friendly: [
        '换个更轻松的方式：您看这样说会不会更好？"哎呀我懂您的感受！其实好多客户一开始也这么想，后来用了都说真香呢~"',
        '亲切版：哈哈这个问题问得好！其实我当初选的时候也纠结过，后来对比了好多家，发现这款确实是性价比最高的~'
      ],
      warm: [
        '更亲切的说法：我特别能体会您的心情，换作是我也会特别在意这些细节。您放心，我们的服务都是老客户公认的好~',
        '暖心版：姐/哥您放心，我跟您说句实在的，这个问题我们碰到过很多次了，我们的售后团队都是24小时在线的，随叫随到！'
      ],
      concise: [
        '简洁版三句话：1.理解 2.优势 3.邀约。就这么简单，别啰嗦！',
        '精华版：您说的对。我们的更好。今天定吗？'
      ]
    }
    return {
      content: variants[t][(variant - 1) % variants[t].length],
      highlights: [[6, 12], [24, 30]]
    }
  }

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
      const reply = generateReply(input, tone)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: reply.content,
        highlights: reply.highlights,
        tone
      }
      setMessages(prev => [...prev, aiMsg])
      Taro.showToast({ title: `已生成${toneLabelMap[tone]}语气回复`, icon: 'success' })
    }, 800)
  }

  const handleVoice = () => {
    Taro.showToast({ title: '开始语音输入...', icon: 'none' })
    console.log('[ChatPage] Voice input started')
    setTimeout(() => {
      setInput('客户说价格太贵了，别家更便宜')
    }, 1500)
  }

  const handleRewrite = (msg: ChatMessage) => {
    console.log('[ChatPage] Rewrite message:', msg.id, 'current tone:', tone)
    setRewritingId(msg.id)
    Taro.showToast({ title: `正在生成${toneLabelMap[tone]}新版本...`, icon: 'none' })

    setTimeout(() => {
      const versionCount = messages.filter(m => m.versionOf === msg.id).length
      const reply = generateReply(msg.content, tone, versionCount + 1)
      const newVersion: ChatMessage = {
        id: `${msg.id}-v${versionCount + 1}-${Date.now()}`,
        role: 'ai',
        content: reply.content,
        highlights: reply.highlights,
        tone,
        isVersion: true,
        versionOf: msg.id
      }
      setMessages(prev => {
        const idx = prev.findIndex(m => m.id === msg.id)
        const insertIdx = idx + 1 + versionCount
        const newMessages = [...prev]
        newMessages.splice(insertIdx, 0, newVersion)
        return newMessages
      })
      setRewritingId(null)
      Taro.showToast({ title: `${toneLabelMap[tone]}版本已生成`, icon: 'success' })
    }, 700)
  }

  const handleMark = (msg: ChatMessage) => {
    console.log('[ChatPage] Toggle mark on message:', msg.id)
    setMessages(prev => prev.map(m => {
      if (m.id !== msg.id) return m
      const newMarked = !m.marked
      Taro.showToast({ title: newMarked ? '已标记重点' : '已取消标记', icon: 'success' })
      if (newMarked) {
        return {
          ...m,
          marked: true,
          highlights: [[0, Math.min(10, m.content.length)], [Math.floor(m.content.length / 2), Math.floor(m.content.length / 2) + 12]]
        }
      }
      return { ...m, marked: false, highlights: m.highlights?.slice(0, 0) }
    }))
  }

  const handleQuick = (action: string) => {
    console.log('[ChatPage] Quick action:', action)
    if (action === '改写') {
      const lastAiMsg = [...messages].reverse().find(m => m.role === 'ai' && !m.isVersion)
      if (lastAiMsg) {
        handleRewrite(lastAiMsg)
      } else {
        Taro.showToast({ title: '暂无可改写的回复', icon: 'none' })
      }
    } else if (action === '扩写') {
      Taro.showToast({ title: '扩写功能：内容更详细', icon: 'none' })
    } else if (action === '翻译') {
      Taro.showToast({ title: '翻译功能：中英互译', icon: 'none' })
    }
  }

  const handleMsgAction = (action: string, msg: ChatMessage) => {
    console.log('[ChatPage] Message action:', action, msg.id)
    if (action === 'copy') {
      Taro.setClipboardData({ data: msg.content, success: () => Taro.showToast({ title: '已复制', icon: 'success' }) })
    } else if (action === 'mark') {
      handleMark(msg)
    } else if (action === 'rewrite') {
      handleRewrite(msg)
    }
  }

  const renderContent = (msg: ChatMessage) => {
    if (!msg.highlights || msg.highlights.length === 0) {
      return <Text className={styles.msgText}>{msg.content}</Text>
    }
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    msg.highlights.forEach(([start, end], i) => {
      const s = Math.max(0, Math.min(start, msg.content.length))
      const e = Math.max(s, Math.min(end, msg.content.length))
      if (s > lastIndex) {
        parts.push(<Text key={`t-${i}`}>{msg.content.slice(lastIndex, s)}</Text>)
      }
      if (e > s) {
        parts.push(
          <Text key={`h-${i}`} className={styles.msgHighlight}>
            {msg.content.slice(s, e)}
          </Text>
        )
      }
      lastIndex = e
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
            className={classnames(
              styles.msgItem,
              msg.role === 'user' && styles.msgItemUser,
              msg.isVersion && styles.msgItemVersion
            )}
          >
            <View className={classnames(styles.msgAvatar, msg.isVersion && styles.msgAvatarVersion)}>
              <Text>{msg.role === 'ai' ? (msg.isVersion ? 'V' : 'AI') : '我'}</Text>
            </View>
            <View className={classnames(styles.msgBubble, msg.marked && styles.msgBubbleMarked)}>
              {msg.isVersion && (
                <View style={{ marginBottom: '12rpx', display: 'flex', gap: '8rpx', flexWrap: 'wrap' }}>
                  <Tag text={`${toneLabelMap[msg.tone || tone]}语气`} color="#7c3aed" bgColor="rgba(124, 58, 237, 0.1)" size="sm" />
                  <Tag text="改写版本" color="#2563eb" bgColor="rgba(37, 99, 235, 0.1)" size="sm" />
                </View>
              )}
              {!msg.isVersion && msg.tone && (
                <View style={{ marginBottom: '12rpx' }}>
                  <Tag text={`${toneLabelMap[msg.tone]}语气`} color="#2563eb" bgColor="rgba(37, 99, 235, 0.1)" size="sm" />
                  {msg.marked && (
                    <Tag text="⭐ 重点" color="#f59e0b" bgColor="rgba(245, 158, 11, 0.1)" size="sm" />
                  )}
                </View>
              )}
              {msg.marked && !msg.tone && (
                <View style={{ marginBottom: '12rpx' }}>
                  <Tag text="⭐ 已标记重点" color="#f59e0b" bgColor="rgba(245, 158, 11, 0.1)" size="sm" />
                </View>
              )}
              {renderContent(msg)}
              {msg.role === 'ai' && (
                <View className={styles.msgActions}>
                  <Text className={styles.msgActionBtn} onClick={() => handleMsgAction('copy', msg)}>复制</Text>
                  <Text
                    className={classnames(styles.msgActionBtn, rewritingId === msg.id && styles.msgActionBtnActive)}
                    onClick={() => handleMsgAction('rewrite', msg)}
                  >
                    {rewritingId === msg.id ? '生成中...' : '改写'}
                  </Text>
                  <Text
                    className={classnames(styles.msgActionBtn, msg.marked && styles.msgActionBtnActive)}
                    onClick={() => handleMsgAction('mark', msg)}
                  >
                    {msg.marked ? '取消标记' : '标记重点'}
                  </Text>
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
              onClick={() => { setTone(t); console.log('[ChatPage] Tone changed to:', t) }}
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
