// Navbar component: renders a focused piece of the Trello clone UI.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsBell,
  BsQuestionCircle,
  BsSearch,
  BsPlusLg,
  BsX,
  BsBoxArrowRight,
  BsGear,
  BsPerson
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useAuth } from '../store/authStore'
import { useProjectStore } from '../store/projectStore'
import { useWorkspaceStore } from '../store/workspaceStore'

const navLinks = ['Workspaces', 'Templates']

// Create Project Dropdown

function CreateProjectDropdown({ onClose }) {
  const [title, setTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState('from-blue-500 to-blue-700')

  const [isPublished, setIsPublished] = useState(false)
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
  isPublished
})
    setSubmitting(false)
    if (project) {
      toast.success('Project created!')
      onClose()
    }
  }

  return (
    <div className="absolute top-10 left-0 z-50 w-72 bg-[#2c333a] border border-[#454f59] rounded-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white text-center flex-1">
          Create project
        </h3>
        <button onClick={onClose} className="text-[#9fadbc] hover:text-white">
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

      <label className="text-xs text-[#9fadbc] font-semibold block mb-1">
        Project title <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        autoFocus
        placeholder="My project"
        className="w-full bg-[#1d2125] border border-[#454f59] rounded px-3 py-1.5 text-sm text-white placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] mb-3"
      />



      <button
        onClick={handleCreate}
        disabled={submitting || !title.trim() || !activeWorkspace?._id}
        className="w-full bg-[#579dff] hover:bg-[#85b8ff] disabled:opacity-50 text-[#1d2125] text-sm font-semibold py-1.5 rounded transition-colors"
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
    <div className="absolute right-0 top-10 z-50 w-64 bg-[#2c333a] border border-[#454f59] rounded-xl shadow-2xl py-2">
      <div className="px-4 py-3 border-b border-[#454f59]">
        <p className="text-sm font-semibold text-white">
          {currentUser?.name || 'Trello User'}
        </p>
        <p className="text-xs text-[#9fadbc]">{currentUser?.email || ''}</p>
        <span className="text-[10px] bg-[#579dff]/20 text-[#579dff] px-2 py-0.5 rounded-full mt-1 inline-block font-medium">
          {currentUser?.role || 'VIEWER'}
        </span>
      </div>

      <button
        onClick={() => {
          navigate('/main-page/profile')
          onClose()
        }}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#b6c2cf] hover:bg-[#454f59] hover:text-white transition-colors"
      >
        <BsPerson /> Profile
      </button>
      <button
        onClick={() => {
          navigate('/main-page/settings')
          onClose()
        }}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#b6c2cf] hover:bg-[#454f59] hover:text-white transition-colors"
      >
        <BsGear /> Settings
      </button>

      <hr className="border-[#454f59] my-1" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-[#454f59] transition-colors"
      >
        <BsBoxArrowRight /> Log out
      </button>
    </div>
  )
}

// Navbar

function Navbar() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { joinUserRoom } = useProjectStore()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const unreadCount = 0

  //join personal socket room for notification badge updates
  useEffect(() => {
    if (currentUser?._id) {
      joinUserRoom(currentUser._id)
    }
  }, [currentUser?._id, joinUserRoom])

  //close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowCreate(false)
      setShowUserMenu(false)
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
      className="flex items-center h-12 px-2 gap-1 bg-[#1d2125] border-b border-[#2c333a] sticky top-0 z-40"
      onClick={(e) => e.stopPropagation()}
    >
      {/* logo */}
      <button
        type="button"
        className="flex items-center gap-1.5 px-2 h-8 rounded hover:bg-[#2c333a] transition-colors shrink-0"
        onClick={() => navigate('/main-page')}
      >
        <img
          className="w-5 h-5"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAXVBMVEUygs3///8Wecrk7PefvuMkfcve6PUee8vB1u7F2e/O4PLK3PAsgMxgmtb6/P4pfsypx+jr8/qPteCWuuM8iNCwy+l4qNsQd8pTldXY5fSJst9GjtJuo9nm7/mnxOazNwU+AAAB1ElEQVR4nO3d3VLiMBiA4VItoVIsPyrgut7/Za7uerAn0GQMnc+Z57mAb/JOA2dJmgYAAAAAAAAAAAAAAOD2hpTaDKkbcoZ1ecNSzrA6hrTZnpcZ1oenNDktPR3WOcPO281cjcPQL3I97tuJae3hMXtan7UnKgTuspf0YXv9K3bPJcN2wxyJaV2ypsXiZbwybHwpG9ZPbYkKxk3Zmha745Vpx6L98GFz+4+YirbVp9PlRQ2n0mHP039d39WeSxe1v7xNu33psPPtt2l7V7qo++5y4X3psDuFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFP7pwfC0d9tPOzAy/SodNHPYLV9gcl4XDZji7Vrew9KzfHOcP6xY2XdEvcTnHMdnKhU16+509adXMcUi2dmEzDm/vq//1/6y/PHxZv5/mOctdvbAZxpRnprPq9QujUagwPoUK41OoMD6FCuNTqDA+hQrjU6gwPoUK41OoMD6FCuNTqDC+qvcIh1T1LuiQ6t7nHVLKv1X/r6t3sodU9179mLpVdt/02wghfb5v8ZDzJEWf875FTFXfKAEAAAAAAAAAAAAAAAjlD7dCOFY7T154AAAAAElFTkSuQmCC"
          alt="Trello"
        />
        <span className="text-white font-bold text-sm">Trello</span>
      </button>

      {/* nav links */}
      <div className="flex items-center gap-0.5 ml-1">
        {navLinks.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(`/${label.toLowerCase()}`)}
            className="flex items-center gap-1 px-2.5 h-8 rounded text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white text-sm font-medium transition-colors"
          >
            {label}
          </button>
        ))}

        {/* create button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowCreate((v) => !v)
              setShowUserMenu(false)
            }}
            className="flex items-center gap-1.5 px-3 h-8 rounded bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold transition-colors ml-1"
          >
            <BsPlusLg className="text-xs" />
            Create
          </button>
          {showCreate && (
            <CreateProjectDropdown onClose={() => setShowCreate(false)} />
          )}
        </div>
      </div>

      {/* search - centred */}
      <div className="flex-1 flex justify-center px-4">
        <div
          className="relative flex items-center transition-all duration-200"
          style={{ width: searchFocused ? '20rem' : '14rem' }}
        >
          <BsSearch className="absolute left-2.5 text-[#9fadbc] text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-[#2c333a] border border-[#454f59] rounded h-8 pl-8 pr-3 text-sm text-[#b6c2cf] placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] focus:bg-[#1d2125] transition-all duration-200"
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
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#2c333a] text-[#9fadbc] hover:text-white transition-colors"
          >
            <BsBell className="text-base" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="Help"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#2c333a] text-[#9fadbc] hover:text-white transition-colors"
        >
          <BsQuestionCircle className="text-base" />
        </button>

        {/* user avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowUserMenu((v) => !v)
              setShowCreate(false)
            }}
            className="w-8 h-8 rounded-full bg-[#579dff] flex items-center justify-center text-[#1d2125] text-xs font-bold ml-1 hover:opacity-90 transition-opacity"
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


