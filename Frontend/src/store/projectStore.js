// projectStore store: centralizes client state and API calls for this domain.
import { create } from 'zustand'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../config/api'

// Singleton socket connection shared by board pages and dashboard surfaces.
let socket = null

const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, { withCredentials: true, autoConnect: true })
  }
  return socket
}

export const useProjectStore = create((set, get) => ({
  projects: [],
  recentProjects: [],
  activeProject: null,
  lists: [],
  cards: {}, // { [listId]: Card[] }
  loading: false,
  error: null,

  // Socket

  //join a board room and bind real-time events
  joinProject: (projectId) => {
    const sock = getSocket()
    sock.emit('join-project', projectId)

    sock.off('project-updated')
    sock.off('project-deleted')

    sock.off('list-created')
    sock.off('list-updated')
    sock.off('list-deleted')
    sock.off('lists-reordered')
    sock.off('card-created')
    sock.off('card-updated')
    sock.off('card-deleted')
    sock.off('cards-reordered')

    sock.on('project-updated', (project) => {
      set((s) => ({
        activeProject: s.activeProject?._id === project._id ? project : s.activeProject,
        projects: s.projects.map((p) => (p._id === project._id ? project : p))
      }))
    })

    sock.on('project-deleted', ({ projectId }) => {
      set((s) => ({
        projects: s.projects.filter((p) => p._id !== projectId),
        activeProject: s.activeProject?._id === projectId ? null : s.activeProject
      }))
    })

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
      set((s) => {
        const newCards = { ...s.cards }
        const nextListId = card.listId?.toString()
        let found = false

        for (const [lid, listCards] of Object.entries(newCards)) {
          const idx = listCards.findIndex((c) => c._id === card._id)
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

        return { cards: newCards }
      })
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
  },

  leaveProject: (projectId) => {
    const sock = getSocket()
    sock.emit('leave-project', projectId)
  },

  joinUserRoom: (userId) => {
    const sock = getSocket()
    sock.emit('join-user', userId)
  },

  // Projects

  fetchProjects: async (workspaceId = null) => {
    set({ loading: true, projects: [] })
    try {
      const url = workspaceId
        ? `${API_BASE_URL}/projects-api/projects?workspaceId=${encodeURIComponent(workspaceId)}`
        : `${API_BASE_URL}/projects-api/projects`
      const res = await axios.get(url, { withCredentials: true })
      set({ projects: res.data.payload || [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchRecentProjects: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects-api/projects/recent`, {
        withCredentials: true
      })
      set({ recentProjects: res.data.payload || [] })
    } catch {
      //silent
    }
  },

  createProject: async ({
    title,
    color,
    workspaceId = null,
    backgroundFile = null,
    isEditable = false,
    isPublished = false
  }) => {
    try {
      const body = backgroundFile
        ? new FormData()
        : { title, color, workspaceId, isEditable, isPublished }
      if (backgroundFile) {
        body.append('title', title)
        body.append('color', color)
        if (workspaceId) body.append('workspaceId', workspaceId)
        body.append('isEditable', isEditable)
        body.append('isPublished', isPublished)
        body.append('background', backgroundFile)
      }
      const res = await axios.post(
        `${API_BASE_URL}/projects-api/projects`,
        body,
        { withCredentials: true }
      )
      const newProject = res.data.payload
      set((s) => ({ projects: [newProject, ...s.projects] }))
      return newProject
    } catch {
      return null
    }
  },

  fetchProject: async (projectId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects-api/projects/${projectId}`, {
        withCredentials: true
      })
      const project = res.data.payload || null
      set((s) => ({
        activeProject: project,
        projects: project
          ? s.projects.some((b) => b._id === project._id)
            ? s.projects.map((b) => (b._id === project._id ? project : b))
            : [project, ...s.projects]
          : s.projects
      }))
      return project
    } catch {
      return null
    }
  },

  updateProject: async (projectId, data) => {
    try {
      const body = data.backgroundFile ? new FormData() : data
      if (data.backgroundFile) {
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'backgroundFile' && value !== undefined && value !== null) {
            body.append(key, value)
          }
        })
        body.append('background', data.backgroundFile)
      }
      const res = await axios.put(
        `${API_BASE_URL}/projects-api/projects/${projectId}`,
        body,
        { withCredentials: true }
      )
      const updated = res.data.payload
      set((s) => ({
        projects: s.projects.map((b) =>
          b._id === projectId ? { ...b, ...updated } : b
        ),
        activeProject:
          s.activeProject?._id === projectId
            ? { ...s.activeProject, ...updated }
            : s.activeProject
      }))
      return updated
    } catch {
      return null
    }
  },

  deleteProject: async (projectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects-api/projects/${projectId}`, {
        withCredentials: true
      })
      set((s) => ({
        projects: s.projects.filter((b) => b._id !== projectId),
        recentProjects: s.recentProjects.filter((b) => b._id !== projectId)
      }))
    } catch {
      //silent
    }
  },

  setActiveProject: (project) => set({ activeProject: project }),

  // Lists

  fetchLists: async (projectId) => {
    set({ loading: true, lists: [], cards: {} })
    try {
      const res = await axios.get(
        `${API_BASE_URL}/projects-api/projects/${projectId}/lists`,
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

  createList: async (projectId, title) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/projects-api/projects/${projectId}/lists`,
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
      await axios.delete(`${API_BASE_URL}/projects-api/lists/${listId}`, {
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
      const res = await axios.put(`${API_BASE_URL}/projects-api/lists/${listId}`, data, {
        withCredentials: true
      })
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

  reorderLists: async (projectId, newOrder) => {
    //optimistic update
    set({ lists: newOrder })
    try {
      await axios.put(
        `${API_BASE_URL}/projects-api/projects/${projectId}/lists/reorder`,
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
        `${API_BASE_URL}/projects-api/lists/${listId}/cards`,
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
    try {
      const res = await axios.post(
        `${API_BASE_URL}/projects-api/lists/${listId}/cards`,
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
    try {
      const res = await axios.put(
        `${API_BASE_URL}/projects-api/cards/${cardId}`,
        data,
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

  uploadCardAttachment: async (cardId, file) => {
    try {
      const body = new FormData()
      body.append('attachment', file)

      const res = await axios.post(
        `${API_BASE_URL}/projects-api/cards/${cardId}/attachments`,
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
    //optimistic remove
    set((s) => ({
      cards: {
        ...s.cards,
        [listId]: (s.cards[listId] || []).filter((c) => c._id !== cardId)
      }
    }))
    try {
      await axios.delete(`${API_BASE_URL}/projects-api/cards/${cardId}`, {
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
        `${API_BASE_URL}/projects-api/cards/${cardId}`,
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


