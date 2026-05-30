const TEXT = require('./texts')

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return TEXT.format(TEXT.durationMinutes, { n: minutes })
  }
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0
    ? TEXT.format(TEXT.durationHours, { h, m })
    : TEXT.format(TEXT.durationHoursOnly, { h })
}

function getWeekDates() {
  const today = new Date()
  const day = today.getDay()
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - day + i)
    dates.push({
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
  }
  return dates
}

function getProgressPercent(current, total) {
  if (!total) return 0
  return Math.min(100, Math.round((current / total) * 100))
}

module.exports = {
  formatTime,
  formatDuration,
  getWeekDates,
  getProgressPercent
}
