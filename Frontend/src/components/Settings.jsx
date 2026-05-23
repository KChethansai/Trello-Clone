import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  BsActivity,
  BsGear,
  BsGrid3X3Gap,
  BsPeopleFill,
  BsPerson,
  BsShieldCheck,
  BsX
} from 'react-icons/bs'
import { API_BASE_URL } from '../config/api'
import { useAuth } from '../store/authStore'
import { useWorkspaceStore } from '../store/workspaceStore'
import {
  buttonGhost,
  buttonSecondary,
  dangerButton,
  dashboardBgColor,
  dashboardBorderColor,
  dashboardMutedColor,
  dashboardPrimaryBg,
  dashboardPrimaryBgHover,
  dashboardPrimaryText,
  dashboardSurfaceColor,
  dashboardSurfaceHover,
  dashboardTextColor,
  fieldBase,
  headingPage,
  headingSection,
  iconButton
} from '../Styles/common'

const personalNav = [
  { id: 'profile', label: 'Profile and Visibility', icon: <BsPerson /> },
  { id: 'activity', label: 'Activity', icon: <BsActivity /> },
  { id: 'settings', label: 'Settings', icon: <BsGear /> }
]

const workspaceNav = [
  { id: 'projects', label: 'Projects', icon: <BsGrid3X3Gap /> },
  { id: 'members', label: 'Members', icon: <BsPeopleFill /> },
  { id: 'ws-settings', label: 'Settings', icon: <BsGear /> }
]


const getInitials = (name = 'User') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.max(0, Math.floor(diff / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}


function ProfileAndVisibilityPanel() {
  const { currentUser, updateProfile, checkAuth } = useAuth()
  const [visibleToWorkspace, setVisibleToWorkspace] = useState(true)
  const [saving, setSaving] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      username: currentUser?.username || '',
      bio: currentUser?.bio || ''
    }
  })

  useEffect(() => {
    reset({
      name: currentUser?.name || '',
      username: currentUser?.username || '',
      bio: currentUser?.bio || ''
    })
  }, [currentUser, reset])

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      await updateProfile({
        name: data.name?.trim(),
        username: data.username?.trim(),
        bio: data.bio?.trim()
      })
      await checkAuth()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="max-w-3xl">
      <h2 className={headingPage}>Profile and Visibility</h2>

      <div
        className={`mt-6 rounded-2xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-5`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${dashboardPrimaryBg} text-2xl font-bold ${dashboardPrimaryText}`}
          >
            {currentUser?.profilePic ? (
              <img
                src={currentUser.profilePic}
                alt="avatar"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(currentUser?.name)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-white">
              {currentUser?.name || 'Kanvora User'}
            </p>
            <p className={`truncate text-sm ${dashboardMutedColor}`}>
              {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${dashboardMutedColor}`}
            >
              Full Name
            </label>
            <input
              className={fieldBase}
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${dashboardMutedColor}`}
            >
              Username
            </label>
            <input
              className={fieldBase}
              placeholder="@username"
              {...register('username')}
            />
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${dashboardMutedColor}`}
            >
              Bio
            </label>
            <textarea
              rows={4}
              className={`${fieldBase} resize-none`}
              placeholder="Tell your team what you are focused on."
              {...register('bio')}
            />
          </div>

          <div>
            <label
              className={`mb-1.5 block text-xs font-semibold ${dashboardMutedColor}`}
            >
              Email
            </label>
            <input
              value={currentUser?.email || ''}
              readOnly
              className={`w-full cursor-default rounded-lg border ${dashboardBorderColor} ${dashboardBgColor} px-3 py-2 text-sm ${dashboardTextColor}`}
            />
          </div>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border ${dashboardBorderColor} ${dashboardBgColor} p-4 text-sm text-white`}
          >
            <input
              type="checkbox"
              checked={visibleToWorkspace}
              onChange={(event) => setVisibleToWorkspace(event.target.checked)}
              className="mt-1"
            />
            <span>
              Make profile visible to workspace members
              <span className={`block text-xs ${dashboardMutedColor}`}>
                This setting is stored locally for now.
              </span>
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className={`mt-6 inline-flex items-center justify-center rounded-lg ${dashboardPrimaryBg} ${dashboardPrimaryBgHover} px-5 py-2 text-sm font-semibold ${dashboardPrimaryText} transition-colors disabled:opacity-50`}
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </section>
  )
}

function ActivityPanel() {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const fetchActivity = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_BASE_URL}/notifications`, {
          withCredentials: true
        })
        if (!ignore) setActivity(res.data.payload || [])
      } catch {
        if (!ignore) setActivity([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchActivity()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="max-w-4xl">
      <h2 className={headingPage}>Activity</h2>

      <div
        className={`mt-6 overflow-hidden rounded-2xl border ${dashboardBorderColor} ${dashboardSurfaceColor}`}
      >
        {loading ? (
          <div className="grid gap-3 p-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={`animate-pulse rounded-xl ${dashboardSurfaceColor} p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full ${dashboardBgColor}`} />
                  <div className="flex-1">
                    <div className={`h-3 w-2/3 rounded ${dashboardBgColor}`} />
                    <div
                      className={`mt-2 h-2 w-24 rounded ${dashboardBgColor}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <BsActivity className={`mb-3 text-3xl ${dashboardMutedColor}`} />
            <p className="font-semibold text-white">No recent activity</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto app-scrollbar">
            {activity.map((item) => (
              <div
                key={item._id}
                className={`flex items-start gap-3 border-b ${dashboardBorderColor} px-5 py-4 last:border-b-0 ${dashboardSurfaceHover} transition-colors`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${dashboardBgColor} ${dashboardTextColor}`}
                >
                  <BsActivity />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${dashboardTextColor}`}>
                    {item.message || item.title || 'Workspace activity updated'}
                  </p>
                  <p className={`mt-1 text-xs ${dashboardMutedColor}`}>
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


function WorkspaceProjectsPanel() {
  const navigate = useNavigate()
  const { activeWorkspace } = useWorkspaceStore()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const fetchProjects = async () => {
      try {
        setLoading(true)
        const url = activeWorkspace?._id
          ? `${API_BASE_URL}/projects-api/projects?workspaceId=${encodeURIComponent(activeWorkspace._id)}`
          : `${API_BASE_URL}/projects-api/projects`
        const res = await axios.get(url, { withCredentials: true })
        if (!ignore) setProjects(res.data.payload || [])
      } catch {
        if (!ignore) setProjects([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProjects()
    return () => {
      ignore = true
    }
  }, [activeWorkspace?._id])

  return (
    <section className="max-w-4xl">
      <h2 className={headingPage}>Workspace Projects</h2>
      <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
        Projects connected to{' '}
        {activeWorkspace?.name || 'your current workspace'}.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {loading ? (
          [0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-28 animate-pulse rounded-xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-4`}
            >
              <div className={`h-4 w-2/3 rounded ${dashboardBgColor}`} />
              <div className={`mt-3 h-3 w-1/3 rounded ${dashboardBgColor}`} />
            </div>
          ))
        ) : projects.length === 0 ? (
          <div
            className={`col-span-full rounded-2xl border border-dashed ${dashboardBorderColor} ${dashboardSurfaceColor} p-8 text-center`}
          >
            <BsGrid3X3Gap
              className={`mx-auto mb-3 text-3xl ${dashboardMutedColor}`}
            />
            <p className="font-semibold text-white">
              No workspace projects yet
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() => navigate(`/projects/${project._id}`)}
              className={`rounded-xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-4 text-left ${dashboardSurfaceHover} transition-colors`}
            >
              <p className="truncate text-sm font-semibold text-white">
                {project.title || project.name}
              </p>
              <p className={`mt-2 text-xs ${dashboardMutedColor}`}>
                {project.archivedAt ? 'Archived' : 'Active'} project
              </p>
            </button>
          ))
        )}
      </div>
    </section>
  )
}

function PersonalSettingsPanel() {
  const [freq, setFreq] = useState('periodically')
  const [notifAll, setNotifAll] = useState(true)
  const [notifComments, setNotifComments] = useState(true)

  const handleNotifAll = (checked) => {
    setNotifAll(checked)
    setNotifComments(checked)
  }

  return (
    <section className="max-w-3xl">
      <h2 className={headingPage}>Settings</h2>

      <div className="mt-8 grid gap-5">
        <section
          className={`rounded-2xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-5`}
        >
          <h3 className={headingSection}>Email notifications</h3>
          <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
            Email notifications can be sent instantly, periodically, or never.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {['never', 'periodically', 'instantly'].map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border ${dashboardBorderColor} p-3 text-sm capitalize transition ${
                  freq === opt
                    ? `${dashboardPrimaryBg} ${dashboardPrimaryText}`
                    : `${dashboardBgColor} text-white ${dashboardSurfaceHover}`
                }`}
              >
                <input
                  type="radio"
                  name="freq"
                  value={opt}
                  checked={freq === opt}
                  onChange={() => setFreq(opt)}
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={notifAll}
                onChange={(event) => handleNotifAll(event.target.checked)}
              />
              Select all notifications
            </label>
            <label className="ml-6 flex cursor-pointer items-start gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={notifComments}
                onChange={(event) => {
                  setNotifComments(event.target.checked)
                  if (!event.target.checked) setNotifAll(false)
                }}
                className="mt-1"
              />
              <span>
                Comments
                <span className={`block text-xs ${dashboardMutedColor}`}>
                  New comments added on cards you are watching
                </span>
              </span>
            </label>
          </div>
        </section>
      </div>
    </section>
  )
}

function WorkspaceSettingsPanel() {
  const { activeWorkspace } = useWorkspaceStore()
  const [aiEnabled, setAiEnabled] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const workspaceName = activeWorkspace?.name || 'Workspace'

  return (
    <section className="max-w-3xl">
      <h2 className={headingPage}>Workspace settings</h2>

      <div
        className={`mt-6 rounded-2xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-5`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${dashboardPrimaryBg} text-xl font-bold ${dashboardPrimaryText}`}
          >
            {(workspaceName || 'W').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">
              {workspaceName}
            </p>
            <p className={`text-xs ${dashboardMutedColor}`}>
              Private workspace
            </p>
          </div>
          <BsShieldCheck className={`text-xl ${dashboardTextColor}`} />
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-5`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className={headingSection}>AI features</h3>
            <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
              AI is {aiEnabled ? 'activated' : 'deactivated'} for all projects.
            </p>
          </div>
          <button
            onClick={() => setAiEnabled((enabled) => !enabled)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              aiEnabled ? dashboardPrimaryBg : dashboardBgColor
            }`}
            aria-pressed={aiEnabled}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                aiEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-5`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Delete workspace
            </h3>
            <p className={`mt-1 text-xs ${dashboardMutedColor}`}>
              Permanently deletes all projects and cards. This cannot be undone.
            </p>
          </div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={dangerButton}
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button className={dangerButton}>Yes, delete</button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={buttonSecondary}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function MembersSettingsPanel() {
  const { activeWorkspace } = useWorkspaceStore()
  const members = activeWorkspace?.members || []

  return (
    <section className="max-w-4xl">
      <h2 className={headingPage}>Workspace members</h2>
      {members.length === 0 ? (
        <div
          className={`mt-6 rounded-2xl border border-dashed ${dashboardBorderColor} ${dashboardSurfaceColor} p-8 text-sm ${dashboardMutedColor}`}
        >
          No members found in this workspace.
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {members.map((member, index) => {
            const user = member.user || {}
            const name = user.name || user.email || 'Workspace Member'
            const initials = getInitials(name)

            return (
              <div
                key={user._id || index}
                className={`flex items-center justify-between rounded-xl border ${dashboardBorderColor} ${dashboardSurfaceColor} p-4`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${dashboardPrimaryBg} font-bold ${dashboardPrimaryText}`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className={`text-xs ${dashboardMutedColor}`}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full border ${dashboardBorderColor} ${dashboardBgColor} px-3 py-1 text-xs capitalize ${dashboardTextColor}`}
                >
                  {member.role?.toLowerCase() || 'member'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

const renderPanel = (active) => {
  switch (active) {
    case 'profile':
      return <ProfileAndVisibilityPanel />
    case 'activity':
      return <ActivityPanel />
    case 'projects':
      return <WorkspaceProjectsPanel />
    case 'members':
      return <MembersSettingsPanel />
    case 'ws-settings':
      return <WorkspaceSettingsPanel />
    case 'settings':
    default:
      return <PersonalSettingsPanel />
  }
}

function Settings() {
  const navigate = useNavigate()
  const { section } = useParams()
  const { activeWorkspace } = useWorkspaceStore()
  const active = section || 'settings'
  const workspaceName = activeWorkspace?.name || 'Workspace'

  const allNavItems = useMemo(() => [...personalNav, ...workspaceNav], [])
  const navItem = (isActive) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-[#e63d581a] text-[#ff8aa0]'
        : 'text-[#d7dde4] hover:bg-[#22272b] hover:text-white'
    }`

  return (
    <div className="fixed inset-x-0 bottom-0 top-12 z-30 flex overflow-hidden bg-[#09090b]">
      <aside className="hidden w-72 shrink-0 border-r border-[#18181b] bg-[#09090b] p-4 md:block">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
            Personal
          </p>
          <button
            onClick={() => navigate('/main-page')}
            className={iconButton}
            aria-label="Close settings"
          >
            <BsX />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {personalNav.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => navigate(`/main-page/settings/${id}`)}
              className={navItem(active === id)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="my-5 border-t border-[#18181b]" />
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
          Workspace
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#1d2125] px-3 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-teal-400 to-cyan-600 text-xs font-bold text-white">
            {(workspaceName || 'W').slice(0, 1).toUpperCase()}
          </span>
          <span
            className={`truncate text-sm font-medium ${dashboardTextColor}`}
          >
            {workspaceName}
          </span>
        </div>
        <nav className="mt-3 flex flex-col gap-1">
          {workspaceNav.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => navigate(`/main-page/settings/${id}`)}
              className={navItem(active === id)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 text-[#f4f4f5] app-scrollbar sm:p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <select
            value={active}
            onChange={(event) =>
              navigate(`/main-page/settings/${event.target.value}`)
            }
            className={`${fieldBase} max-w-xs`}
          >
            {allNavItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/main-page')}
            className={buttonGhost}
          >
            Close
          </button>
        </div>
        {renderPanel(active)}
      </main>
    </div>
  )
}

export default Settings
