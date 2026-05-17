// Sidebar component: renders a focused piece of the Trello clone UI.
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BsLayoutWtf,
  BsGridFill,
  BsHouseDoorFill,
  BsChevronDown,
  BsChevronRight,
  BsPeopleFill,
  BsGear,
  BsPlusLg
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useProjectStore } from '../store/projectStore'
import { useWorkspaceStore } from '../store/workspaceStore'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { projects } = useProjectStore()
  const {
    workspaces,
    activeWorkspace,
    fetchWorkspaces,
    createWorkspace,
    setActiveWorkspace
  } = useWorkspaceStore()
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [creatingWorkspace, setCreatingWorkspace] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error('Workspace name is required')
      return
    }
    try {
      await createWorkspace({ name: workspaceName.trim() })
      setWorkspaceName('')
      setCreatingWorkspace(false)
      navigate('/main-page')
      toast.success('Workspace created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create workspace')
    }
  }

  const topNav = [
    {
      id: 'home',
      label: 'Home',
      icon: <BsHouseDoorFill />,
      path: '/main-page'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <BsLayoutWtf />,
      path: '/templates'
    }
  ]

  const workspaceNav = [
    {
      id: 'ws-boards',
      label: 'Projects',
      icon: <BsGridFill />,
      path: '/main-page'
    },
    {
      id: 'members',
      label: 'Members',
      icon: <BsPeopleFill />,
      path: '/workspaces'
    },
    {
      id: 'ws-settings',
      label: 'Settings',
      icon: <BsGear />,
      path: '/main-page/settings/ws-settings'
    }
  ]

  //exact match for most links; startsWith for settings to keep it active on sub-routes
  const isActive = (path) => {
    if (path === '/main-page') return location.pathname === '/main-page'
    return location.pathname.startsWith(path)
  }

  const navItemClass = (path) =>
    `flex items-center gap-2.5 px-3 h-9 rounded text-sm font-medium w-full text-left transition-colors ${
      isActive(path)
        ? 'bg-[#85b8ff1a] text-[#579dff]'
        : 'text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white'
    }`

  const subNavItemClass = (path) =>
    `flex items-center gap-2.5 px-3 h-8 rounded text-sm w-full text-left transition-colors ${
      isActive(path)
        ? 'bg-[#85b8ff1a] text-[#579dff]'
        : 'text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white'
    }`

  return (
    <aside className="w-64 bg-[#1d2125] border-r border-[#2c333a] flex flex-col shrink-0 overflow-y-auto h-full">
      {/* top nav */}
      <nav className="p-2 flex flex-col gap-0.5 mt-1">
        {topNav.map(({ id, label, icon, path }) => (
          <button
            key={id}
            type="button"
            onClick={() => navigate(path)}
            className={navItemClass(path)}
          >
            <span className="text-base shrink-0">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <hr className="border-[#2c333a] mx-2 my-1" />

      {/* workspaces section */}
      <div className="p-2">
        <div className="flex items-center justify-between px-3 py-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c9bab]">
            Workspaces
          </p>
          <button
            type="button"
            onClick={() => setCreatingWorkspace((v) => !v)}
            className="text-[#8c9bab] hover:text-white"
            aria-label="Create workspace"
          >
            <BsPlusLg className="text-xs" />
          </button>
        </div>

        {creatingWorkspace && (
          <div className="px-2 pb-2">
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
              placeholder="Workspace name"
              className="w-full bg-[#101418] border border-[#454f59] rounded px-2 py-1.5 text-xs text-white placeholder:text-[#8c9bab] focus:outline-none focus:border-[#579dff]"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleCreateWorkspace}
                className="flex-1 rounded bg-[#579dff] px-2 py-1 text-xs font-semibold text-[#1d2125]"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setCreatingWorkspace(false)}
                className="rounded px-2 py-1 text-xs text-[#9fadbc] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* workspace toggle */}
        <button
          type="button"
          onClick={() => setWorkspaceOpen((o) => !o)}
          className="flex items-center justify-between w-full px-2 h-9 rounded hover:bg-[#2c333a] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(activeWorkspace?.name || 'W').slice(0, 1).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-[#b6c2cf] group-hover:text-white">
              {activeWorkspace?.name || 'No workspace'}
            </span>
          </div>
          {workspaceOpen ? (
            <BsChevronDown className="text-[#8c9bab] text-xs" />
          ) : (
            <BsChevronRight className="text-[#8c9bab] text-xs" />
          )}
        </button>

        {workspaceOpen && (
          <div className="flex flex-col gap-0.5 mt-0.5 ml-1">
            {workspaces.map((workspace) => (
              <button
                key={workspace._id}
                type="button"
                onClick={() => {
                  setActiveWorkspace(workspace)
                  navigate('/main-page')
                }}
                className={`flex items-center gap-2.5 px-3 h-8 rounded text-sm w-full text-left transition-colors ${
                  activeWorkspace?._id === workspace._id
                    ? 'bg-[#85b8ff1a] text-[#579dff]'
                    : 'text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white'
                }`}
              >
                <span className="w-4 h-4 rounded bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                  {workspace.name?.slice(0, 1).toUpperCase() || 'W'}
                </span>
                <span className="truncate">{workspace.name}</span>
              </button>
            ))}
            {workspaceNav.map(({ id, label, icon, path }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(path)}
                className={subNavItemClass(path)}
              >
                <span className="text-sm shrink-0">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <hr className="border-[#2c333a] mx-2 my-1" />

      {/* your projects */}
      <div className="p-2 flex-1">
        <button
          type="button"
          onClick={() => setProjectsOpen((o) => !o)}
          className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c9bab] hover:text-white transition-colors"
        >
          <span>Your Projects</span>
          {projectsOpen ? (
            <BsChevronDown className="text-xs" />
          ) : (
            <BsChevronRight className="text-xs" />
          )}
        </button>

        {projectsOpen && (
          <div className="flex flex-col gap-0.5 mt-1">
            {projects.slice(0, 8).map((project) => (
              <button
                key={project._id}
                type="button"
                onClick={() => navigate(`/projects/${project._id}`)}
                className={`flex items-center gap-2.5 px-3 h-8 rounded text-sm w-full text-left transition-colors ${
                  location.pathname === `/projects/${project._id}`
                    ? 'bg-[#85b8ff1a] text-[#579dff]'
                    : 'text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded shrink-0 bg-linear-to-br ${
                    project.color || 'from-blue-500 to-blue-700'
                  }`}
                />
                <span className="truncate">{project.title || project.name}</span>
              </button>
            ))}

            {projects.length === 0 && (
              <p className="text-xs text-[#9fadbc] px-3 py-2">No projects yet.</p>
            )}

            <button
              type="button"
              onClick={() => navigate('/main-page')}
              className="flex items-center gap-2 px-3 h-8 rounded text-xs text-[#9fadbc] hover:bg-[#2c333a] hover:text-white transition-colors mt-0.5"
            >
              <BsPlusLg className="text-xs" /> Create a board
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar


