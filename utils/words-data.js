const WORD_LIST = [
  { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果', example: 'I eat an apple every day.' },
  { word: 'beautiful', phonetic: '/ˈbjuːtɪfl/', meaning: '美丽的', example: 'What a beautiful day!' },
  { word: 'challenge', phonetic: '/ˈtʃælɪndʒ/', meaning: '挑战', example: 'Learning English is a fun challenge.' },
  { word: 'delicious', phonetic: '/dɪˈlɪʃəs/', meaning: '美味的', example: 'This cake is delicious.' },
  { word: 'energy', phonetic: '/ˈenədʒi/', meaning: '能量', example: 'Exercise gives me energy.' },
  { word: 'friend', phonetic: '/frend/', meaning: '朋友', example: 'She is my best friend.' },
  { word: 'grateful', phonetic: '/ˈɡreɪtfl/', meaning: '感激的', example: 'I am grateful for your help.' },
  { word: 'happiness', phonetic: '/ˈhæpinəs/', meaning: '幸福', example: 'Happiness comes from within.' },
  { word: 'imagine', phonetic: '/ɪˈmædʒɪn/', meaning: '想象', example: 'Can you imagine living abroad?' },
  { word: 'journey', phonetic: '/ˈdʒɜːni/', meaning: '旅程', example: 'Life is a wonderful journey.' },
  { word: 'knowledge', phonetic: '/ˈnɒlɪdʒ/', meaning: '知识', example: 'Knowledge is power.' },
  { word: 'language', phonetic: '/ˈlæŋɡwɪdʒ/', meaning: '语言', example: 'English is a global language.' },
  { word: 'motivate', phonetic: '/ˈməʊtɪveɪt/', meaning: '激励', example: 'Good teachers motivate students.' },
  { word: 'nature', phonetic: '/ˈneɪtʃə/', meaning: '自然', example: 'I love spending time in nature.' },
  { word: 'opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', meaning: '机会', example: 'This is a great opportunity.' },
  { word: 'practice', phonetic: '/ˈpræktɪs/', meaning: '练习', example: 'Practice makes perfect.' },
  { word: 'quality', phonetic: '/ˈkwɒləti/', meaning: '质量', example: 'Quality over quantity.' },
  { word: 'remember', phonetic: '/rɪˈmembə/', meaning: '记住', example: 'Remember to review your words.' },
  { word: 'success', phonetic: '/səkˈses/', meaning: '成功', example: 'Hard work leads to success.' },
  { word: 'tomorrow', phonetic: '/təˈmɒrəʊ/', meaning: '明天', example: 'See you tomorrow!' },
  { word: 'understand', phonetic: '/ˌʌndəˈstænd/', meaning: '理解', example: 'Do you understand the lesson?' },
  { word: 'victory', phonetic: '/ˈvɪktəri/', meaning: '胜利', example: 'We celebrated our victory.' },
  { word: 'wonderful', phonetic: '/ˈwʌndəfl/', meaning: '精彩的', example: 'You did a wonderful job!' },
  { word: 'excellent', phonetic: '/ˈeksələnt/', meaning: '优秀的', example: 'Your pronunciation is excellent.' },
  { word: 'confidence', phonetic: '/ˈkɒnfɪdəns/', meaning: '自信', example: 'Speaking builds confidence.' },
  { word: 'creative', phonetic: '/kriˈeɪtɪv/', meaning: '有创造力的', example: 'Be creative with your sentences.' },
  { word: 'determined', phonetic: '/dɪˈtɜːmɪnd/', meaning: '坚定的', example: 'Stay determined and keep going.' },
  { word: 'efficient', phonetic: '/ɪˈfɪʃnt/', meaning: '高效的', example: 'This method is very efficient.' },
  { word: 'fluent', phonetic: '/ˈfluːənt/', meaning: '流利的', example: 'She speaks fluent English.' },
  { word: 'gratitude', phonetic: '/ˈɡrætɪtjuːd/', meaning: '感恩', example: 'Express your gratitude daily.' }
]

const SPEAKING_TOPICS = [
  { id: 1, title: '自我介绍', prompt: 'Please introduce yourself in English.', hint: 'Name, age, hobbies, hometown' },
  { id: 2, title: '描述今天', prompt: 'Describe what you did today.', hint: 'Use past tense verbs' },
  { id: 3, title: '最喜欢的食物', prompt: 'Talk about your favorite food.', hint: 'Why do you like it?' },
  { id: 4, title: '旅行经历', prompt: 'Describe a place you have visited.', hint: 'Location, scenery, feelings' },
  { id: 5, title: '学习英语', prompt: 'Why are you learning English?', hint: 'Goals and motivation' },
  { id: 6, title: '未来计划', prompt: 'What are your plans for the future?', hint: 'Career, travel, dreams' },
  { id: 7, title: '宠物话题', prompt: 'Do you like pets? Tell me about them.', hint: 'Cats, dogs, personal stories' },
  { id: 8, title: '天气话题', prompt: 'Describe the weather today.', hint: 'Temperature, season, activities' }
]

function getDailyWords(count = 20) {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, WORD_LIST.length))
}

function getRandomTopic() {
  return SPEAKING_TOPICS[Math.floor(Math.random() * SPEAKING_TOPICS.length)]
}

module.exports = {
  WORD_LIST,
  SPEAKING_TOPICS,
  getDailyWords,
  getRandomTopic
}
