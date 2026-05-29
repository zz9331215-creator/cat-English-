const PRONUNCIATION = {
  us: (word) => `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`,
  uk: (word) => `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`
}

let audioCtx = null

function destroyAudio() {
  if (audioCtx) {
    audioCtx.stop()
    audioCtx.destroy()
    audioCtx = null
  }
}

function playFromUrl(url) {
  return new Promise((resolve, reject) => {
    destroyAudio()
    audioCtx = wx.createInnerAudioContext()
    audioCtx.obeyMuteSwitch = false
    audioCtx.src = url
    audioCtx.onEnded(() => {
      destroyAudio()
      resolve()
    })
    audioCtx.onError((err) => {
      destroyAudio()
      reject(err)
    })
    audioCtx.play()
  })
}

function fetchDictionaryAudio(word) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      method: 'GET',
      success(res) {
        if (res.statusCode !== 200 || !res.data || !res.data.length) {
          reject(new Error('词典未找到该单词'))
          return
        }
        const entry = res.data[0]
        const phonetics = entry.phonetics || []
        const audioItem = phonetics.find((p) => p.audio) || {}
        if (!audioItem.audio) {
          reject(new Error('暂无发音资源'))
          return
        }
        resolve({
          audio: audioItem.audio,
          phonetic: audioItem.text || entry.phonetic || '',
          meaning: entry.meanings && entry.meanings[0]
            ? entry.meanings[0].definitions[0].definition
            : ''
        })
      },
      fail: reject
    })
  })
}

function playWord(word, accent = 'us') {
  const url = PRONUNCIATION[accent] ? PRONUNCIATION[accent](word) : PRONUNCIATION.us(word)
  return playFromUrl(url).catch(() => {
    return fetchDictionaryAudio(word).then((data) => playFromUrl(data.audio))
  })
}

function enrichWord(wordItem) {
  return fetchDictionaryAudio(wordItem.word)
    .then((data) => ({
      ...wordItem,
      phonetic: data.phonetic || wordItem.phonetic,
      audio: data.audio
    }))
    .catch(() => wordItem)
}

module.exports = {
  playWord,
  playFromUrl,
  fetchDictionaryAudio,
  enrichWord,
  destroyAudio
}
