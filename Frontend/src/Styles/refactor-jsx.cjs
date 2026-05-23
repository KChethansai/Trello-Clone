const fs = require('fs')
const path = require('path')

const targetDir = 'C:\\College Work\\ATP\\Temp\\frontend\\src'

const themeColors = {
  'text-main': '#1d1d1f',
  'text-muted': '#6e6e73',
  'border-main': '#d2d2d7',
  'text-light': '#a1a1a6',
  primary: '#0066cc',
  'primary-hover': '#0055b3',
  'bg-card': '#f5f5f7',
  'bg-card-hover': '#ebebf0',
  'border-light': '#e5e5ea',
  'border-lighter': '#f2f2f7',
  'bg-alt': '#f9f9f9',
  'dash-bg': '#1d2125',
  'dash-card-bg': '#2c333a',
  'dash-btn-hover': '#353d47',
  'dash-text-main': '#b6c2cf',
  'dash-text-dark': '#9fadbc',
  'dash-text-btn': '#454f59',
  'dash-accent': '#579dff',
  'dash-accent-hover': '#85b8ff',
  'board-bg-2': '#101204',
  'bg-white': '#ffffff',
  'dash-nav-hover': '#22272b',
  'dash-card-hover': '#323940',
  'status-in-progress': '#38bdf8',
  'dash-nav-bg': '#102033',
  'status-todo': '#fcd34d',
  'board-bg-1': '#32230d',
  'status-done': '#6ee7b7',
  'board-bg-3': '#0e2a1d'
}

const hexToVar = {}
for (const [key, hex] of Object.entries(themeColors)) {
  hexToVar[hex] = 'var(--' + key + ')'
}

function processDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath)
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let changed = false
      for (const [hex, cssVar] of Object.entries(hexToVar)) {
        if (content.includes(hex) || content.includes(hex.toUpperCase())) {
          content = content.replaceAll(hex, cssVar)
          content = content.replaceAll(hex.toUpperCase(), cssVar)
          changed = true
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8')
      }
    }
  }
}

processDir(targetDir)
console.log('All JSX files refactored')
