// Boards component: renders a focused piece of the Kanvora clone UI.
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import { useBoardStore } from '../store/boardStore'
import { useWorkspaceStore } from '../store/workspaceStore'
import {
  buttonPrimary,
  dashboardMutedColor,
  emptyStatePanel,
  headingPage,
  skeletonBlock
} from '../Styles/common'

const bgOptions = [
  { value: 'from-blue-500 to-blue-700', label: 'Ocean' },
  { value: 'from-orange-400 to-orange-600', label: 'Sunset' },
  { value: 'from-violet-500 to-purple-700', label: 'Amethyst' },
  { value: 'from-emerald-400 to-teal-600', label: 'Forest' },
  { value: 'from-rose-400 to-pink-600', label: 'Rose' },
  { value: 'from-slate-500 to-slate-700', label: 'Slate' }
]

// Board Card

const BoardCard = memo(function BoardCard({ board, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.07] shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#ff4d67]/40 hover:shadow-[0_18px_50px_rgba(255,77,103,0.18)]"
      style={{ height: '96px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {board.img ? (
        <img
          src={board.img}
          alt={board.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full bg-linear-to-br ${board.color || 'from-blue-500 to-blue-700'}`}
        />
      )}

      <div
        className={`absolute inset-0 bg-black transition-opacity duration-150 ${
          hovered ? 'opacity-20' : 'opacity-0'
        }`}
      />

      <span className="absolute bottom-2 left-2 text-white text-sm font-semibold drop-shadow">
        {board.title || board.name}
      </span>

      {onDelete && hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(board._id)
          }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white transition-colors hover:bg-red-500"
        >
          <BsTrash className="text-[10px]" />
        </button>
      )}
    </div>
  )
})

// Create Board Modal

function CreateBoardModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState(bgOptions[0])
  const [backgroundFile, setBackgroundFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl, onClose])

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Board title is required')
      return
    }
    setSubmitting(true)
    await onCreate({
      title: title.trim(),
      color: selectedBg.value,
      backgroundFile
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
    <div
      className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="premium-card animate-enter rounded-2xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Create board</h3>
          <button
            onClick={onClose}
            className="text-[var(--dash-text-dark)] hover:text-white"
          >
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
              alt="Board background preview"
              className="w-full h-full object-cover"
            />
          )}
          {!previewUrl && (
            <span className="text-white font-semibold text-sm opacity-80">
              {title || 'Board title'}
            </span>
          )}
        </div>

        {/* background picker */}
        <p className="text-xs text-[var(--dash-text-dark)] mb-2 font-semibold">
          Background
        </p>
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

        <label className="flex items-center justify-center gap-2 w-full h-9 rounded bg-[var(--dash-bg)] border border-[var(--dash-text-btn)] text-[var(--dash-text-main)] text-xs font-semibold hover:bg-[var(--dash-nav-hover)] cursor-pointer mb-4">
          <BsImage /> Upload JPG/PNG background
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleBackgroundChange}
          />
        </label>

        <label className="text-xs text-[var(--dash-text-dark)] font-semibold block mb-1">
          Board title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Enter board title..."
          className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[var(--dash-text-dark)] focus:outline-none focus:border-[var(--dash-accent)] focus:ring-2 focus:ring-[#ff4d67]/20 mb-4"
          autoFocus
        />

        <button
          onClick={handleCreate}
          disabled={submitting || !title.trim()}
          className="premium-button-glow w-full bg-[var(--dash-accent)] hover:bg-[var(--dash-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {submitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  )
}

const CreateBoardCard = memo(function CreateBoardCard({ onClick }) {
  return (
    <div
      className="premium-card-hover flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/[0.14] bg-[#111111]/80 transition-colors hover:border-[#ff4d67]/45"
      style={{ height: '96px' }}
      onClick={onClick}
    >
      <span className="text-[var(--dash-text-dark)] text-sm hover:text-white transition-colors">
        Create new board
      </span>
    </div>
  )
})

function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

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
    <div
      className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="premium-card animate-enter rounded-2xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Create workspace</h3>
          <button
            onClick={onClose}
            className="text-[var(--dash-text-dark)] hover:text-white"
          >
            <BsX className="text-lg" />
          </button>
        </div>
        <label className="text-xs text-[var(--dash-text-dark)] font-semibold block mb-1">
          Workspace name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Product team"
          className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[var(--dash-text-dark)] focus:outline-none focus:border-[var(--dash-accent)] focus:ring-2 focus:ring-[#ff4d67]/20 mb-4"
          autoFocus
        />
        <button
          onClick={handleCreate}
          disabled={submitting || !name.trim()}
          className="premium-button-glow w-full bg-[var(--dash-accent)] hover:bg-[var(--dash-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {submitting ? 'Creating...' : 'Create workspace'}
        </button>
      </div>
    </div>
  )
}

// Boards Main

function Boards() {
  const navigate = useNavigate()
  const {
    boards,
    recentBoards,
    loading,
    fetchBoards,
    fetchRecentBoards,
    createBoard,
    deleteBoard
  } = useBoardStore()
  const {
    workspaces,
    activeWorkspace,
    loading: workspaceLoading,
    fetchWorkspaces,
    createWorkspace
  } = useWorkspaceStore()
  const [showModal, setShowModal] = useState(false)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const sortedBoards = useMemo(
    () =>
      [...boards].sort(
        (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      ),
    [boards]
  )
  const workspaceTitle = activeWorkspace?.name || 'No workspace selected'

  useEffect(() => {
    fetchWorkspaces()
    fetchRecentBoards()
  }, [fetchWorkspaces, fetchRecentBoards])

  useEffect(() => {
    if (activeWorkspace?._id) {
      fetchBoards(activeWorkspace._id)
    }
  }, [activeWorkspace?._id, fetchBoards])

  const handleCreateBoard = useCallback(
    async (data) => {
      if (!activeWorkspace?._id) {
        toast.error('Create a workspace first')
        return
      }
      const newBoard = await createBoard({
        ...data,
        workspaceId: activeWorkspace._id
      })
      if (newBoard) toast.success('Board created!')
    },
    [activeWorkspace, createBoard]
  )

  const handleCreateWorkspace = useCallback(
    async (name) => {
      try {
        await createWorkspace({ name })
        toast.success('Workspace created!')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not create workspace')
      }
    },
    [createWorkspace]
  )

  const handleDeleteBoard = useCallback(
    async (boardId) => {
      if (!confirm('Delete this board and all its lists and cards?')) return
      await deleteBoard(boardId)
      toast.success('Board deleted')
    },
    [deleteBoard]
  )

  if (loading || workspaceLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-[var(--dash-bg)] px-4 py-5 text-[var(--dash-text-main)] app-scrollbar sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className={`${skeletonBlock} mb-4 h-5 w-1/4`}></div>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(194px, 1fr))'
            }}
          >
            <div className={`${skeletonBlock} h-24`}></div>
            <div className={`${skeletonBlock} h-24`}></div>
            <div className={`${skeletonBlock} h-24`}></div>
            <div className={`${skeletonBlock} h-24`}></div>
          </div>
          <div className="h-4 bg-[var(--dash-card-bg)] rounded w-1/4 mt-8 mb-4"></div>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(194px, 1fr))'
            }}
          >
            <div className="h-24 bg-[var(--dash-card-bg)] rounded-lg"></div>
            <div className="h-24 bg-[var(--dash-card-bg)] rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto premium-app-bg px-4 py-5 text-[var(--dash-text-main)] app-scrollbar sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={headingPage}>Boards</h1>
          <p className={`text-sm ${dashboardMutedColor}`}>
            Browse recent boards and create workspace boards quickly.
          </p>
        </div>
        {workspaces.length > 0 && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={buttonPrimary}
          >
            <BsPlusLg /> New board
          </button>
        )}
      </div>
      {/* recently viewed */}
      {recentBoards.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BsClockHistory className="text-base text-[var(--dash-text-dark)]" />
            <h2 className="text-sm font-semibold text-[var(--dash-text-main)]">
              Recently viewed
            </h2>
          </div>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(194px, 1fr))'
            }}
          >
            {recentBoards.map((b) => (
              <BoardCard
                key={b._id}
                board={b}
                onClick={() => navigate(`/boards/${b._id}`)}
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
              {workspaceTitle}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {[
              { icon: <BsGrid3X3Gap />, label: 'Boards' },
              { icon: <BsPeopleFill />, label: 'Members' },
              { icon: <BsGear />, label: 'Settings' }
            ].map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-1.5 px-2.5 h-7 rounded text-xs text-[var(--dash-text-dark)] hover:bg-[var(--dash-card-bg)] hover:text-white transition-colors"
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
          <div className={emptyStatePanel}>
            <h3 className="text-white font-semibold mb-2">
              Create your first workspace
            </h3>
            <p className="text-sm text-[var(--dash-text-dark)] mb-5">
              Workspaces keep each team or project area organized with its own
              boards.
            </p>
            <button
              type="button"
              onClick={() => setShowWorkspaceModal(true)}
              className="inline-flex items-center gap-2 px-4 h-9 rounded bg-[var(--dash-accent)] hover:bg-[var(--dash-accent-hover)] text-[var(--dash-bg)] text-sm font-semibold transition-colors"
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
            {sortedBoards.map((b) => (
              <BoardCard
                key={b._id}
                board={b}
                onClick={() => navigate(`/boards/${b._id}`)}
                onDelete={handleDeleteBoard}
              />
            ))}
            <CreateBoardCard onClick={() => setShowModal(true)} />
          </div>
        )}

        {workspaces.length > 0 && sortedBoards.length === 0 && !loading && (
          <div className={`${emptyStatePanel} mt-4`}>
            <h3 className="text-white font-semibold mb-2">No boards yet</h3>
            <p className="text-sm text-[var(--dash-text-dark)] mb-5">
              Create a board for this workspace and it will appear here.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={buttonPrimary}
            >
              <BsPlusLg className="text-xs" /> Create board
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateBoard}
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

export default Boards
