// smoke script: validates deployment-critical backend files exist.
import { existsSync } from 'node:fs'

const requiredFiles = [
  'server.js',
  'config/env.js',
  'config/security.js',
  'APIs/ProjectsAPI.js',
  'APIs/UserAPI.js',
  'middlewares/errormiddleware.js'
]

const missing = requiredFiles.filter((file) => !existsSync(file))

if (missing.length > 0) {
  throw new Error(`Missing backend files: ${missing.join(', ')}`)
}

process.stdout.write('Backend smoke checks passed\n')
