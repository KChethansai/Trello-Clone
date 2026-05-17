// server entrypoint: configures middleware, routes, database, and HTTP startup.
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { createServer } from 'http'

import { init as initSocket } from './socket.js'
import { env } from './config/env.js'
import { rejectUnsafePayload, securityMiddleware } from './config/security.js'
import { logger } from './utils/logger.js'

// API routers
import { Userapp } from './APIs/UserAPI.js'
import { oauthApp } from './APIs/OAuthAPI.js'
import { projectsApp } from './APIs/ProjectsAPI.js'
import { workspaceApp } from './APIs/WorkspaceAPI.js'
import { commentApp } from './APIs/commentAPI.js'
import { templeteApp } from './APIs/templateAPI.js'
import { projectApp } from './APIs/ProjectManagerAPI.js'
import { commonTaskApp } from './APIs/CommonTasksAPI.js'
import { notificationApp } from './APIs/NotificationsAPI.js'

// Middleware
import { errorHandler } from './middlewares/errormiddleware.js'

const app = express()
const httpServer = createServer(app)

// Socket.io
initSocket(httpServer)

// Global middleware
app.set('trust proxy', 1)
app.use(securityMiddleware)
app.use(
  cors({
    origin: env.clientUrls,
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(rejectUnsafePayload)

// Routes
app.get('/auth', (req, res) => {
  const invite = req.query.invite
  const frontendUrl = env.clientUrls[0] || 'http://localhost:5173'
  const targetUrl = invite ? `${frontendUrl}/auth?invite=${invite}` : `${frontendUrl}/login`
  
  res.send(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #1d2125; color: white; margin: 0;">
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <p style="margin-bottom: 20px; font-size: 1.1rem; opacity: 0.8;">You have been invited!</p>
          <a href="${targetUrl}" style="display: inline-block; padding: 12px 24px; color: white; background: #0052cc; border-radius: 5px; text-decoration: none; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#0040a3'" onmouseout="this.style.background='#0052cc'">Click here to join the Workspace</a>
        </div>
      </body>
    </html>
  `)
})

app.use('/auth', Userapp)
app.use('/oauth', oauthApp)
app.use('/projects-api', projectsApp)
app.use('/boards-api', projectsApp) // backward compatibility alias
app.use('/api', workspaceApp)
app.use('/api', commentApp)
app.use('/api', projectApp)
app.use('/api', commonTaskApp)
app.use('/notifications', notificationApp)
app.use('/api/templates', templeteApp)

// Health check
app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    time: new Date()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.url} not found`
  })
})

// Error handler
app.use(errorHandler)

// Start server
const start = async () => {
  try {
    await mongoose.connect(env.dbUrl)
    logger.info('MongoDB connected')

    httpServer.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`)
    })

    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${env.port} is in use. Is another instance already running?`)
        process.exit(1)
      } else {
        throw err
      }
    })

  } catch (err) {
    logger.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

start()

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server')
  httpServer.close(() => mongoose.connection.close(false))
})


