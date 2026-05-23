// logger utility: writes structured server logs without debug console calls.
const write = (level, message, meta = '') => {
  const details = meta ? ` ${meta}` : ''
  process[level === 'error' ? 'stderr' : 'stdout'].write(
    `[${level}] ${message}${details}\n`
  )
}

export const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta)
}
