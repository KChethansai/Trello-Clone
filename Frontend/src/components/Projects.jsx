// Projects component: renders a focused piece of the Trello clone UI.
import { useState, useEffect } from 'react'
import {
  BsClockHistory,
  BsPlusLg,
  BsGrid3X3Gap,
  BsPeopleFill,
  BsGear,
  BsX,
  BsTrash,
  BsImage
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useProjectStore } from '../store/projectStore'
import { useWorkspaceStore } from '../store/workspaceStore'

const bgOptions = [
  { value: 'from-blue-500 to-blue-700', label: 'Ocean' },
  { value: 'from-orange-400 to-orange-600', label: 'Sunset' },
  { value: 'from-violet-500 to-purple-700', label: 'Amethyst' },
  { value: 'from-emerald-400 to-teal-600', label: 'Forest' },
  { value: 'from-rose-400 to-pink-600', label: 'Rose' },
  { value: 'from-slate-500 to-slate-700', label: 'Slate' }
]

// Project Card

function ProjectCard({ project, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer group"
      style={{ height: '96px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {project.img ? (
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full bg-linear-to-br ${project.color || 'from-blue-500 to-blue-700'}`}
        />
      )}

      <div
        className={`absolute inset-0 bg-black transition-opacity duration-150 ${
          hovered ? 'opacity-20' : 'opacity-0'
        }`}
      />

      <span className="absolute bottom-2 left-2 text-white text-sm font-semibold drop-shadow">
        {project.title || project.name}
      </span>

      {onDelete && hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(project._id)
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/40 rounded flex items-center justify-center text-white hover:bg-red-500 transition-colors"
        >
          <BsTrash className="text-[10px]" />
        </button>
      )}
    </div>
  )
}

// Create Project Modal

function CreateProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState(bgOptions[0])
  const [backgroundFile, setBackgroundFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isEditable, setIsEditable] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Project title is required')
      return
    }
    setSubmitting(true)
    await onCreate({
      title: title.trim(),
      color: selectedBg.value,
      backgroundFile,
      isEditable:true,
      isPublished
    })
    setSubmitting(false)
    onClose()
  }

  const handleBackgroundChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed')
      return
    }
    setBackgroundFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#2c333a] rounded-xl w-80 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Create project</h3>
          <button onClick={onClose} className="text-[#9fadbc] hover:text-white">
            <BsX className="text-lg" />
          </button>
        </div>

        {/* preview */}
        <div
          className={`h-24 rounded-lg bg-linear-to-br ${selectedBg.value} mb-4 flex items-center justify-center overflow-hidden`}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Project background preview"
              className="w-full h-full object-cover"
            />
          )}
          {!previewUrl && (
          <span className="text-white font-semibold text-sm opacity-80">
            {title || 'Project title'}
          </span>
          )}
        </div>

        {/* background picker */}
        <p className="text-xs text-[#9fadbc] mb-2 font-semibold">Background</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {bgOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelectedBg(opt)
                setBackgroundFile(null)
                setPreviewUrl('')
              }}
              className={`w-10 h-7 rounded bg-linear-to-br ${opt.value} ${
                selectedBg.value === opt.value ? 'ring-2 ring-white' : ''
              }`}
            />
          ))}
        </div>

        <label className="flex items-center justify-center gap-2 w-full h-9 rounded bg-[#1d2125] border border-[#454f59] text-[#b6c2cf] text-xs font-semibold hover:bg-[#22272b] cursor-pointer mb-4">
          <BsImage /> Upload JPG/PNG background
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleBackgroundChange}
          />
        </label>

        <label className="text-xs text-[#9fadbc] font-semibold block mb-1">
          Project title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Enter project title..."
          className="w-full bg-[#1d2125] border border-[#454f59] rounded px-3 py-2 text-sm text-white placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] mb-4"
          autoFocus
        />



        <button
          onClick={handleCreate}
          disabled={submitting || !title.trim()}
          className="w-full bg-[#579dff] hover:bg-[#85b8ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#1d2125] text-sm font-semibold py-2 rounded transition-colors"
        >
          {submitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  )
}

function CreateProjectCard({ onClick }) {
  return (
    <div
      className="rounded-lg bg-[#2c333a] hover:bg-[#454f59] cursor-pointer flex items-center justify-center transition-colors"
      style={{ height: '96px' }}
      onClick={onClick}
    >
      <span className="text-[#9fadbc] text-sm hover:text-white transition-colors">
        Create new project
      </span>
    </div>
  )
}

function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Workspace name is required')
      return
    }
    setSubmitting(true)
    await onCreate(name.trim())
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-[#2c333a] rounded-xl w-full max-w-sm p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Create workspace</h3>
          <button onClick={onClose} className="text-[#9fadbc] hover:text-white">
            <BsX className="text-lg" />
          </button>
        </div>
        <label className="text-xs text-[#9fadbc] font-semibold block mb-1">
          Workspace name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Product team"
          className="w-full bg-[#1d2125] border border-[#454f59] rounded px-3 py-2 text-sm text-white placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] mb-4"
          autoFocus
        />
        <button
          onClick={handleCreate}
          disabled={submitting || !name.trim()}
          className="w-full bg-[#579dff] hover:bg-[#85b8ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#1d2125] text-sm font-semibold py-2 rounded transition-colors"
        >
          {submitting ? 'Creating...' : 'Create workspace'}
        </button>
      </div>
    </div>
  )
}

// Projects Main

function Projects() {
  const navigate = useNavigate()
  const {
    projects,
    recentProjects,
    loading,
    fetchProjects,
    fetchRecentProjects,
    createProject,
    deleteProject
  } = useProjectStore()
  const {
    workspaces,
    activeWorkspace,
    loading: workspaceLoading,
    fetchWorkspaces,
    createWorkspace
  } = useWorkspaceStore()
  const [showModal, setShowModal] = useState(false)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)

  useEffect(() => {
    fetchWorkspaces()
    fetchRecentProjects()
  }, [fetchWorkspaces, fetchRecentProjects])

  useEffect(() => {
    if (activeWorkspace?._id) {
      fetchProjects(activeWorkspace._id)
    }
  }, [activeWorkspace?._id, fetchProjects])

  const handleCreateProject = async (data) => {
    if (!activeWorkspace?._id) {
      toast.error('Create a workspace first')
      return
    }
    const newProject = await createProject({
      ...data,
      workspaceId: activeWorkspace._id
    })
    if (newProject) toast.success('Project created!')
  }

  const handleCreateWorkspace = async (name) => {
    try {
      await createWorkspace({ name })
      toast.success('Workspace created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create workspace')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Delete this project and all its lists and cards?')) return
    await deleteProject(projectId)
    toast.success('Project deleted')
  }

  if (loading || workspaceLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1d2125]">
        <div className="w-6 h-6 border-2 border-[#579dff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#1d2125] text-[#b6c2cf] px-8 py-6">
      {/* recently viewed */}
      {recentProjects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BsClockHistory className="text-base text-[#9fadbc]" />
            <h2 className="text-sm font-semibold text-[#b6c2cf]">
              Recently viewed
            </h2>
          </div>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(194px, 1fr))'
            }}
          >
            {recentProjects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                onClick={() => navigate(`/projects/${p._id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* your workspaces */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-linear-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
              {(activeWorkspace?.name || 'W').slice(0, 1).toUpperCase()}
            </span>
            <h2 className="text-sm font-semibold text-white">
              {activeWorkspace?.name || 'No workspace selected'}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {[
              { icon: <BsGrid3X3Gap />, label: 'Projects' },
              { icon: <BsPeopleFill />, label: 'Members' },
              { icon: <BsGear />, label: 'Settings' }
            ].map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-1.5 px-2.5 h-7 rounded text-xs text-[#9fadbc] hover:bg-[#2c333a] hover:text-white transition-colors"
                onClick={() => {
                  if (label === 'Settings') navigate('/main-page/settings')
                  else if (label === 'Members') navigate('/workspaces')
                }}
              >
                <span className="text-sm">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {workspaces.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#454f59] bg-[#22272b] px-6 py-10 text-center">
            <h3 className="text-white font-semibold mb-2">
              Create your first workspace
            </h3>
            <p className="text-sm text-[#9fadbc] mb-5">
              Workspaces keep each team or project area organized with its own projects.
            </p>
            <button
              type="button"
              onClick={() => setShowWorkspaceModal(true)}
              className="inline-flex items-center gap-2 px-4 h-9 rounded bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold transition-colors"
            >
              <BsPlusLg className="text-xs" /> Create workspace
            </button>
          </div>
        ) : (
          <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(194px, 1fr))'
          }}
        >
          {projects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              onClick={() => navigate(`/projects/${p._id}`)}
              onDelete={handleDeleteProject}
            />
          ))}
          <CreateProjectCard onClick={() => setShowModal(true)} />
          </div>
        )}

        {workspaces.length > 0 && projects.length === 0 && !loading && (
          <p className="text-sm text-[#9fadbc] mt-4 text-center">
            No projects yet - create your first one!
          </p>
        )}
      </section>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateProject}
        />
      )}
      {showWorkspaceModal && (
        <CreateWorkspaceModal
          onClose={() => setShowWorkspaceModal(false)}
          onCreate={handleCreateWorkspace}
        />
      )}
    </div>
  )
}

export default Projects


