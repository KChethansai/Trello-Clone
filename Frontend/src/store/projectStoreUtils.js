import { io } from 'socket.io-client'
import { API_BASE_URL } from '../config/api'

// Singleton socket connection shared by board pages and dashboard surfaces.
let socket = null

export const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket']
    })
  }

  return socket
}

export const cardMatches = (cardId) => (card) => card._id === cardId

export const upsertCardInState = (state, card) => {
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

export const findLocalCard = (cards, cardId) => {
  for (const listCards of Object.values(cards)) {
    const found = listCards.find(cardMatches(cardId))
    if (found) return found
  }
  return null
}

export const isIncomingCardNewer = (incoming, local) => {
  if (!local?.updatedAt || !incoming?.updatedAt) return true
  return new Date(incoming.updatedAt) > new Date(local.updatedAt)
}

export const compactActivity = (activityFeed, activity) =>
  [activity, ...activityFeed].slice(0, 60)

export const cacheTtl = 60 * 1000
export const isFresh = (timestamp) => timestamp && Date.now() - timestamp < cacheTtl
