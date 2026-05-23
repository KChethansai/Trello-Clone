import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BsBoxArrowRight,
  BsChevronDown,
  BsGear,
  BsGridFill,
  BsList,
  BsPeopleFill,
  BsPersonPlusFill,
  BsPlusLg,
  BsSearch,
  BsX
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useProjectStore } from '../store/projectStore'
import { useWorkspaceStore } from '../store/workspaceStore'
import {
  buttonPrimary,
  buttonSecondary,
  cardInteractive,
  dashboardMutedColor,
  dangerButton,
  emptyStatePanel,
  fieldBase,
  headingPage,
  headingSection,
  iconButton
} from '../Styles/common'

const workspaceTabs = [
  { id: 'projects', label: 'Projects', icon: <BsGridFill /> },
  { id: 'members', label: 'Members', icon: <BsPeopleFill /> },
  { id: 'settings', label: 'Settings', icon: <BsGear /> }
]

const personalSettings = [
  { label: 'Profile and Visibility', path: '/main-page/settings/profile' },
  { label: 'Activity', path: '/main-page/settings/activity' },
  { label: 'Cards', path: '/main-page/settings/cards' },
  { label: 'Settings', path: '/main-page/settings/settings' }
]

const memberTabs = [
  { id: 'members', label: 'Members' },
  { id: 'single', label: 'Single-project guests' },
  { id: 'multi', label: 'Multi-project guests' },
  { id: 'join', label: 'Join requests' }
]

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-teal-400 to-cyan-600',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-indigo-600'
]

const getInitials = (name = 'Member') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'M'

function ProjectsPanel({ navigate, projects, activeWorkspace }) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={headingPage}>
            {activeWorkspace?.name || 'Workspace'} projects
          </h1>
          <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
            Recent project spaces connected to this workspace.
          </p>
        </div>
        <button
          onClick={() => navigate('/main-page')}
          className={buttonPrimary}
        >
          <BsPlusLg /> Go to dashboard
        </button>
      </div>
      {projects.length === 0 ? (
        <div className={emptyStatePanel}>
          <h3 className="font-semibold text-white">No projects yet</h3>
          <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
            Create the first project from your dashboard.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className={`group h-32 overflow-hidden rounded-xl bg-linear-to-br ${project.color || 'from-blue-500 to-blue-700'} p-4 text-left shadow-xl transition hover:-translate-y-0.5`}
            >
              <span className="text-sm font-bold text-white drop-shadow">
                {project.title || project.name}
              </span>
              <span className="mt-14 block text-xs text-white/80">
                Open board
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function MembersPanel({
  activeWorkspace,
  projects,
  inviteMember,
  removeMember
}) {
  const [activeMemberTab, setActiveMemberTab] = useState('members')
  const [filterText, setFilterText] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [submittingInvite, setSubmittingInvite] = useState(false)

  const members = useMemo(
    () =>
      (activeWorkspace?.members || []).map((member, index) => {
        const user = member.user || {}
        const name = user.name || user.email || 'Workspace member'
        const userId = user._id || member.user
        return {
          id: userId || `${name}-${index}`,
          name,
          email: user.email || '',
          role: member.role || 'MEMBER',
          avatar: getInitials(name),
          color: avatarColors[index % avatarColors.length],
          projects: projects.filter((project) =>
            project.members?.some((projectMember) => {
              const projectMemberId = projectMember?._id || projectMember
              return projectMemberId?.toString() === userId?.toString()
            })
          ).length
        }
      }),
    [activeWorkspace?.members, projects]
  )

  const filtered = members.filter((member) =>
    `${member.name} ${member.email}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  )
  const counts = { members: members.length, single: 0, multi: 0, join: 0 }

  const handleInvite = async () => {
    if (!activeWorkspace?._id || !inviteEmail.trim()) return
    try {
      setSubmittingInvite(true)
      const result = await inviteMember(activeWorkspace._id, inviteEmail.trim())
      setShowInviteModal(false)
      setInviteEmail('')
      toast.success('Member invited')
      if (result?.warning) toast.warning(result.warning)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not invite member')
    } finally {
      setSubmittingInvite(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!activeWorkspace?._id || !userId) return
    try {
      await removeMember(activeWorkspace._id, userId)
      toast.success('Member removed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove member')
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={headingPage}>Collaborators</h1>
          <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
            Manage who can view, join, and contribute to workspace projects.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className={buttonPrimary}
        >
          <BsPersonPlusFill /> Invite members
        </button>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2c333a] bg-[#1d2125] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className={headingSection}>Invite to workspace</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className={iconButton}
                aria-label="Close invite modal"
              >
                <BsX />
              </button>
            </div>
            <input
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="Enter email address..."
              className={fieldBase}
              autoFocus
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleInvite}
                disabled={submittingInvite || !inviteEmail.trim()}
                className={`${buttonPrimary} flex-1`}
              >
                {submittingInvite ? 'Sending...' : 'Send invite'}
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className={buttonSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto app-scrollbar">
          {memberTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveMemberTab(id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeMemberTab === id
                  ? 'bg-[#0d9488] text-[#ffffff]'
                  : 'bg-[#22272b] text-[#b6c2cf] hover:text-white'
              }`}
            >
              {label} ({counts[id]})
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <BsSearch
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${dashboardMutedColor}`}
          />
          <input
            type="text"
            placeholder="Filter members"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            className={`${fieldBase} pl-9`}
          />
        </div>
      </div>

      {activeMemberTab === 'members' ? (
        <div className="grid gap-2">
          {filtered.length === 0 ? (
            <div className={emptyStatePanel}>
              No members match "{filterText}".
            </div>
          ) : (
            filtered.map((member) => (
              <div
                key={member.id}
                className={`${cardInteractive} flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${member.color} text-sm font-bold text-white`}
                  >
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {member.name}
                    </p>
                    <p className={`truncate text-xs ${dashboardMutedColor}`}>
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className={buttonSecondary}>
                    Projects ({member.projects}) <BsChevronDown />
                  </button>
                  <button className={buttonSecondary}>
                    {member.role.toLowerCase()} <BsChevronDown />
                  </button>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className={dangerButton}
                  >
                    <BsBoxArrowRight /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className={emptyStatePanel}>
          No{' '}
          {memberTabs
            .find((tab) => tab.id === activeMemberTab)
            ?.label.toLowerCase()}{' '}
          yet.
        </div>
      )}
    </section>
  )
}

function WorkspaceSettingsPanel() {
  const { activeWorkspace, updateWorkspace } = useWorkspaceStore()
  const [workspaceName, setWorkspaceName] = useState(
    activeWorkspace?.name || 'Workspace'
  )
  const [editing, setEditing] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)

  useEffect(() => {
    setWorkspaceName(activeWorkspace?.name || 'Workspace')
  }, [activeWorkspace?.name])

  const handleSave = async () => {
    if (!activeWorkspace?._id) return
    try {
      await updateWorkspace(activeWorkspace._id, { name: workspaceName })
      setEditing(false)
      toast.success('Workspace updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update workspace')
    }
  }

  return (
    <section className="max-w-3xl">
      <h1 className={headingPage}>Workspace settings</h1>
      <div className="mt-6 rounded-2xl border border-[#2c333a] bg-[#1d2125] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-teal-400 to-cyan-600 text-xl font-bold text-white">
            {(workspaceName || 'W').slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                className={fieldBase}
                autoFocus
              />
            ) : (
              <p className="font-semibold text-white">{workspaceName}</p>
            )}
            <p className={`text-xs ${dashboardMutedColor}`}>
              Private workspace
            </p>
          </div>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className={buttonSecondary}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#2c333a] bg-[#1d2125] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={headingSection}>AI features</h3>
            <p className={`mt-1 text-sm ${dashboardMutedColor}`}>
              AI is {aiEnabled ? 'activated' : 'deactivated'} for all projects.
            </p>
          </div>
          <button
            onClick={() => setAiEnabled((enabled) => !enabled)}
            className={`relative h-7 w-12 rounded-full transition-colors ${aiEnabled ? 'bg-[#0d9488]' : 'bg-[#e5e7eb]'}`}
            aria-pressed={aiEnabled}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${aiEnabled ? 'left-6' : 'left-1'}`}
            />
          </button>
        </div>
      </div>
    </section>
  )
}

function WorkSpaces() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('members')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [creatingWorkspace, setCreatingWorkspace] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const { projects, fetchProjects } = useProjectStore()
  const {
    workspaces,
    activeWorkspace,
    fetchWorkspaces,
    fetchWorkspace,
    createWorkspace,
    setActiveWorkspace,
    inviteMember,
    removeMember
  } = useWorkspaceStore()

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  useEffect(() => {
    if (activeWorkspace?._id) fetchProjects(activeWorkspace._id)
  }, [activeWorkspace?._id, fetchProjects])

  useEffect(() => {
    if (activeWorkspace?._id) fetchWorkspace(activeWorkspace._id)
  }, [activeWorkspace?._id, fetchWorkspace])

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error('Workspace name is required')
      return
    }
    try {
      await createWorkspace({ name: workspaceName.trim() })
      setWorkspaceName('')
      setCreatingWorkspace(false)
      toast.success('Workspace created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create workspace')
    }
  }

  const renderPanel = () => {
    if (activeTab === 'projects') {
      return (
        <ProjectsPanel
          navigate={navigate}
          projects={projects}
          activeWorkspace={activeWorkspace}
        />
      )
    }
    if (activeTab === 'settings') return <WorkspaceSettingsPanel />
    return (
      <MembersPanel
        activeWorkspace={activeWorkspace}
        projects={projects}
        inviteMember={inviteMember}
        removeMember={removeMember}
      />
    )
  }

  const sidebar = (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-[#18181b] bg-[#09090b] p-4">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="font-semibold text-white">Workspace</p>
        <button
          onClick={() => setSidebarOpen(false)}
          className={iconButton}
          aria-label="Close sidebar"
        >
          <BsX />
        </button>
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
        Personal settings
      </p>
      <nav className="mb-4 flex flex-col gap-1">
        {personalSettings.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`rounded-lg px-3 py-2 text-left text-sm transition ${
              location.pathname === item.path
                ? 'bg-[#e63d581a] text-[#ff8aa0]'
                : 'text-[#d7dde4] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="my-2 border-t border-[#18181b]" />
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
          Workspaces
        </p>
        <button
          onClick={() => setCreatingWorkspace((value) => !value)}
          className={iconButton}
          aria-label="Create workspace"
        >
          <BsPlusLg />
        </button>
      </div>

      {creatingWorkspace && (
        <div className="mb-3 rounded-xl bg-[#1d2125] p-2">
          <input
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            onKeyDown={(event) =>
              event.key === 'Enter' && handleCreateWorkspace()
            }
            placeholder="Workspace name"
            className={fieldBase}
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleCreateWorkspace}
              className={`${buttonPrimary} flex-1`}
            >
              Add
            </button>
            <button
              onClick={() => setCreatingWorkspace(false)}
              className={buttonSecondary}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1 overflow-y-auto app-scrollbar">
        {workspaces.map((workspace) => (
          <button
            key={workspace._id}
            onClick={() => setActiveWorkspace(workspace)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              activeWorkspace?._id === workspace._id
                ? 'bg-[#e63d581a] text-[#ff8aa0]'
                : 'text-[#d7dde4] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-teal-400 to-cyan-600 text-[10px] font-bold text-white">
              {workspace.name?.slice(0, 1).toUpperCase() || 'W'}
            </span>
            <span className="truncate">{workspace.name}</span>
          </button>
        ))}
      </nav>

      <div className="my-4 border-t border-[#18181b]" />
      <nav className="flex flex-col gap-1">
        {workspaceTabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id)
              setSidebarOpen(false)
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              activeTab === id
                ? 'bg-[#e63d581a] text-[#ff8aa0]'
                : 'text-[#d7dde4] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-[#f4f4f5]">
      <div className="hidden lg:block">{sidebar}</div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative">{sidebar}</div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-[#18181b] px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className={iconButton}
            aria-label="Open sidebar"
          >
            <BsList />
          </button>
          <span className="font-semibold text-white">
            {activeWorkspace?.name || 'Workspace'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 app-scrollbar sm:p-6 lg:p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  )
}

export default WorkSpaces
