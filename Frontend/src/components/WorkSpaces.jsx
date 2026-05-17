// WorkSpaces component: renders a focused piece of the Trello clone UI.
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BsGridFill,
  BsPeopleFill,
  BsGear,
  BsSearch,
  BsPersonPlusFill,
  BsChevronDown,
  BsBoxArrowRight,
  BsPlusLg
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useProjectStore } from '../store/projectStore'
import { useWorkspaceStore } from '../store/workspaceStore'

// Static data (replace with API calls when backend ready)
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

// Sub-panels

function ProjectsPanel({ navigate, projects, activeWorkspace }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-white">
          {activeWorkspace?.name || 'Workspace'} projects
        </h1>
        <button
          onClick={() => navigate('/main-page')}
          className="flex items-center gap-2 px-4 h-9 rounded bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold transition-colors"
        >
          <BsPlusLg className="text-xs" /> Create project
        </button>
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
      >
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/projects/${project._id}`)}
            className={`h-24 rounded-xl bg-linear-to-br ${project.color} relative cursor-pointer hover:opacity-90 transition-opacity`}
          >
            <span className="absolute bottom-2 left-3 text-white text-sm font-semibold drop-shadow">
              {project.title || project.name}
            </span>
          </div>
        ))}
        {/* create new */}
        <div
          onClick={() => navigate('/main-page')}
          className="h-24 rounded-xl bg-[#2c333a] hover:bg-[#353d47] flex items-center justify-center cursor-pointer transition-colors"
        >
          <span className="text-[#9fadbc] text-sm">Create new project</span>
        </div>
      </div>
    </div>
  )
}

function MembersPanel({ activeWorkspace, projects, inviteMember, removeMember }) {
  const [activeMemberTab, setActiveMemberTab] = useState('members')
  const [filterText, setFilterText] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [submittingInvite, setSubmittingInvite] = useState(false)

  const members = (activeWorkspace?.members || []).map((member, index) => {
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
  })

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(filterText.toLowerCase())
  )

  const counts = {
    members: members.length,
    single: 0,
    multi: 0,
    join: 0
  }

  const handleInvite = async () => {
    if (!activeWorkspace?._id || !inviteEmail.trim()) return
    try {
      setSubmittingInvite(true)
      const result = await inviteMember(activeWorkspace._id, inviteEmail.trim())
      setShowInviteModal(false)
      setInviteEmail('')
      toast.success('Member invited')
      if (result?.warning) {
        toast.warning(result.warning)
      }
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
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-white">
          Collaborators ({members.length})
        </h1>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 h-9 rounded bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold transition-colors"
        >
          <BsPersonPlusFill /> Invite members
        </button>
      </div>

      {/* invite modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#2c333a] rounded-2xl w-96 p-6 shadow-2xl">
            <h3 className="text-white font-semibold mb-4">
              Invite to Workspace
            </h3>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address..."
              className="w-full bg-[#1d2125] border border-[#454f59] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleInvite()
                }}
                disabled={submittingInvite || !inviteEmail.trim()}
                className="flex-1 bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold py-2 rounded transition-colors"
              >
                {submittingInvite ? 'Sending...' : 'Send invite'}
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 text-[#9fadbc] hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* member type tabs */}
      <div className="flex gap-0 border-b border-[#2c333a] mb-4">
        {memberTabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveMemberTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeMemberTab === id
                ? 'border-[#579dff] text-[#579dff]'
                : 'border-transparent text-[#9fadbc] hover:text-white'
            }`}
          >
            {label} ({counts[id]})
          </button>
        ))}
      </div>

      <p className="text-sm text-[#9fadbc] mb-4 max-w-2xl">
        Workspace members can view and join all Workspace visible projects and
        create new projects in the Workspace.
      </p>

      {/* filter */}
      <div className="relative mb-4 w-72">
        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9fadbc] text-xs" />
        <input
          type="text"
          placeholder="Filter by name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full bg-[#2c333a] border border-[#454f59] rounded h-9 pl-8 pr-3 text-sm text-[#b6c2cf] placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] transition-colors"
        />
      </div>

      {/* members list */}
      {activeMemberTab === 'members' ? (
        <div className="flex flex-col gap-1">
          {filtered.length === 0 ? (
            <p className="text-[#9fadbc] text-sm py-8 text-center">
              No members match "{filterText}"
            </p>
          ) : (
            filtered.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[#2c333a] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full bg-linear-to-br ${m.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  >
                    {m.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-[#9fadbc]">{m.email}</p>
                  </div>
                </div>

                <p className="text-xs text-[#9fadbc] hidden md:block">
                  Workspace member
                </p>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 h-8 rounded text-xs text-[#b6c2cf] border border-[#454f59] hover:bg-[#454f59] transition-colors">
                    Projects ({m.projects})
                    <BsChevronDown className="text-[10px]" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 h-8 rounded text-xs text-[#b6c2cf] border border-[#454f59] hover:bg-[#454f59] transition-colors">
                    {m.role.toLowerCase()}
                    <BsChevronDown className="text-[10px]" />
                  </button>
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="flex items-center gap-1.5 px-3 h-8 rounded text-xs text-[#9fadbc] border border-[#454f59] hover:bg-[#454f59] hover:text-white transition-colors"
                  >
                    <BsBoxArrowRight /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-[#9fadbc] text-sm">
          No{' '}
          {memberTabs
            .find((t) => t.id === activeMemberTab)
            ?.label.toLowerCase()}{' '}
          yet.
        </div>
      )}
    </div>
  )
}

function WorkspaceSettingsPanel() {
  const { activeWorkspace, updateWorkspace } = useWorkspaceStore()
  const [wsName, setWsName] = useState(activeWorkspace?.name || 'Workspace')
  const [editing, setEditing] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [visibility, setVisibility] = useState('private')

  useEffect(() => {
    setWsName(activeWorkspace?.name || 'Workspace')
  }, [activeWorkspace?.name])

  const handleSave = async () => {
    if (!activeWorkspace?._id) return
    try {
      await updateWorkspace(activeWorkspace._id, { name: wsName })
      setEditing(false)
      toast.success('Workspace updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update workspace')
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-6">
        Workspace Settings
      </h1>

      {/* workspace identity */}
      <div className="bg-[#2c333a] rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-linear-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="bg-[#1d2125] border border-[#579dff] rounded-lg px-3 py-1.5 text-white text-sm w-full focus:outline-none"
                autoFocus
              />
            ) : (
              <p className="text-white font-semibold">{wsName}</p>
            )}
            <p className="text-xs text-[#9fadbc]">
              {visibility === 'private' ? 'ðŸ”’ Private' : 'ðŸŒ Public'}
            </p>
          </div>
          <button
            onClick={() => {
              if (editing) handleSave()
              else setEditing(true)
            }}
            className="text-xs text-[#579dff] hover:underline"
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* visibility */}
        <div className="mb-4">
          <p className="text-xs text-[#9fadbc] font-semibold uppercase tracking-wide mb-2">
            Visibility
          </p>
          <div className="flex gap-3">
            {['private', 'public'].map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value={v}
                  checked={visibility === v}
                  onChange={() => setVisibility(v)}
                  className="accent-[#579dff]"
                />
                <span className="text-sm text-[#b6c2cf] capitalize">{v}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-1">
              * AI Features
            </p>
            <p className="text-xs text-[#9fadbc] mt-0.5">
              AI is {aiEnabled ? 'activated' : 'deactivated'} for all projects
            </p>
          </div>
          <button
            onClick={() => setAiEnabled((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              aiEnabled ? 'bg-green-500' : 'bg-[#454f59]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                aiEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* danger zone */}
      <div className="bg-[#2c333a] rounded-2xl p-6 border border-red-900/30">
        <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#b6c2cf] font-medium">
              Delete Workspace
            </p>
            <p className="text-xs text-[#9fadbc]">
              This will permanently delete all projects and cards.
            </p>
          </div>
          <button className="px-4 py-2 border border-red-500 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/10 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Main WorkSpaces Component

function WorkSpaces() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('members')
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
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectsPanel
            navigate={navigate}
            projects={projects}
            activeWorkspace={activeWorkspace}
          />
        )
      case 'members':
        return (
          <MembersPanel
            activeWorkspace={activeWorkspace}
            projects={projects}
            inviteMember={inviteMember}
            removeMember={removeMember}
          />
        )
      case 'settings':
        return <WorkspaceSettingsPanel />
      default:
        return (
          <MembersPanel
            activeWorkspace={activeWorkspace}
            projects={projects}
            inviteMember={inviteMember}
            removeMember={removeMember}
          />
        )
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1d2125]">
      {/* sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#2c333a] py-4 overflow-y-auto">
        {/* personal settings section */}
        <div className="px-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c9bab] mb-2">
            Personal Settings
          </p>
          <nav className="flex flex-col gap-0.5">
            {personalSettings.map((s) => (
              <button
                key={s.label}
                onClick={() => navigate(s.path)}
                className={`text-left px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === s.path
                    ? 'bg-[#85b8ff1a] text-[#579dff]'
                    : 'text-[#9fadbc] hover:bg-[#2c333a] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <hr className="border-[#2c333a] mx-4 my-2" />

        {/* workspace section */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8c9bab]">
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
            <div className="mb-3">
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

          <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
            <span className="w-6 h-6 rounded bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
              {(activeWorkspace?.name || 'W').slice(0, 1).toUpperCase()}
            </span>
            <span className="text-sm text-[#b6c2cf] font-medium">
              {activeWorkspace?.name || 'No workspace'}
            </span>
          </div>

          <nav className="flex flex-col gap-0.5 mb-3">
            {workspaces.map((workspace) => (
              <button
                key={workspace._id}
                onClick={() => setActiveWorkspace(workspace)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-sm w-full text-left transition-colors ${
                  activeWorkspace?._id === workspace._id
                    ? 'bg-[#85b8ff1a] text-[#579dff]'
                    : 'text-[#9fadbc] hover:bg-[#2c333a] hover:text-white'
                }`}
              >
                <span className="w-4 h-4 rounded bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-[9px] font-bold">
                  {workspace.name?.slice(0, 1).toUpperCase() || 'W'}
                </span>
                <span className="truncate">{workspace.name}</span>
              </button>
            ))}
          </nav>

          <nav className="flex flex-col gap-0.5 ml-1">
            {workspaceTabs.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-sm w-full text-left transition-colors ${
                  activeTab === id
                    ? 'bg-[#85b8ff1a] text-[#579dff]'
                    : 'text-[#9fadbc] hover:bg-[#2c333a] hover:text-white'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* main content */}
      <main className="flex-1 overflow-y-auto px-8 py-6">{renderPanel()}</main>
    </div>
  )
}

export default WorkSpaces


