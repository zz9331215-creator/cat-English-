const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')

const project = path.resolve(__dirname, '..')

function findWechatDir() {
  const root = 'D:\\Tencent'
  if (!fs.existsSync(root)) return null
  for (const name of fs.readdirSync(root)) {
    const full = path.join(root, name)
    if (fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'cli.bat'))) {
      return full
    }
  }
  return null
}

const dir = findWechatDir()
if (!dir) {
  console.error('WeChat DevTools not found under D:\\Tencent')
  process.exit(1)
}

const cli = path.join(dir, 'cli.bat')
const exes = fs.readdirSync(dir).filter((f) => f.endsWith('.exe'))
const launcher =
  exes.find((f) => f.includes('\u5f00\u53d1\u8005\u5de5\u5177') && !f.includes('\u5378\u8f7d')) ||
  exes.find((f) => f === 'wechatdevtools.exe') ||
  exes.sort((a, b) => fs.statSync(path.join(dir, b)).size - fs.statSync(path.join(dir, a)).size)[0]

const exe = path.join(dir, launcher)
console.log('Project:', project)
console.log('Launch:', exe)

try {
  spawn(exe, [], { detached: true, stdio: 'ignore', windowsHide: false }).unref()
} catch (e) {
  console.error('Launch failed:', e.message)
}

const ideRel = path.join(
  process.env.LOCALAPPDATA,
  '\u5fae\u4fe1\u5f00\u53d1\u8005\u5de5\u5177',
  'User Data',
  '8bd760e6f7c30cca133c1a584f36db58',
  'Default',
  '.ide'
)

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

;(async () => {
  for (let i = 0; i < 60; i++) {
    if (fs.existsSync(ideRel)) {
      console.log('IDE port ready')
      break
    }
    if (i % 5 === 4) console.log(`waiting... ${(i + 1) * 2}s`)
    await sleep(2000)
  }

  try {
    const out = execSync(`"${cli}" --lang zh open --project "${project}"`, {
      encoding: 'utf8',
      timeout: 90000,
      input: 'y\n'
    })
    console.log(out || 'Project opened via CLI')
  } catch (e) {
    const msg = (e.stdout || '') + (e.stderr || e.message)
    console.error(msg)
    console.error('\nIf CLI failed: open WeChat DevTools manually, then')
    console.error('Settings -> Security -> Enable service port, then run: npm run open')
    process.exit(1)
  }
})()
