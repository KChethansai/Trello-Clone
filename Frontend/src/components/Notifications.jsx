// Notifications component: renders a focused piece of the Trello clone UI.
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  BsBell,
  BsCheck2All,
  BsTrash,
  BsCreditCard,
  BsPeopleFill,
  BsX
} from 'react-icons/bs'
import { API_BASE_URL } from '../config/api'


const typeIcon = {
  card: <BsCreditCard className="text-blue-400" />,
  member: <BsPeopleFill className="text-green-400" />,
  mention: <span className="text-purple-400 font-bold text-sm">@</span>,
  default: <BsBell className="text-[#9fadbc]" />
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        withCredentials: true
      })
      setNotifications(res.data.payload || [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markRead = async (id) => {
    //optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
    try {
      await axios.put(
        `${API_BASE_URL}/notifications/${id}/read`,
        {},
        { withCredentials: true }
      )
    } catch {
      //silent
    }
  }

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('All marked as read')
    try {
      await axios.put(
        `${API_BASE_URL}/notifications/read-all`,
        {},
        { withCredentials: true }
      )
    } catch {
      //silent
    }
  }

  const deleteNotif = async (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id))
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
        withCredentials: true
      })
    } catch {
      //silent
    }
  }

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="fixed inset-0 z-30 flex">
      {/* backdrop */}
      <div
        className="flex-1 bg-black/30"
        onClick={() => navigate('/main-page')}
      />

      {/* panel */}
      <div className="w-96 bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5ea]">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#1d1d1f]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#0066cc] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <BsCheck2All /> Mark all read
              </button>
            )}
            <button
              onClick={() => navigate('/main-page')}
              className="text-[#6e6e73] hover:text-[#1d1d1f] ml-1"
            >
              <BsX className="text-xl" />
            </button>
          </div>
        </div>

        {/* filter tabs */}
        <div className="flex gap-0 border-b border-[#e5e5ea] px-5">
          {['all', 'unread'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-2.5 text-xs font-medium border-b-2 capitalize transition-colors ${
                filter === tab
                  ? 'border-[#0066cc] text-[#0066cc]'
                  : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {tab}
              {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <BsBell className="text-4xl text-[#d2d2d7] mb-3" />
              <p className="text-sm font-semibold text-[#1d1d1f]">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications yet'}
              </p>
              <p className="text-xs text-[#6e6e73] mt-1">
                Updates will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#f2f2f7]">
              {filtered.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markRead(n._id)}
                  className={`relative flex items-start gap-3 px-5 py-3.5 group cursor-pointer transition-colors ${
                    n.read
                      ? 'hover:bg-[#f9f9f9]'
                      : 'bg-blue-50/60 hover:bg-blue-50'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0066cc] rounded-full" />
                  )}
                  <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                    {typeIcon[n.type] || typeIcon.default}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs leading-relaxed ${
                        n.read ? 'text-[#6e6e73]' : 'text-[#1d1d1f] font-medium'
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[10px] text-[#a1a1a6] mt-0.5">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotif(n._id)
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[#a1a1a6] hover:text-red-500 transition-all p-1 rounded shrink-0"
                  >
                    <BsTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications


