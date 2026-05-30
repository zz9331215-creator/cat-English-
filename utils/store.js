const TEXT = require('./texts')
const STORAGE_KEY = 'english_cat_store_v1'

const STAGES = [
  { key: 'baby', name: TEXT.stageBaby, minExp: 0, maxExp: 200, size: 0.55 },
  { key: 'kitten', name: TEXT.stageKitten, minExp: 200, maxExp: 500, size: 0.72 },
  { key: 'teen', name: TEXT.stageTeen, minExp: 500, maxExp: 1000, size: 0.88 },
  { key: 'adult', name: TEXT.stageAdult, minExp: 1000, maxExp: 2000, size: 1 },
  { key: 'chubby', name: TEXT.stageChubby, minExp: 2000, maxExp: 99999, size: 1.28 }
]

const DEFAULT_STORE = {
  user: {
    nickname: TEXT.userNickname,
    avatar: '',
    streak: 0,
    totalStudyMinutes: 0
  },
  pet: {
    name: TEXT.petName,
    stage: 'baby',
    exp: 0,
    maxExp: 200,
    satiety: 80,
    maxSatiety: 100,
    lastFeedTime: Date.now(),
    mood: 'happy',
    size: 0.55
  },
  currency: { catStrips: 0 },
  stats: {
    focusCount: 0,
    wordsLearned: 0,
    speakingMinutes: 0,
    feedCount: 0,
    dailyRecords: {}
  },
  tasks: {
    today: '',
    items: []
  },
  settings: {
    dailyWordGoal: 20,
    dailySpeakingGoal: 10,
    focusDuration: 25
  }
}

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

function syncPetGrowth(pet) {
  const stage = getStageByExp(pet.exp || 0)
  pet.stage = stage.key
  pet.size = stage.size
  pet.maxExp = stage.maxExp
  return stage
}

function buildDefaultTasks(settings) {
  return [
    {
      id: 'w1',
      type: 'words',
      title: `${TEXT.taskWords} ${settings.dailyWordGoal} ${TEXT.taskWordsUnit}`,
      target: settings.dailyWordGoal,
      current: 0,
      done: false
    },
    {
      id: 's1',
      type: 'speaking',
      title: `${TEXT.taskSpeaking} ${settings.dailySpeakingGoal} ${TEXT.taskMinutes}`,
      target: settings.dailySpeakingGoal,
      current: 0,
      done: false
    }
  ]
}

function initStore() {
  const today = getTodayKey()
  let existing = wx.getStorageSync(STORAGE_KEY)

  if (!existing) {
    const store = JSON.parse(JSON.stringify(DEFAULT_STORE))
    store.tasks.today = today
    store.tasks.items = buildDefaultTasks(store.settings)
    wx.setStorageSync(STORAGE_KEY, store)
    return store
  }

  if (existing.tasks.today !== today) {
    existing.tasks = {
      today,
      items: buildDefaultTasks(existing.settings)
    }
  }

  syncPetGrowth(existing.pet)
  wx.setStorageSync(STORAGE_KEY, existing)
  return existing
}

function getStore() {
  const store = wx.getStorageSync(STORAGE_KEY)
  if (!store) return initStore()
  syncPetGrowth(store.pet)
  return store
}

function saveStore(store) {
  syncPetGrowth(store.pet)
  wx.setStorageSync(STORAGE_KEY, store)
  const app = getApp()
  if (app) {
    app.globalData.store = store
    app.globalData.pet = store.pet
  }
  return store
}

function addCatStrips(amount) {
  const store = getStore()
  store.currency.catStrips += amount
  saveStore(store)
  return store.currency.catStrips
}

function feedPet(stripsCost = 1) {
  const store = getStore()
  if (store.currency.catStrips < stripsCost) {
    return { success: false, message: TEXT.stripsNotEnough }
  }

  store.currency.catStrips -= stripsCost
  const expGain = stripsCost * 20
  store.pet.exp += expGain
  store.pet.satiety = Math.min(store.pet.maxSatiety, store.pet.satiety + stripsCost * 12)
  store.pet.lastFeedTime = Date.now()
  store.pet.mood = 'eating'

  const stage = syncPetGrowth(store.pet)
  store.stats.feedCount += 1
  saveStore(store)

  return {
    success: true,
    expGain,
    stage: stage.name,
    stageKey: stage.key,
    satiety: store.pet.satiety
  }
}

function completeLearning(type, amount) {
  const store = getStore()
  const reward = type === 'words' ? Math.ceil(amount / 5) : Math.ceil(amount / 2)
  const stripsReward = Math.max(1, reward)
  const expGain = stripsReward * 12

  store.currency.catStrips += stripsReward
  store.pet.exp += expGain
  syncPetGrowth(store.pet)

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
  return { stripsReward, expGain, store }
}

function decaySatiety() {
  const store = getStore()
  const hoursSinceFeed = (Date.now() - (store.pet.lastFeedTime || Date.now())) / 3600000
  if (hoursSinceFeed > 2) {
    store.pet.satiety = Math.max(0, store.pet.satiety - Math.floor(hoursSinceFeed))
    if (store.pet.satiety < 30) store.pet.mood = 'hungry'
    else if (store.pet.satiety >= 85) store.pet.mood = 'happy'
    else store.pet.mood = 'normal'
    saveStore(store)
  }
  return store.pet
}

function getPetAction(pet, override) {
  if (override === 'eating') return 'eating'
  if (override === 'lying' || override === 'lie') return 'lying'
  if (override === 'studying') return 'studying'
  if (pet.mood === 'eating') return 'eating'
  if (pet.mood === 'hungry' || pet.satiety < 30) return 'hungry'
  if (pet.satiety >= 85) return 'full'
  if (pet.satiety >= 70) return 'lying'
  return 'idle'
}

function getPetSpeech(pet) {
  const speeches = {
    hungry: [
      '\u5440\u5440~\u997f\u6655\u4e86\uff0c\u9700\u8981\u7f50\u5934\u505a\u4eba\u5de5\u547c\u5438\uff01',
      '\u55b5\u2026\u2026\u518d\u4e0d\u5582\u996d\u5c31\u8981\u53d8\u732b\u7247\u4e86\u2026\u2026',
      '\u809a\u5b50\u5495\u5495\u53eb\uff0c\u5feb\u53bb\u4e13\u6ce8\u5b66\u4e60\u8d5a\u732b\u6761\u5427\uff01'
    ],
    normal: [
      '\u4eca\u5929\u4e5f\u8981\u52a0\u6cb9\u5b66\u82f1\u8bed\u54e6\uff01',
      '\u55b5~ \u966a\u4f60\u4e00\u8d77\u8fdb\u6b65\uff01',
      '\u80cc\u5b8c\u5355\u8bcd\u8bb0\u5f97\u6765\u5582\u6211\u54e6'
    ],
    happy: [
      '\u5403\u9971\u4e86\uff0c\u8db4\u4e00\u4f1a\u513f\u6700\u8212\u670d~',
      '\u55b5\u55b5\u4eca\u5929\u8d85\u5f00\u5fc3\uff01',
      '\u6316\u5c51\u5b98\u6700\u68d2\uff01\u55b5~'
    ],
    eating: [
      '\u597d\u5403\u597d\u5403\uff01\u55b5\u545C~',
      '\u8c22\u8c22\u6316\u5c51\u5b98\u7684\u732b\u6761\uff01',
      '\u56bc\u56bc\u56bc\u2026\u2026\u592a\u9999\u4e86\uff01'
    ]
  }
  const list = speeches[pet.mood] || speeches.normal
  return list[Math.floor(Math.random() * list.length)]
}

module.exports = {
  STORAGE_KEY,
  STAGES,
  TEXT,
  getTodayKey,
  getStageByExp,
  syncPetGrowth,
  initStore,
  getStore,
  saveStore,
  addCatStrips,
  feedPet,
  completeLearning,
  decaySatiety,
  getPetAction,
  getPetSpeech
}
