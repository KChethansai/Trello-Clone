// socket service: initializes Socket.IO rooms for real-time project updates.
import { Server } from 'socket.io'
import { env } from './config/env.js'

//singleton io instance - initialised once by server.js via init()
let io = null

export const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrls,
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    //project room - real-time list/card updates
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`)
    })
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`)
    })

    //personal room - notification badge updates
    socket.on('join-user', (userId) => {
      socket.join(`user:${userId}`)
    })

    socket.on('disconnect', () => {
      // rooms cleaned up automatically by socket.io
    })
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialised - call init() first')
  return io
}


