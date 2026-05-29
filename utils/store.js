const STORAGE_KEY = 'english_cat_store_v1'

const DEFAULT_STORE = {
  user: {
    nickname: '学英语的铲屎官',
    avatar: '',
    streak: 0,
    totalStudyMinutes: 0
  },
  pet: {
    name: '咪咪',
    stage: 'kitten',
    exp: 0,
    maxExp: 1000,
    satiety: 80,
    maxSatiety: 100,
    lastFeedTime: 0,
    mood: 'happy',
    size: 1
  },
  currency: {
    catStrips: 0
  },
  stats: {
    focusCount: 0,
    wordsLearned: 0,
    speakingMinutes: 0,
    feedCount: 0,
    dailyRecords: {}
  },
  tasks: {
    today: getTodayKey(),
    items: [
      { id: 'w1', type: 'words', title: '背诵 20 个单词', target: 20, current: 0, done: false },
      { id: 's1', type: 'speaking', title: '口语练习 10 分钟', target: 10, current: 0, done: false }
    ]
  },
  settings: {
    dailyWordGoal: 20,
    dailySpeakingGoal: 10,
    focusDuration: 25
  }
}

const STAGES = [
  { key: 'baby', name: '奶猫期', minExp: 0, maxExp: 200, size: 0.65 },
  { key: 'kitten', name: '幼猫期', minExp: 200, maxExp: 500, size: 0.8 },
  { key: 'teen', name: '少年猫', minExp: 500, maxExp: 1000, size: 1 },
  { key: 'adult', name: '成猫期', minExp: 1000, maxExp: 2000, size: 1.15 },
  { key: 'chubby', name: '大肥猫', minExp: 2000, maxExp: 99999, size: 1.3 }
]

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getStageByExp(exp) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (exp >= STAGES[i].minExp) return STAGES[i]
  }
  return STAGES[0]
}

function initStore() {
  const existing = wx.getStorageSync(STORAGE_KEY)
  if (!existing) {
    wx.setStorageSync(STORAGE_KEY, DEFAULT_STORE)
    return DEFAULT_STORE
  }

  const today = getTodayKey()
  if (existing.tasks.today !== today) {
    existing.tasks = {
      today,
      items: [
        { id: 'w1', type: 'words', title: `背诵 ${existing.settings.dailyWordGoal} 个单词`, target: existing.settings.dailyWordGoal, current: 0, done: false },
        { id: 's1', type: 'speaking', title: `口语练习 ${existing.settings.dailySpeakingGoal} 分钟`, target: existing.settings.dailySpeakingGoal, current: 0, done: false }
      ]
    }
  }

  wx.setStorageSync(STORAGE_KEY, existing)
  return existing
}

function getStore() {
  return wx.getStorageSync(STORAGE_KEY) || initStore()
}

function saveStore(store) {
  wx.setStorageSync(STORAGE_KEY, store)
  const app = getApp()
  if (app) {
    app.globalData.store = store
    app.globalData.pet = store.pet
  }
  return store
}

function addCatStrips(amount, reason) {
  const store = getStore()
  store.currency.catStrips += amount
  saveStore(store)
  return { amount, reason, total: store.currency.catStrips }
}

function feedPet(stripsCost = 1) {
  const store = getStore()
  if (store.currency.catStrips < stripsCost) {
    return { success: false, message: '猫条不够啦，快去学习赚取吧！' }
  }

  store.currency.catStrips -= stripsCost
  const expGain = stripsCost * 15
  store.pet.exp += expGain
  store.pet.satiety = Math.min(store.pet.maxSatiety, store.pet.satiety + stripsCost * 10)
  store.pet.lastFeedTime = Date.now()
  store.pet.mood = 'eating'

  const stage = getStageByExp(store.pet.exp)
  store.pet.stage = stage.key
  store.pet.size = stage.size
  store.pet.maxExp = stage.maxExp
  store.stats.feedCount += 1

  saveStore(store)
  return { success: true, expGain, stage: stage.name, satiety: store.pet.satiety }
}

function completeLearning(type, amount) {
  const store = getStore()
  const reward = type === 'words' ? Math.ceil(amount / 5) : Math.ceil(amount / 2)
  const stripsReward = Math.max(1, reward)

  store.currency.catStrips += stripsReward

  if (type === 'words') {
    store.stats.wordsLearned += amount
    const task = store.tasks.items.find(t => t.type === 'words')
    if (task) {
      task.current = Math.min(task.target, task.current + amount)
      if (task.current >= task.target) task.done = true
    }
  } else if (type === 'speaking') {
    store.stats.speakingMinutes += amount
    store.user.totalStudyMinutes += amount
    const task = store.tasks.items.find(t => t.type === 'speaking')
    if (task) {
      task.current = Math.min(task.target, task.current + amount)
      if (task.current >= task.target) task.done = true
    }
  } else if (type === 'focus') {
    store.stats.focusCount += 1
    store.user.totalStudyMinutes += amount
  }

  const today = getTodayKey()
  if (!store.stats.dailyRecords[today]) {
    store.stats.dailyRecords[today] = { minutes: 0, words: 0, strips: 0 }
  }
  store.stats.dailyRecords[today].minutes += type === 'words' ? 0 : amount
  store.stats.dailyRecords[today].words += type === 'words' ? amount : 0
  store.stats.dailyRecords[today].strips += stripsReward

  saveStore(store)
  return { stripsReward, store }
}

function decaySatiety() {
  const store = getStore()
  const hoursSinceFeed = (Date.now() - (store.pet.lastFeedTime || Date.now())) / 3600000
  if (hoursSinceFeed > 2) {
    store.pet.satiety = Math.max(0, store.pet.satiety - Math.floor(hoursSinceFeed))
    if (store.pet.satiety < 30) store.pet.mood = 'hungry'
    else if (store.pet.satiety < 60) store.pet.mood = 'normal'
    else store.pet.mood = 'happy'
    saveStore(store)
  }
  return store.pet
}

function getPetSpeech(pet) {
  const speeches = {
    hungry: ['……再不给饭，本喵就要……就要变成猫片了……', '喵~ 肚子好饿，快去背单词赚猫条！', '铲屎官，咪咪需要小鱼干~'],
    normal: ['今天也要加油学英语哦！', '喵~ 陪你一起进步！', '背完单词记得来喂我~'],
    happy: ['咪咪今天超开心！', '铲屎官最棒了！喵~', '学英语的样子真帅气！'],
    eating: ['好吃好吃！喵呜~', '谢谢铲屎官的猫条！', '唔唔唔……太香了！']
  }
  const list = speeches[pet.mood] || speeches.normal
  return list[Math.floor(Math.random() * list.length)]
}

module.exports = {
  STORAGE_KEY,
  STAGES,
  getTodayKey,
  getStageByExp,
  initStore,
  getStore,
  saveStore,
  addCatStrips,
  feedPet,
  completeLearning,
  decaySatiety,
  getPetSpeech
}
