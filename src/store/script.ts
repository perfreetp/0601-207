import { create } from 'zustand'
import type { Script, ScriptScene, ScriptTone } from '@/types/script'
import { mockScripts } from '@/data/script'
import { saveToStorage, loadFromStorage } from '@/utils/persist'

interface ScriptState {
  scripts: Script[]
  addScript: (script: Omit<Script, 'id' | 'createdAt' | 'usageCount' | 'isFavorite'>) => void
  toggleFavorite: (id: string) => void
  updateScript: (id: string, data: Partial<Script>) => void
  generateScripts: (scene: ScriptScene, context: string) => Script[]
}

const generateContent = (scene: ScriptScene, tone: ScriptTone, context: string): { title: string; content: string; tags: string[] } => {
  const ctx = context || '通用场景'
  const sceneTemplates: Record<ScriptScene, Record<ScriptTone, { title: string; content: string; tags: string[] }>> = {
    opening: {
      professional: { title: `专业开场 - ${ctx.slice(0, 10)}`, content: `您好，欢迎光临！我是您的专属顾问。根据您提到的${ctx}，这边正好有几款非常适合的产品，方便我为您详细介绍一下吗？专业的建议可以帮您节省挑选时间。`, tags: ['专业', '开场', ctx.slice(0, 6)] },
      friendly: { title: `友好破冰 - ${ctx.slice(0, 10)}`, content: `哈喽~欢迎呀！看您在看${ctx}相关的产品，我来帮您介绍下吧，放心，不买也没关系，多了解对比总是好的嘛~`, tags: ['友好', '破冰', '无压力'] },
      warm: { title: `亲切问候 - ${ctx.slice(0, 10)}`, content: `您好呀，今天天气不错呢~您是想看${ctx}相关的产品是吗？我在这行做了好几年了，可以帮您参谋参谋，选到真正适合您的~`, tags: ['亲切', '拉近距离', '经验'] },
      concise: { title: `简洁开场 - ${ctx.slice(0, 10)}`, content: `您好！关于${ctx}，推荐两款最受欢迎的，5分钟帮您搞定，想看吗？`, tags: ['简洁', '高效', '直接'] }
    },
    objection: {
      professional: { title: `专业异议处理 - ${ctx.slice(0, 10)}`, content: `您关于${ctx}的顾虑非常专业。其实从行业数据来看，我们的产品经过了30000+用户验证，核心优势在于材质和工艺的高标准。这样吧，我给您看一份第三方检测报告，数据会更有说服力。`, tags: ['专业', '数据支撑', '消除顾虑'] },
      friendly: { title: `友好异议处理 - ${ctx.slice(0, 10)}`, content: `嗯嗯，我特别理解您对${ctx}的担心~很多客户一开始也有同样想法。后来实际体验了之后都说真香！要不您先亲自感受下，好不好用您说了算~`, tags: ['共情', '体验式', '打消顾虑'] },
      warm: { title: `亲切异议处理 - ${ctx.slice(0, 10)}`, content: `哎呀您说的${ctx}这个问题真是问到点子上了！换作是我也会特别在意。不过您放心，我们的售后是全行业最贴心的，有任何问题一个电话马上上门处理~`, tags: ['站在客户角度', '售后保障', '安心'] },
      concise: { title: `简洁异议处理 - ${ctx.slice(0, 10)}`, content: `${ctx}？三点解决：1. 10年质保 2. 30天无理由退换 3. 免费上门服务。还有什么担心的？`, tags: ['简洁', '三点法', '果断'] }
    },
    closing: {
      professional: { title: `专业促单 - ${ctx.slice(0, 10)}`, content: `综合您对${ctx}的需求，这款确实是最优选。本月活动还剩最后2天，今天定的话能额外省约2000元，还送599元配套服务。我帮您确认一下送货地址？`, tags: ['限时', '算账', '专业逼单'] },
      friendly: { title: `友好促单 - ${ctx.slice(0, 10)}`, content: `哈哈我真心觉得这款太适合您对${ctx}的要求了！您看要不今天先定下来，我帮您排个最早的送货时间，早买早享受嘛~`, tags: ['真诚', '早买早享受', '柔性促单'] },
      warm: { title: `亲切促单 - ${ctx.slice(0, 10)}`, content: `说句实在话，您关注的${ctx}这款，今天不订明天可能就被别人订走了，上周就有个客户犹豫一天结果没货了。我先帮您锁单？`, tags: ['稀缺', '真诚', '朋友式推荐'] },
      concise: { title: `简洁促单 - ${ctx.slice(0, 10)}`, content: `${ctx}，就这款。今天下单立省2000，送599服务，现在定吗？`, tags: ['简洁', '直接', '高效'] }
    },
    followup: {
      professional: { title: `专业回访 - ${ctx.slice(0, 10)}`, content: `X先生/女士您好，我是XX店的顾问小X。上次您关于${ctx}咨询的那款产品，想了解下您和家人商量得怎么样了？这边有几个新的优惠方案，可以给您同步一下。`, tags: ['专业', '回访', '新优惠'] },
      friendly: { title: `友好回访 - ${ctx.slice(0, 10)}`, content: `X姐/哥~还记不记得上次咱们聊的${ctx}那款呀？我这两天又想到两个适合您的搭配方案，想分享给您参考参考~`, tags: ['友好', '分享', '保持联系'] },
      warm: { title: `亲切回访 - ${ctx.slice(0, 10)}`, content: `X姐/哥您好呀~我是小X！上次和您聊得特别开心，一直记着您对${ctx}的需求，刚好店里新到了一批货，第一时间就想到告诉您啦~`, tags: ['亲切', '重视', '专属感'] },
      concise: { title: `简洁回访 - ${ctx.slice(0, 10)}`, content: `您好，关于上次的${ctx}，现在有个额外优惠，感兴趣的话今天回复我即可。`, tags: ['简洁', '短信式', '不打扰'] }
    }
  }
  return sceneTemplates[scene][tone]
}

export const useScriptStore = create<ScriptState>((set, get) => {
  const persisted = loadFromStorage<Script[]>('scripts', mockScripts)
  console.log('[ScriptStore] Loaded scripts from storage:', persisted.length)

  const persist = () => saveToStorage('scripts', get().scripts)

  return {
    scripts: persisted,

    addScript: (data) => {
      const newScript: Script = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
        isFavorite: false
      }
      console.log('[ScriptStore] Add new script:', newScript.id)
      set({ scripts: [newScript, ...get().scripts] })
      persist()
    },

    toggleFavorite: (id) => {
      const target = get().scripts.find(s => s.id === id)
      console.log('[ScriptStore] Toggle favorite:', id, target?.isFavorite, '->', !target?.isFavorite)
      set({
        scripts: get().scripts.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)
      })
      persist()
      try {
        const { useStatsStore } = require('./stats')
        useStatsStore.getState().recordFavorite(!target?.isFavorite)
      } catch {}
    },

    updateScript: (id, data) => {
      console.log('[ScriptStore] Update script:', id, data)
      set({
        scripts: get().scripts.map(s => s.id === id ? { ...s, ...data } : s)
      })
      persist()
    },

    generateScripts: (scene, context) => {
      const tones: ScriptTone[] = ['professional', 'friendly', 'warm', 'concise']
      const now = new Date()
      const newScripts: Script[] = tones.map((tone, i) => {
        const generated = generateContent(scene, tone, context || '通用场景')
        return {
          id: `${Date.now()}-${i}`,
          scene,
          tone,
          title: generated.title,
          content: generated.content,
          tags: generated.tags,
          isFavorite: false,
          usageCount: 0,
          createdAt: now.toISOString().split('T')[0]
        }
      })
      console.log('[ScriptStore] Generated', newScripts.length, 'new scripts')
      set({ scripts: [...newScripts, ...get().scripts] })
      persist()
      try {
        const { useStatsStore } = require('./stats')
        newScripts.forEach(() => useStatsStore.getState().recordScriptGenerated())
      } catch {}
      return newScripts
    }
  }
})
