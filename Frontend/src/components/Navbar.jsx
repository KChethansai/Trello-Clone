// Navbar component: renders a focused piece of the Kanvora UI.
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import kanvoraLogo from '../assets/kanvora-logo.png'
import {
  BsBell,
  BsSearch,
  BsX,
  BsBoxArrowRight,
  BsGear,
  BsPerson,
  BsList,
  BsChevronDown,
  BsCalendar3,
  BsGrid3X3Gap,
  BsBarChart,
  BsListUl,
  BsTable,
  BsActivity
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useAuth } from '../store/authStore'
import { useProjectStore } from '../store/projectStore'
import { useWorkspaceStore } from '../store/workspaceStore'
import {
  errorText,
  dashboardBorderColor,
  dashboardMutedColor,
  dashboardBgColor,
  dashboardPrimaryBg,
  dashboardPrimaryBgHover,
  dashboardPrimaryText,
  dashboardTextColor,
  dashboardPanelElevated,
  dashboardFocusRing,
  dashboardSurfaceHover,
  navbarWrap,
  navbarBtn,
  navbarIconBtn
} from '../Styles/common'
import { useNotificationStore } from '../store/notificationStore'

const navLinks = ['Workspaces', 'Templates']

export function CreateProjectModal({ onClose }) {
  const [title, setTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState('from-blue-500 to-blue-700')
  const [submitting, setSubmitting] = useState(false)
  const { createProject } = useProjectStore()
  const { activeWorkspace } = useWorkspaceStore()

  const bgOptions = [
    'from-blue-500 to-blue-700',
    'from-orange-400 to-orange-600',
    'from-violet-500 to-purple-700',
    'from-emerald-400 to-teal-600',
    'from-rose-400 to-pink-600'
  ]

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Project title is required')
      return
    }
    if (!activeWorkspace?._id) {
      toast.error('Create or select a workspace first')
      return
    }
    setSubmitting(true)
    const project = await createProject({
      title: title.trim(),
      color: selectedBg,
      workspaceId: activeWorkspace._id,
      isEditable: true,
      isPublished: false
    })
    setSubmitting(false)
    if (project) {
      toast.success('Project created!')
      onClose()
    }
  }

  return (
    <div className="premium-card animate-enter absolute top-10 left-0 z-50 w-72 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white text-center flex-1">
          Create project
        </h3>
        <button
          onClick={onClose}
          className={`${dashboardMutedColor} hover:text-white`}
        >
          <BsX />
        </button>
      </div>

      {/* preview */}
      <div
        className={`h-20 rounded-lg bg-linear-to-br ${selectedBg} mb-3 flex items-center justify-center`}
      >
        <span className="text-white text-xs font-semibold opacity-80">
          {title || 'Project title'}
        </span>
      </div>

      {/* colour picker */}
      <div className="flex gap-1.5 mb-3">
        {bgOptions.map((bg) => (
          <button
            key={bg}
            onClick={() => setSelectedBg(bg)}
            className={`w-8 h-6 rounded bg-linear-to-br ${bg} ${
              selectedBg === bg ? 'ring-2 ring-white' : ''
            }`}
          />
        ))}
      </div>

      <label
        className={`text-xs ${dashboardMutedColor} font-semibold block mb-1`}
      >
        Project title <span className={`${errorText}`}>*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        autoFocus
        placeholder="My project"
        className={`w-full ${dashboardBgColor} border ${dashboardBorderColor} rounded-lg px-3 py-1.5 text-sm text-white ${dashboardMutedColor} focus:outline-none focus:border-[#ff4d67] focus:ring-2 focus:ring-[#ff4d67]/20 mb-3`}
      />

      <button
        onClick={handleCreate}
        disabled={submitting || !title.trim() || !activeWorkspace?._id}
        className={`w-full ${dashboardPrimaryBg} ${dashboardPrimaryBgHover} disabled:opacity-50 ${dashboardPrimaryText} text-sm font-semibold py-1.5 rounded transition-colors`}
      >
        {submitting ? 'Creating...' : 'Create'}
      </button>
    </div>
  )
}

// User Menu

function UserMenu({ onClose }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
    onClose()
  }

  return (
    <div className="premium-card animate-enter absolute right-0 top-10 z-50 w-64 rounded-2xl py-2">
      <div className={`px-4 py-3 border-b ${dashboardBorderColor}`}>
        <p className="text-sm font-semibold text-white">
          {currentUser?.name || 'Kanvora User'}
        </p>
        <p className={`text-xs ${dashboardMutedColor}`}>
          {currentUser?.email || ''}
        </p>
        <span
          className={`text-[10px] bg-[#ff4d67]/20 ${dashboardPrimaryBg.replace('bg-', 'text-')} px-2 py-0.5 rounded-full mt-1 inline-block font-medium`}
        >
          {currentUser?.role || 'VIEWER'}
        </span>
      </div>

      <button
        onClick={() => {
          navigate('/main-page/profile')
          onClose()
        }}
        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm ${dashboardTextColor} hover:bg-[#27272a] hover:text-white transition-colors`}
      >
        <BsPerson /> Profile
      </button>
      <button
        onClick={() => {
          navigate('/workspaces/settings')
          onClose()
        }}
        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm ${dashboardTextColor} hover:bg-[#27272a] hover:text-white transition-colors`}
      >
        <BsGear /> Settings
      </button>

      <hr className={`${dashboardBorderColor} my-1`} />

      <button
        onClick={handleLogout}
        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm ${errorText} hover:bg-[#27272a] transition-colors`}
      >
        <BsBoxArrowRight /> Log out
      </button>
    </div>
  )
}

// Navbar

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { viewMode, setViewMode } = useProjectStore()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const { unreadCount, fetchNotifications, bindUserRoom } = useNotificationStore()
  const showViewSwitcher = location.pathname === '/main-page'

  // join personal socket room + initial fetch
  useEffect(() => {
    if (currentUser?._id) {
      bindUserRoom(currentUser._id)
      fetchNotifications()
    }
  }, [currentUser?._id, bindUserRoom, fetchNotifications])

  //close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowUserMenu(false)
      setShowFeatures(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header
      className={`${navbarWrap} min-w-0`}
      onClick={(e) => e.stopPropagation()}
    >
      {onToggleSidebar && (
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onToggleSidebar}
          className={`${navbarIconBtn} lg:hidden shrink-0`}
        >
          <BsList className="text-lg" />
        </button>
      )}

      {/* logo */}
      <button
        type="button"
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 transition-colors hover:bg-white/[0.08]"
        onClick={() => navigate('/main-page')}
      >
        <img src={kanvoraLogo} alt="Kanvora" className="w-5 h-5 rounded" />
        <span className="text-white font-bold text-sm">Kanvora</span>
      </button>

      {/* nav links */}
      <div className="hidden md:flex items-center gap-0.5 ml-1">
        {navLinks.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(`/${label.toLowerCase()}`)}
            className={navbarBtn}
          >
            {label}
          </button>
        ))}

        {/* Features dropdown */}
        {showViewSwitcher && (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowFeatures((v) => !v)
                setShowUserMenu(false)
              }}
              className={`flex items-center gap-1 px-2.5 h-8 rounded text-sm font-medium transition-colors ${
                showFeatures
                  ? 'bg-[#e63d581a] text-[#ff8aa0]'
                  : `${dashboardTextColor} ${dashboardSurfaceHover} hover:text-white`
              }`}
            >
              Features
              <BsChevronDown className={`text-[10px] transition-transform duration-200 ${showFeatures ? 'rotate-180' : ''}`} />
            </button>

            {showFeatures && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFeatures(false)}
                />
                <div className="animate-enter absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-1.5 shadow-2xl backdrop-blur-2xl">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#a3a3ad]">
                    Switch View
                  </div>
                  {[
                    {
                      id: 'kanban',
                      label: 'Kanban',
                      icon: <BsGrid3X3Gap />,
                      description: 'Organize tasks visually on dynamic boards.'
                    },
                    {
                      id: 'table',
                      label: 'Table',
                      icon: <BsTable />,
                      description: 'View tasks in a spreadsheet-style grid.'
                    },
                    {
                      id: 'calendar',
                      label: 'Calendar',
                      icon: <BsCalendar3 />,
                      description: 'Schedule tasks and track timelines.'
                    },
                    {
                      id: 'analytics',
                      label: 'Analytics',
                      icon: <BsBarChart />,
                      description: 'Gain insights into workload and metrics.'
                    },
                    {
                      id: 'list',
                      label: 'List',
                      icon: <BsListUl />,
                      description: 'Focus on clean check-lists and to-dos.'
                    },
                    {
                      id: 'activity',
                      label: 'Activity',
                      icon: <BsActivity />,
                      description: 'Track changes and see recent workspace activity.'
                    }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setViewMode(option.id)
                        setShowFeatures(false)
                      }}
                      className={`group flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition ${
                        viewMode === option.id
                          ? 'bg-[#ff4d67]/10 text-white'
                          : 'text-[var(--dash-text-dark)] hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <span
                        className={`text-lg p-2 rounded-lg bg-white/[0.03] transition-colors mt-0.5 ${
                          viewMode === option.id
                            ? 'text-[#ff4d67] bg-[#ff4d67]/10'
                            : 'text-[#a3a3ad] group-hover:text-white group-hover:bg-white/[0.08]'
                        }`}
                      >
                        {option.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{option.label}</span>
                          {viewMode === option.id && (
                            <div className="ml-1 h-1.5 w-1.5 rounded-full bg-[#ff4d67] shadow-[0_0_8px_#ff4d67]" />
                          )}
                        </div>
                        <span className="block text-[10px] mt-0.5 leading-relaxed text-[#8c9bab] group-hover:text-white/70">
                          {option.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* search - centred */}
      <div className="flex-1 flex justify-end md:justify-center px-1 sm:px-4 min-w-0">
        <div className="relative flex items-center transition-all duration-200 w-full max-w-[12rem] sm:max-w-[16rem] lg:max-w-[20rem]">
          <BsSearch
            className={`absolute left-2.5 ${dashboardMutedColor} text-sm pointer-events-none`}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full ${dashboardPanelElevated} border ${dashboardBorderColor} rounded-lg h-8 pl-8 pr-3 text-sm ${dashboardTextColor} placeholder:text-[#8c9bab] focus:outline-none focus:border-[#ff4d67] focus:bg-[#050505] ${dashboardFocusRing} transition-all duration-200 ${
              searchFocused ? 'md:max-w-[20rem]' : ''
            }`}
          />
        </div>
      </div>

      {/* right icons */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* notifications with badge */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate('/main-page/notifications')}
            className={navbarIconBtn}
          >
            <BsBell className="text-base" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#e11d48] rounded-full text-[9px] text-white font-bold flex items-center justify-center ring-2 ring-[#09090b]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        {/* user avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowUserMenu((v) => !v)
              setShowFeatures(false)
            }}
            className={`w-8 h-8 rounded-full ${dashboardPrimaryBg} flex items-center justify-center ${dashboardPrimaryText} text-xs font-bold ml-1 hover:opacity-90 transition-opacity`}
          >
            {currentUser?.profilePic ? (
              <img
                src={currentUser.profilePic}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(currentUser?.name)
            )}
          </button>
          {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
        </div>
      </div>
    </header>
  )
}

export default Navbar
