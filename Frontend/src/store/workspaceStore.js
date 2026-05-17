// workspaceStore store: centralizes client state and API calls for this domain.
import { create } from 'zustand'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Workspace store keeps workspace membership and active workspace state synchronized.
export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  members: [],
  loading: false,
  error: null,

  // Workspaces

  //fetch all workspaces for the logged-in user
  fetchWorkspaces: async () => {
    set({ loading: true })
    try {
      const res = await axios.get(`${API_BASE_URL}/api/workspaces`, {
        withCredentials: true
      })
      const list = Array.isArray(res.data) ? res.data : res.data.payload || []
      const active = get().activeWorkspace
      const nextActive =
        list.find((workspace) => workspace._id === active?._id) ||
        list[0] ||
        null
      set({ workspaces: list, activeWorkspace: nextActive, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchWorkspace: async (workspaceId) => {
    if (!workspaceId) return null
    try {
      const res = await axios.get(`${API_BASE_URL}/api/workspaces/${workspaceId}`, {
        withCredentials: true
      })
      const workspace = res.data.payload || res.data
      set((s) => ({
        workspaces: s.workspaces.map((w) =>
          w._id === workspace._id ? workspace : w
        ),
        activeWorkspace: workspace
      }))
      return workspace
    } catch {
      return null
    }
  },

  //create a new workspace
  createWorkspace: async ({ name }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/workspaces`,
        { name },
        { withCredentials: true }
      )
      const ws = res.data.payload || res.data
      set((s) => ({ workspaces: [ws, ...s.workspaces], activeWorkspace: ws }))
      return ws
    } catch (err) {
      throw err
    }
  },

  //update workspace name
  updateWorkspace: async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/workspaces/${id}`, data, {
        withCredentials: true
      })
      const updated = res.data.payload || res.data
      set((s) => ({
        workspaces: s.workspaces.map((w) => (w._id === id ? updated : w)),
        activeWorkspace:
          s.activeWorkspace?._id === id ? updated : s.activeWorkspace
      }))
      return updated
    } catch (err) {
      throw err
    }
  },

  //delete workspace
  deleteWorkspace: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/workspaces/${id}`, {
        withCredentials: true
      })
      set((s) => ({
        workspaces: s.workspaces.filter((w) => w._id !== id),
        activeWorkspace:
          s.activeWorkspace?._id === id ? null : s.activeWorkspace
      }))
    } catch (err) {
      throw err
    }
  },

  setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),

  // Members

  //fetch workspace members by fetching the single workspace
  fetchMembers: async (workspaceId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/workspaces/${workspaceId}`, {
        withCredentials: true
      })
      const ws = res.data.payload || res.data
      set({ members: ws.members || [], activeWorkspace: ws })
    } catch {
      set({ members: [] })
    }
  },

  //invite member by email - backend needs to look up user by email first
  inviteMember: async (workspaceId, email, role = 'MEMBER') => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/workspaces/${workspaceId}/members`,
        { email, role },
        { withCredentials: true }
      )
      //re-fetch members
      await get().fetchWorkspace(workspaceId)
      return res.data
    } catch (err) {
      throw err
    }
  },

  //remove member
  removeMember: async (workspaceId, userId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/workspaces/${workspaceId}/members/${userId}`,
        { withCredentials: true }
      )
      await get().fetchWorkspace(workspaceId)
      set((s) => ({
        members: s.members.filter((m) => m.user?._id !== userId)
      }))
    } catch (err) {
      throw err
    }
  }
}))


