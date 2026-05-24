import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  BsActivity,
  BsGear,
  BsGrid3X3Gap,
  BsPeopleFill,
  BsPerson,
  BsShieldCheck,
  BsX
} from 'react-icons/bs'

import { useWorkspaceStore } from '../store/workspaceStore'

import {
  dashboardTextColor,
  fieldBase,
  iconButton,
  buttonGhost
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

function ProfileAndVisibilityPanel() {
  return (
    <div className="text-white text-2xl font-bold">
      Profile and Visibility
    </div>
  )
}

function ActivityPanel() {
  return (
    <div className="text-white text-2xl font-bold">
      Activity
    </div>
  )
}

function WorkspaceProjectsPanel() {
  return (
    <div className="text-white text-2xl font-bold">
      Workspace Projects
    </div>
  )
}

function MembersSettingsPanel() {
  return (
    <div className="text-white text-2xl font-bold">
      Workspace Members
    </div>
  )
}

function WorkspaceSettingsPanel() {
  return (
    <div className="text-white text-2xl font-bold">
      Workspace Settings
    </div>
  )
}

function PersonalSettingsPanel() {
  return (
    <div className="text-white text-2xl font-bold">
      Personal Settings
    </div>
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

  const allNavItems = useMemo(
    () => [...personalNav, ...workspaceNav],
    []
  )

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
              onClick={() => navigate(`/workspaces/settings/${id}`)}
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
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-xs font-bold text-white">
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
              onClick={() => navigate(`/workspaces/settings/${id}`)}
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
              navigate(`/workspaces/settings/${event.target.value}`)
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
