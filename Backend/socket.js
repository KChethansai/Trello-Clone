// socket service: initializes Socket.IO rooms for real-time project updates.
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { env } from './config/env.js'

// singleton io instance
let io = null

const roomPresence = new Map()

const getRoomUsers = (room) =>
  Array.from(roomPresence.get(room)?.values() || [])

const parseCookie = (cookieHeader = '') =>
  Object.fromEntries(
    cookieHeader
      .split(';')
      .map((item) => item.trim().split('='))
      .filter(([key, value]) => key && value)
  )

const getSocketUser = (socket) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      parseCookie(socket.handshake.headers?.cookie).token

    return token ? jwt.verify(token, env.secretKey) : null
  } catch {
    return null
  }
}

const addPresence = (room, socket, user = {}) => {
  if (!room) return

  const users = roomPresence.get(room) || new Map()

  const userId = user._id || user.id || socket.id

  users.set(socket.id, {
    socketId: socket.id,
    _id: userId,
    name: user.name || user.email || 'Active user',
    email: user.email || '',
    profilePic: user.profilePic || ''
  })

  roomPresence.set(room, users)

  io.to(room).emit('presence-updated', {
    room,
    users: getRoomUsers(room)
  })
}

const removePresence = (room, socketId) => {
  if (!room) return

  const users = roomPresence.get(room)

  if (!users) return

  users.delete(socketId)

  if (users.size === 0) {
    roomPresence.delete(room)
  } else {
    roomPresence.set(room, users)
  }

  io.to(room).emit('presence-updated', {
    room,
    users: getRoomUsers(room)
  })
}

export const init = (httpServer) => {
  io = new Server(httpServer, {
    transports: ['websocket'],

    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.data.user = getSocketUser(socket)

    const joinedRooms = new Set()

    const joinRealtimeRoom = (room, user) => {
      socket.join(room)

      joinedRooms.add(room)

      addPresence(room, socket, user || socket.data.user)
    }

    const leaveRealtimeRoom = (room) => {
      socket.leave(room)

      joinedRooms.delete(room)

      removePresence(room, socket.id)
    }

    // Project room
    socket.on('join-project', (projectId, user) => {
      joinRealtimeRoom(`project:${projectId}`, user)
    })

    socket.on('leave-project', (projectId) => {
      leaveRealtimeRoom(`project:${projectId}`)
    })

    // Board room
    socket.on('join-board', (boardId, user) => {
      joinRealtimeRoom(`board:${boardId}`, user)
    })

    socket.on('leave-board', (boardId) => {
      leaveRealtimeRoom(`board:${boardId}`)
    })

    // User room
    socket.on('join-user', (userId) => {
      socket.join(`user:${userId}`)
    })

    socket.on('typing-start', ({ room, cardId, user }) => {
      if (!room) return

      socket.to(room).emit('typing-started', {
        room,
        cardId,
        user
      })
    })

    socket.on('typing-stop', ({ room, cardId, user }) => {
      if (!room) return

      socket.to(room).emit('typing-stopped', {
        room,
        cardId,
        user
      })
    })

    socket.on('activity-created', ({ room, activity }) => {
      if (!room || !activity) return

      io.to(room).emit('activity-created', {
        ...activity,
        createdAt: activity.createdAt || new Date().toISOString()
      })
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)

      joinedRooms.forEach((room) => {
        removePresence(room, socket.id)
      })

      joinedRooms.clear()
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialised - call init() first')
  }

  return io
}
