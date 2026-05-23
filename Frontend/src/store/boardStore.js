// boardStore store: centralizes client state and API calls for this domain.
import { create } from 'zustand'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../config/api'

// Singleton socket connection shared by board pages and dashboard surfaces.
let socket = null

const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket']
    })
  }

  return socket
}

const cardMatches = (cardId) => (card) => card._id === cardId

const upsertCardInState = (state, card) => {
  const newCards = { ...state.cards }
  const nextListId = card.listId?.toString()
  let found = false

  for (const [lid, listCards] of Object.entries(newCards)) {
    const idx = listCards.findIndex(cardMatches(card._id))
    if (idx !== -1) {
      found = true
      if (nextListId && nextListId !== lid) {
        newCards[lid] = listCards.filter((c) => c._id !== card._id)
        newCards[nextListId] = [
          ...(newCards[nextListId] || []),
          { ...listCards[idx], ...card, listId: nextListId }
        ]
      } else {
        newCards[lid] = [...listCards]
        newCards[lid][idx] = { ...listCards[idx], ...card }
      }
      break
    }
  }

  if (!found && nextListId && newCards[nextListId]) {
    newCards[nextListId] = [...newCards[nextListId], card]
  }

  return newCards
}

const compactActivity = (activityFeed, activity) =>
  [activity, ...activityFeed].slice(0, 60)

const cacheTtl = 60 * 1000
const isFresh = (timestamp) => timestamp && Date.now() - timestamp < cacheTtl

export const useBoardStore = create((set, get) => ({
  boards: [],
  recentBoards: [],
  activeBoard: null,
  lists: [],
  cards: {}, // { [listId]: Card[] }
  loading: false,
  error: null,
  activeUsers: [],
  typingUsers: {},
  activityFeed: [],
  cardSavingIds: {},
  viewMode: 'kanban',
  savedFilters: JSON.parse(localStorage.getItem('board-saved-filters') || '[]'),
  activeFilter: { search: '', priority: 'ALL', status: 'ALL' },
  undoStack: [],
  redoStack: [],
  analyticsByBoard: {},
  cache: {},

  // Socket

  //join a board room and bind real-time events
  joinBoard: (boardId, user = null) => {
    const sock = getSocket()
    sock.emit('join-board', boardId, user)

    sock.off('list-created')
    sock.off('list-updated')
    sock.off('list-deleted')
    sock.off('lists-reordered')
    sock.off('card-created')
    sock.off('card-updated')
    sock.off('card-deleted')
    sock.off('cards-reordered')
    sock.off('presence-updated')
    sock.off('typing-started')
    sock.off('typing-stopped')
    sock.off('activity-created')

    sock.on('list-created', (list) => {
      set((s) => {
        const already = s.lists.some((l) => l._id === list._id)
        if (already) return {}
        return { lists: [...s.lists, list] }
      })
    })

    sock.on('list-updated', (list) => {
      set((s) => ({
        lists: s.lists.map((l) => (l._id === list._id ? list : l))
      }))
    })

    sock.on('list-deleted', ({ listId }) => {
      set((s) => {
        const newCards = { ...s.cards }
        delete newCards[listId]
        return {
          lists: s.lists.filter((l) => l._id !== listId),
          cards: newCards
        }
      })
    })

    sock.on('lists-reordered', ({ orderedIds }) => {
      set((s) => {
        const map = Object.fromEntries(s.lists.map((l) => [l._id, l]))
        return { lists: orderedIds.map((id) => map[id]).filter(Boolean) }
      })
    })

    sock.on('card-created', (card) => {
      const listId = card.listId?.toString()
      if (!listId) return
      set((s) => {
        const existing = s.cards[listId] || []
        if (existing.some((c) => c._id === card._id)) return {}
        return { cards: { ...s.cards, [listId]: [...existing, card] } }
      })
    })

    sock.on('card-updated', (card) => {
      set((s) => ({ cards: upsertCardInState(s, card) }))
    })

    sock.on('card-deleted', ({ cardId, listId }) => {
      set((s) => ({
        cards: {
          ...s.cards,
          [listId]: (s.cards[listId] || []).filter((c) => c._id !== cardId)
        }
      }))
    })

    sock.on('cards-reordered', ({ listId, orderedIds }) => {
      set((s) => {
        const current = s.cards[listId] || []
        const map = Object.fromEntries(current.map((c) => [c._id, c]))
        return {
          cards: {
            ...s.cards,
            [listId]: orderedIds.map((id) => map[id]).filter(Boolean)
          }
        }
      })
    })

    sock.on('presence-updated', ({ room, users }) => {
      if (room === `board:${boardId}`) set({ activeUsers: users || [] })
    })

    sock.on('typing-started', ({ cardId, user }) => {
      if (!cardId || !user) return
      set((s) => ({
        typingUsers: {
          ...s.typingUsers,
          [cardId]: {
            ...(s.typingUsers[cardId] || {}),
            [user._id || user.id || user.socketId]: user
          }
        }
      }))
    })

    sock.on('typing-stopped', ({ cardId, user }) => {
      const key = user?._id || user?.id || user?.socketId
      if (!cardId || !key) return
      set((s) => {
        const nextCardTyping = { ...(s.typingUsers[cardId] || {}) }
        delete nextCardTyping[key]
        return {
          typingUsers: { ...s.typingUsers, [cardId]: nextCardTyping }
        }
      })
    })

    sock.on('activity-created', (activity) => {
      set((s) => ({ activityFeed: compactActivity(s.activityFeed, activity) }))
    })
  },

  leaveBoard: (boardId) => {
    const sock = getSocket()
    sock.emit('leave-board', boardId)
  },

  joinUserRoom: (userId) => {
    const sock = getSocket()
    sock.emit('join-user', userId)
  },

  emitTyping: ({ boardId, cardId, user, typing }) => {
    const sock = getSocket()
    sock.emit(typing ? 'typing-start' : 'typing-stop', {
      room: `board:${boardId}`,
      cardId,
      user
    })
  },

  emitActivity: (boardId, activity) => {
    const sock = getSocket()
    sock.emit('activity-created', {
      room: `board:${boardId}`,
      activity
    })
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setActiveFilter: (filter) =>
    set((s) => ({ activeFilter: { ...s.activeFilter, ...filter } })),
  saveFilter: (name) => {
    const next = [
      ...get().savedFilters.filter((item) => item.name !== name),
      { name, filter: get().activeFilter }
    ]
    localStorage.setItem('board-saved-filters', JSON.stringify(next))
    set({ savedFilters: next })
  },
  pushUndoSnapshot: () =>
    set((s) => ({
      undoStack: [...s.undoStack, { lists: s.lists, cards: s.cards }].slice(
        -20
      ),
      redoStack: []
    })),
  undo: () =>
    set((s) => {
      const previous = s.undoStack.at(-1)
      if (!previous) return {}
      return {
        lists: previous.lists,
        cards: previous.cards,
        undoStack: s.undoStack.slice(0, -1),
        redoStack: [{ lists: s.lists, cards: s.cards }, ...s.redoStack].slice(
          0,
          20
        )
      }
    }),
  redo: () =>
    set((s) => {
      const next = s.redoStack[0]
      if (!next) return {}
      return {
        lists: next.lists,
        cards: next.cards,
        redoStack: s.redoStack.slice(1),
        undoStack: [...s.undoStack, { lists: s.lists, cards: s.cards }].slice(
          -20
        )
      }
    }),

  // Boards

  fetchBoards: async (workspaceId = null) => {
    const cacheKey = `boards:${workspaceId || 'all'}`
    const cached = get().cache[cacheKey]
    if (isFresh(cached?.timestamp)) {
      set({ boards: cached.data, loading: false })
      return cached.data
    }
    set({ loading: true, boards: [] })
    try {
      const url = workspaceId
        ? `${API_BASE_URL}/boards-api/boards?workspaceId=${encodeURIComponent(workspaceId)}`
        : `${API_BASE_URL}/boards-api/boards`
      const res = await axios.get(url, { withCredentials: true })
      const boards = res.data.payload || []
      set((s) => ({
        boards,
        loading: false,
        cache: {
          ...s.cache,
          [cacheKey]: { data: boards, timestamp: Date.now() }
        }
      }))
      return boards
    } catch {
      set({ loading: false })
      return []
    }
  },

  fetchRecentBoards: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/boards-api/boards/recent`, {
        withCredentials: true
      })
      set({ recentBoards: res.data.payload || [] })
    } catch {
      //silent
    }
  },

  createBoard: async ({
    title,
    color,
    workspaceId = null,
    backgroundFile = null
  }) => {
    try {
      const body = backgroundFile
        ? new FormData()
        : {
            title,
            color,
            ...(workspaceId && { workspaceId })
          }
      if (backgroundFile) {
        body.append('title', title)
        body.append('color', color)
        if (workspaceId) body.append('workspaceId', workspaceId)
        body.append('background', backgroundFile)
      }
      const res = await axios.post(`${API_BASE_URL}/boards-api/boards`, body, {
        withCredentials: true
      })
      const newBoard = res.data.payload
      set((s) => ({ boards: [newBoard, ...s.boards] }))
      return newBoard
    } catch {
      return null
    }
  },

  fetchBoard: async (boardId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/boards-api/boards/${boardId}`,
        {
          withCredentials: true
        }
      )
      const board = res.data.payload || null
      set((s) => ({
        activeBoard: board,
        boards: board
          ? s.boards.some((b) => b._id === board._id)
            ? s.boards.map((b) => (b._id === board._id ? board : b))
            : [board, ...s.boards]
          : s.boards
      }))
      return board
    } catch {
      return null
    }
  },

  updateBoard: async (boardId, data) => {
    try {
      const body = data.backgroundFile ? new FormData() : data
      if (data.backgroundFile) {
        Object.entries(data).forEach(([key, value]) => {
          if (
            key !== 'backgroundFile' &&
            value !== undefined &&
            value !== null
          ) {
            body.append(key, value)
          }
        })
        body.append('background', data.backgroundFile)
      }
      const res = await axios.put(
        `${API_BASE_URL}/boards-api/boards/${boardId}`,
        body,
        { withCredentials: true }
      )
      const updated = res.data.payload
      set((s) => ({
        boards: s.boards.map((b) =>
          b._id === boardId ? { ...b, ...updated } : b
        ),
        activeBoard:
          s.activeBoard?._id === boardId
            ? { ...s.activeBoard, ...updated }
            : s.activeBoard
      }))
      return updated
    } catch {
      return null
    }
  },

  deleteBoard: async (boardId) => {
    try {
      await axios.delete(`${API_BASE_URL}/boards-api/boards/${boardId}`, {
        withCredentials: true
      })
      set((s) => ({
        boards: s.boards.filter((b) => b._id !== boardId),
        recentBoards: s.recentBoards.filter((b) => b._id !== boardId),
        activeBoard: s.activeBoard?._id === boardId ? null : s.activeBoard
      }))
    } catch {
      //silent
    }
  },

  archiveBoard: async (boardId, archived = true) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/boards-api/boards/${boardId}/archive`,
        { archived },
        { withCredentials: true }
      )
      const updated = res.data.payload
      set((s) => ({
        boards: s.boards.map((b) => (b._id === boardId ? updated : b)),
        activeBoard: s.activeBoard?._id === boardId ? updated : s.activeBoard
      }))
      return updated
    } catch {
      return null
    }
  },

  exportBoard: async (boardId) => {
    const res = await axios.get(
      `${API_BASE_URL}/boards-api/boards/${boardId}/export`,
      {
        withCredentials: true
      }
    )
    return res.data.payload
  },

  importBoard: async (payload) => {
    const res = await axios.post(
      `${API_BASE_URL}/boards-api/boards/import`,
      payload,
      {
        withCredentials: true
      }
    )
    const board = res.data.payload
    set((s) => ({ boards: [board, ...s.boards] }))
    return board
  },

  fetchBoardAnalytics: async (boardId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/boards-api/boards/${boardId}/analytics`,
        { withCredentials: true }
      )
      set((s) => ({
        analyticsByBoard: { ...s.analyticsByBoard, [boardId]: res.data.payload }
      }))
      return res.data.payload
    } catch {
      return null
    }
  },

  setActiveBoard: (board) => set({ activeBoard: board }),

  // Lists

  fetchLists: async (boardId) => {
    set({ loading: true, lists: [], cards: {} })
    try {
      const res = await axios.get(
        `${API_BASE_URL}/boards-api/boards/${boardId}/lists`,
        { withCredentials: true }
      )
      const lists = res.data.payload || []
      set({ lists, loading: false })
      return lists
    } catch {
      set({ loading: false })
      return []
    }
  },

  createList: async (boardId, title) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/boards-api/boards/${boardId}/lists`,
        { title },
        { withCredentials: true }
      )
      const newList = res.data.payload
      //socket will add it, but we also add locally to avoid flicker
      set((s) => {
        if (s.lists.some((l) => l._id === newList._id)) return {}
        return { lists: [...s.lists, newList] }
      })
      return newList
    } catch {
      return null
    }
  },

  deleteList: async (listId) => {
    try {
      await axios.delete(`${API_BASE_URL}/boards-api/lists/${listId}`, {
        withCredentials: true
      })
      set((s) => {
        const newCards = { ...s.cards }
        delete newCards[listId]
        return {
          lists: s.lists.filter((l) => l._id !== listId),
          cards: newCards
        }
      })
    } catch {
      //silent
    }
  },

  updateList: async (listId, data) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/boards-api/lists/${listId}`,
        data,
        {
          withCredentials: true
        }
      )
      const updated = res.data.payload
      set((s) => ({
        lists: s.lists.map((list) =>
          list._id === listId ? { ...list, ...updated } : list
        )
      }))
      return updated
    } catch {
      return null
    }
  },

  reorderLists: async (boardId, newOrder) => {
    get().pushUndoSnapshot()
    //optimistic update
    set({ lists: newOrder })
    try {
      await axios.put(
        `${API_BASE_URL}/boards-api/boards/${boardId}/lists/reorder`,
        { orderedIds: newOrder.map((l) => l._id) },
        { withCredentials: true }
      )
    } catch {
      //silent - socket will correct if needed
    }
  },

  // Cards

  fetchCards: async (listId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/boards-api/lists/${listId}/cards`,
        { withCredentials: true }
      )
      set((s) => ({
        cards: { ...s.cards, [listId]: res.data.payload || [] }
      }))
    } catch {
      //silent
    }
  },

  createCard: async (listId, cardData) => {
    get().pushUndoSnapshot()
    try {
      const res = await axios.post(
        `${API_BASE_URL}/boards-api/lists/${listId}/cards`,
        cardData,
        { withCredentials: true }
      )
      const newCard = res.data.payload
      //socket will broadcast, but add locally too to avoid flicker
      set((s) => {
        const existing = s.cards[listId] || []
        if (existing.some((c) => c._id === newCard._id)) return {}
        return { cards: { ...s.cards, [listId]: [...existing, newCard] } }
      })
      return newCard
    } catch {
      return null
    }
  },

  updateCard: async (cardId, data) => {
    const previousCards = get().cards
    set((s) => ({
      cardSavingIds: { ...s.cardSavingIds, [cardId]: true },
      cards: upsertCardInState(s, { _id: cardId, ...data })
    }))
    try {
      const res = await axios.put(
        `${API_BASE_URL}/boards-api/cards/${cardId}`,
        data,
        { withCredentials: true }
      )
      const updated = res.data.payload
      set((s) => ({
        cards: upsertCardInState(s, updated),
        cardSavingIds: { ...s.cardSavingIds, [cardId]: false }
      }))
      return updated
    } catch {
      set((s) => ({
        cards: previousCards,
        cardSavingIds: { ...s.cardSavingIds, [cardId]: false }
      }))
      return null
    }
  },

  uploadCardAttachment: async (cardId, file) => {
    try {
      const body = new FormData()
      body.append('attachment', file)

      const res = await axios.post(
        `${API_BASE_URL}/boards-api/cards/${cardId}/attachments`,
        body,
        { withCredentials: true }
      )
      const updated = res.data.payload
      set((s) => {
        const newCards = { ...s.cards }
        for (const [lid, listCards] of Object.entries(newCards)) {
          const idx = listCards.findIndex((c) => c._id === cardId)
          if (idx !== -1) {
            newCards[lid] = [...listCards]
            newCards[lid][idx] = { ...listCards[idx], ...updated }
            break
          }
        }
        return { cards: newCards }
      })
      return updated
    } catch {
      return null
    }
  },

  deleteCard: async (cardId, listId) => {
    get().pushUndoSnapshot()
    //optimistic remove
    set((s) => ({
      cards: {
        ...s.cards,
        [listId]: (s.cards[listId] || []).filter((c) => c._id !== cardId)
      }
    }))
    try {
      await axios.delete(`${API_BASE_URL}/boards-api/cards/${cardId}`, {
        withCredentials: true
      })
    } catch {
      //silent
    }
  },

  // DnD helpers

  //move card between lists - optimistic only; persisted via moveCard
  moveCardBetweenLists: (
    cardId,
    fromListId,
    toListId,
    toIndex = null,
    cardPatch = {}
  ) => {
    set((s) => {
      const fromCards = [...(s.cards[fromListId] || [])]
      const idx = fromCards.findIndex((c) => c._id === cardId)
      if (idx === -1) return {}
      const [card] = fromCards.splice(idx, 1)
      const nextCard = { ...card, ...cardPatch }

      if (fromListId === toListId) {
        if (toIndex === null) {
          fromCards.splice(idx, 0, nextCard)
          return { cards: { ...s.cards, [fromListId]: fromCards } }
        }
        const insertAt = toIndex === null ? fromCards.length : toIndex
        fromCards.splice(insertAt, 0, nextCard)
        return { cards: { ...s.cards, [fromListId]: fromCards } }
      }

      const toCards = [...(s.cards[toListId] || [])]
      const insertAt = toIndex === null ? toCards.length : toIndex
      toCards.splice(insertAt, 0, { ...nextCard, listId: toListId })
      return {
        cards: { ...s.cards, [fromListId]: fromCards, [toListId]: toCards }
      }
    })
  },

  //persist card move to backend
  moveCard: async (cardId, toListId, data = {}) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/boards-api/cards/${cardId}`,
        { ...data, listId: toListId },
        { withCredentials: true }
      )
      return res.data.payload || null
    } catch {
      return null
    }
  },

  reorderCardsInList: (listId, newOrder) => {
    set((s) => ({ cards: { ...s.cards, [listId]: newOrder } }))
  },

  persistCardOrder: async (listId) => {
    const orderedIds = (get().cards[listId] || []).map((card) => card._id)
    try {
      await axios.put(
        `${API_BASE_URL}/boards-api/lists/${listId}/cards/reorder`,
        { orderedIds },
        { withCredentials: true }
      )
    } catch {
      //silent; a later fetch/socket event will correct the board
    }
  }
}))
