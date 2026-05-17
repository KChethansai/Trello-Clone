// Settings component: renders a focused piece of the Trello clone UI.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BsX,
  BsPerson,
  BsActivity,
  BsCreditCard,
  BsGear,
  BsGrid3X3Gap,
  BsPeopleFill
} from 'react-icons/bs'
import { useWorkspaceStore } from '../store/workspaceStore'

const personalNav = [
  { id: 'profile', label: 'Profile and Visibility', icon: <BsPerson /> },
  { id: 'activity', label: 'Activity', icon: <BsActivity /> },
  { id: 'cards', label: 'Cards', icon: <BsCreditCard /> },
  { id: 'settings', label: 'Settings', icon: <BsGear /> }
]

const workspaceNav = [
  { id: 'projects', label: 'Projects', icon: <BsGrid3X3Gap /> },
  { id: 'members', label: 'Members', icon: <BsPeopleFill /> },
  { id: 'ws-settings', label: 'Settings', icon: <BsGear /> }
]

function PlaceholderPanel({ title }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <hr className="border-[#2c333a] mb-6" />
      <p className="text-[#9fadbc] text-sm">This section is coming soon.</p>
    </div>
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
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-2">Settings</h2>
      <hr className="border-[#2c333a] mb-6" />

      <div className="bg-[#1c2b41] border border-[#2f4f7f] rounded-xl px-4 py-3 mb-8 flex gap-3 items-start">
        <span className="text-blue-400 text-base mt-0.5 shrink-0">i</span>

        <div>
          <p className="text-sm font-medium text-white">
            Some settings can only be changed from your Atlassian account.
          </p>

          <a href="#" className="text-sm text-[#579dff] hover:underline">
            Go to your Atlassian account
          </a>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
          Language and region
        </h3>

        <button className="border border-[#44546f] bg-[#22272b] text-[#b6c2cf] rounded-lg px-4 py-2 text-sm hover:bg-[#2c333a] transition-colors">
          Change language
        </button>
      </section>

      <hr className="border-[#2c333a] mb-8" />

      <section className="mb-8">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">
          Email notifications
        </h3>

        <p className="text-xs font-semibold text-[#9fadbc] mb-1">Frequency</p>

        <p className="text-xs text-[#9fadbc] mb-4">
          Email notifications can be sent instantly or periodically.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {['never', 'periodically', 'instantly'].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="freq"
                value={opt}
                checked={freq === opt}
                onChange={() => setFreq(opt)}
                className="accent-[#579dff] w-4 h-4"
              />

              <span className="text-sm text-white capitalize group-hover:text-[#579dff] transition-colors">
                {opt}
              </span>
            </label>
          ))}
        </div>

        <p className="text-xs font-semibold text-[#9fadbc] mb-3">
          Notifications
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={notifAll}
              onChange={(e) => handleNotifAll(e.target.checked)}
              className="accent-[#579dff] w-4 h-4"
            />

            <span className="text-sm font-medium text-white group-hover:text-[#579dff] transition-colors">
              Select all
            </span>
          </label>

          <div className="ml-2 border-l-2 border-[#2c333a] pl-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={notifComments}
                onChange={(e) => {
                  setNotifComments(e.target.checked)

                  if (!e.target.checked) {
                    setNotifAll(false)
                  }
                }}
                className="accent-[#579dff] w-4 h-4 mt-0.5"
              />

              <div>
                <span className="text-sm font-medium text-white group-hover:text-[#579dff] transition-colors">
                  Comments
                </span>

                <p className="text-xs text-[#9fadbc] mt-0.5">
                  New comments added on cards you're watching
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}

function WorkspaceSettingsPanel() {
  const { activeWorkspace } = useWorkspaceStore()
  const [aiEnabled, setAiEnabled] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const workspaceName = activeWorkspace?.name || 'Workspace'

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-2">Workspace settings</h2>

      <hr className="border-[#2c333a] mb-6" />

      <div className="flex items-center gap-4 p-4 bg-[#22272b] rounded-xl mb-8 border border-[#2c333a]">
        <div className="w-12 h-12 bg-linear-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">
          {(workspaceName || 'W').slice(0, 1).toUpperCase()}
        </div>

        <div className="flex-1">
          <p className="font-bold text-white text-base">{workspaceName}</p>

          <div className="flex gap-2 mt-1">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full">
              Premium
            </span>

            <span className="text-xs text-[#9fadbc] flex items-center gap-1">
              🔒 Private
            </span>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">
          Features
        </h3>

        <div className="flex items-center justify-between p-4 border border-[#2c333a] rounded-xl bg-[#22272b] hover:bg-[#2c333a] transition-colors">
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span className="text-[#579dff]">*</span>
              AI
            </p>

            <p className="text-xs text-[#9fadbc] mt-0.5">
              AI is {aiEnabled ? 'activated' : 'deactivated'} for all projects.
            </p>
          </div>

          <button
            onClick={() => setAiEnabled((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
              aiEnabled ? 'bg-green-500' : 'bg-[#44546f]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                aiEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </section>

      <section className="border border-[#5c2b29] rounded-xl overflow-hidden bg-[#161a1d]">
        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Delete Workspace
              </p>

              <p className="text-xs text-[#9fadbc] mt-0.5">
                Permanently deletes all projects and cards. This cannot be undone.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="border border-red-400 text-red-400 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#3b1f22] transition-colors whitespace-nowrap shrink-0"
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#9fadbc] whitespace-nowrap">
                  Are you sure?
                </span>

                <button className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                  Yes, delete
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border border-[#44546f] bg-[#22272b] text-[#b6c2cf] text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#2c333a] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

const MembersSettingsPanel = () => {
  const { activeWorkspace } = useWorkspaceStore()

  const members = activeWorkspace?.members || []

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-white mb-2">
        Workspace Members
      </h2>

      <hr className="border-[#2c333a] mb-6" />

      {members.length === 0 ? (
        <div className="bg-[#22272b] border border-[#2c333a] rounded-xl p-6 text-[#9fadbc] text-sm">
          No members found in this workspace.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member, index) => {
            const user = member.user || {}

            const name =
              user.name ||
              user.email ||
              'Workspace Member'

            const initials = name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <div
                key={user._id || index}
                className="flex items-center justify-between bg-[#22272b] border border-[#2c333a] rounded-xl p-4 hover:bg-[#2c333a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>

                  <div>
                    <p className="text-white font-medium">
                      {name}
                    </p>

                    <p className="text-xs text-[#9fadbc]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#1d2125] border border-[#454f59] text-xs text-[#b6c2cf] capitalize">
                  {member.role?.toLowerCase() || 'member'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const renderPanel = (active) => {
  switch (active) {
    case 'profile':
      return <PersonalSettingsPanel />
    case 'activity':
      return <PlaceholderPanel title="Activity" />
    case 'cards':
      return <PlaceholderPanel title="Cards" />
    case 'settings':
      return <PersonalSettingsPanel />
    case 'projects':
      return <PlaceholderPanel title="Workspace Projects" />
    case 'members':
      return <MembersSettingsPanel />
    case 'ws-settings':
      return <WorkspaceSettingsPanel />
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

  const navItem = (isActive) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors ${
      isActive
        ? 'bg-[#85b8ff1a] text-[#579dff] font-medium'
        : 'text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white'
    }`

  return (
    <div className="fixed inset-x-0 bottom-0 top-12 z-30 flex overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-[#1d2125] border-r border-[#2c333a] flex flex-col py-4 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between px-4 mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c9bab]">
              Personal Settings
            </p>

            <button
              onClick={() => navigate('/main-page')}
              className="text-[#9fadbc] hover:text-white p-1 rounded transition-colors"
            >
              <BsX className="text-lg" />
            </button>
          </div>

          <nav className="flex flex-col gap-0.5 px-2">
            {personalNav.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => navigate(`/main-page/settings/${id}`)}
                className={navItem(active === id)}
              >
                <span className="text-base shrink-0">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <hr className="border-[#2c333a] mx-4 my-3" />

          <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c9bab] px-3 mb-2">
              Workspace
            </p>

            <div className="flex items-center gap-2 px-3 py-1.5 mb-0.5">
              <span className="w-5 h-5 rounded bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(workspaceName || 'W').slice(0, 1).toUpperCase()}
              </span>

              <span className="text-xs font-medium text-[#b6c2cf]">
                {workspaceName}
              </span>
            </div>

            <nav className="flex flex-col gap-0.5 ml-1">
              {workspaceNav.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => navigate(`/main-page/settings/${id}`)}
                  className={`${navItem(active === id)} pl-6`}
                >
                  <span className="text-sm shrink-0">{icon}</span>
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1d2125] px-10 py-8 text-[#b6c2cf]">
          {renderPanel(active)}
        </div>
      </div>
    </div>
  )
}

export default Settings
