const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'node_modules', 'lottie-miniprogram', 'miniprogram_dist')
const dest = path.join(root, 'miniprogram_npm', 'lottie-miniprogram')

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const name of fs.readdirSync(from)) {
    const srcPath = path.join(from, name)
    const destPath = path.join(to, name)
    if (fs.statSync(srcPath).isDirectory()) copyDir(srcPath, destPath)
    else fs.copyFileSync(srcPath, destPath)
  }
}

if (!fs.existsSync(src)) {
  console.error('请先运行 npm install')
  process.exit(1)
}

if (fs.existsSync(path.join(root, 'miniprogram_npm'))) {
  fs.rmSync(path.join(root, 'miniprogram_npm'), { recursive: true, force: true })
}

copyDir(src, dest)
console.log('miniprogram_npm 构建完成:', dest)
