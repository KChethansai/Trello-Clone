// Project component: renders a focused piece of the Trello clone UI.
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  BsPlusLg,
  BsX,
  BsThreeDots,
  BsTrash,
  BsCalendar,
  BsTag,
  BsPeopleFill,
  BsPaperclip,
  BsChatLeft,
  BsCheckSquare,
  BsArrowLeft
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useProjectStore } from '../store/projectStore'
import { useAuth } from '../store/authStore'
import Navbar from './Navbar'
import { API_BASE_URL } from '../config/api'
import {
  addListButton,
  addListPanel,
  projectCanvas,
  projectFallbackBg,
  projectHeader,
  projectHeaderBtn,
  projectHeaderTitle,
  projectInput,
  projectListRow,
  projectMutedIconBtn,
  projectPrimarySmallBtn,
  projectShareBtn,
  projectStatusBar,
  projectStatusBarLabel,
  projectStatusPillActive,
  projectStatusPillBase,
  projectTextarea,
  cardDeleteBtn,
  cardMetaText,
  cardOverlay,
  cardSurface,
  cardText,
  dashboardBorder,
  listColumnBase,
  listColumnDefault,
  listDropZone,
  listDropZoneOver,
  listHeader,
  listIconButton,
  listMenu,
  listMenuDanger,
  listMenuItem,
  listTitle,
  listTitleInput,
  modalActionBtn,
  modalBackdrop,
  modalCancelBtn,
  modalDangerBtn,
  modalHeader,
  modalMutedText,
  modalPanel,
  modalPrimaryBtn,
  modalSectionTitle,
  modalTextarea,
  modalTitleInput,
  statusLabelStyles
} from '../Styles/common'

// Publish Form Modal
const TEMPLATE_CATEGORIES = [
  'Business',
  'Personal',
  'Education',
  'Engineering',
  'Marketing',
  'HR & Operations'
]

function PublishForm({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    title: project.title || '',
    description: project.description || '',
    category: project.publishDetails?.category || '',
    viewOnly: project.isPublished ? !project.isEditable : false,
    companyName: project.publishDetails?.companyName || '',
    website: project.publishDetails?.website || '',
    contactEmail: project.publishDetails?.contactEmail || '',
    templateType: project.publishDetails?.templateType || '',
    notes: project.publishDetails?.notes || ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { title, description, category, viewOnly, ...publishDetails } = form
      const res = await axios.put(
        `${API_BASE_URL}/projects-api/projects/${project._id}`,
        {
          title,
          description,
          isEditable: !viewOnly,
          isPublished: true,
          publishDetails: {
            ...publishDetails,
            category
          }
        },
        { withCredentials: true }
      )
      toast.success('Project published successfully!')
      onSave(res.data.payload)
      onClose()
    } catch {
      toast.error('Failed to publish project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#282e33] rounded-xl shadow-2xl border border-[#3a424a] w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a424a] shrink-0">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-xl">🚀</span> Publish Project
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-[#9fadbc] hover:text-white hover:bg-[#3a424a] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* form scrollable area */}
      {/* form scrollable area */}
<form
  id="publish-form"
  onSubmit={handleSubmit}
  className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
>
  <div className="grid grid-cols-2 gap-4">

    {/* title */}
    <div className="col-span-2">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Project Title
      </label>

      <input
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg h-10 px-3 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors"
        placeholder="Enter project title"
      />
    </div>

    {/* category */}
    <div className="col-span-1">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Category
      </label>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg h-10 px-3 text-sm text-[#b6c2cf] focus:outline-none focus:border-[#579dff] transition-colors"
      >
        <option value="">Select category</option>

        {TEMPLATE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* template type */}
    <div className="col-span-1">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Template Type
      </label>

      <input
        name="templateType"
        type="text"
        value={form.templateType}
        onChange={handleChange}
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg h-10 px-3 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors"
        placeholder="e.g. Kanban, Calendar"
      />
    </div>

    {/* description */}
    <div className="col-span-2">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Description
      </label>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg px-3 py-2 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors resize-none"
        placeholder="Describe your project..."
      />
    </div>

    {/* view only toggle */}
    <div className="col-span-2">
      <label className="flex items-center gap-2 text-sm text-[#b6c2cf]">
        <input
          name="viewOnly"
          type="checkbox"
          checked={form.viewOnly}
          onChange={handleChange}
          className="h-4 w-4 rounded border-[#454f59] bg-[#1d2125] text-[#579dff]"
        />

        Publish as view-only
      </label>

      <p className="text-xs text-[#9fadbc] mt-1">
        When enabled, the published board will be visible but not editable by others.
      </p>
    </div>

    <div className="col-span-2 pt-2 pb-1 border-t border-[#3a424a]">
      <h4 className="text-xs font-bold text-[#579dff] uppercase tracking-widest">
        Publisher Details
      </h4>
    </div>

    {/* company name */}
    <div className="col-span-1">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Company Name
      </label>

      <input
        name="companyName"
        type="text"
        value={form.companyName}
        onChange={handleChange}
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg h-10 px-3 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors"
        placeholder="Your organization"
      />
    </div>

    {/* website */}
    <div className="col-span-1">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Website
      </label>

      <input
        name="website"
        type="text"
        value={form.website}
        onChange={handleChange}
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg h-10 px-3 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors"
        placeholder="https://yourwebsite.com"
      />
    </div>

    {/* contact email */}
    <div className="col-span-1">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Contact Email
      </label>

      <input
        name="contactEmail"
        type="email"
        value={form.contactEmail}
        onChange={handleChange}
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg h-10 px-3 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors"
        placeholder="contact@company.com"
      />
    </div>

    {/* notes */}
    <div className="col-span-2">
      <label className="block text-xs font-bold text-[#9fadbc] uppercase tracking-wider mb-1.5">
        Notes
      </label>

      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        rows={2}
        className="w-full bg-[#22272b] border border-[#454f59] rounded-lg px-3 py-2 text-sm text-[#b6c2cf] placeholder:text-[#6b778c] focus:outline-none focus:border-[#579dff] transition-colors resize-none"
        placeholder="Additional notes..."
      />
    </div>
  </div>
</form>

{/* footer */}
<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#3a424a] shrink-0">

  <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-sm text-[#9fadbc] hover:text-white transition-colors"
  >
    Cancel
  </button>

  <button
    type="submit"
    form="publish-form"
    disabled={saving}
    className="px-4 py-2 bg-[#579dff] hover:bg-[#4c8eff] disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
  >
    {saving && (
      <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
    )}

    🚀 Publish
  </button>
</div>


      </div>
    </div>
  )
}

const STATUS_LABELS = [
  { id: 'todo', ...statusLabelStyles.todo },
  { id: 'inProgress', ...statusLabelStyles.inProgress },
  { id: 'done', ...statusLabelStyles.done }
]

const normalizeStatusText = (value = '') =>
  value.toLowerCase().replace(/[\s_-]+/g, '')

const getStatusByText = (value = '') =>
  STATUS_LABELS.find(
    (status) =>
      normalizeStatusText(status.title) === normalizeStatusText(value) ||
      normalizeStatusText(status.label) === normalizeStatusText(value) ||
      normalizeStatusText(status.listTitle) === normalizeStatusText(value)
  )

const getCardStatus = (card) =>
  card?.labels?.map((label) => getStatusByText(label.text)).find(Boolean) ||
  null

const getNonStatusLabels = (labels = []) =>
  labels.filter((label) => !getStatusByText(label.text))

// Card Detail Modal

function CardDetailModal({
  card,
  listTitle,
  onClose,
  onSave,
  onDelete,
  onStatusChange,
  onAttach,
  readOnly
}) {
  const [title, setTitle] = useState(card.title || '')
  const [desc, setDesc] = useState(card.description || '')
  const [saving, setSaving] = useState(false)
  const [attaching, setAttaching] = useState(false)
  const fileInputRef = useRef(null)
  const activeStatus = getCardStatus(card)

  const handleAttachImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed')
      e.target.value = ''
      return
    }
    setAttaching(true)
    await onAttach(card._id, file)
    setAttaching(false)
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onSave(card._id, { title: title.trim(), description: desc })
    setSaving(false)
    onClose()
  }

  return (
    <div
      className={modalBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={modalPanel}>
        {/* header */}
        <div className={modalHeader}>
          <div className="flex-1">
            {readOnly ? (
              <div className="text-lg font-semibold text-white mb-2">
                {title}
              </div>
            ) : (
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={modalTitleInput}
                rows={2}
              />
            )}
            <p className={`${modalMutedText} mt-1`}>
              in list <span className="underline">{listTitle}</span>
            </p>
            {readOnly && (
              <p className="text-sm text-[#9fadbc] mt-2">
                This card is in view-only mode. Editing is disabled.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`${projectMutedIconBtn} mt-1 shrink-0`}
          >
            <BsX className="text-xl" />
          </button>
        </div>

        <div className="flex gap-4 p-6">
          {/* main content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BsChatLeft className="text-[#9fadbc] text-sm" />
                <h3 className={modalSectionTitle}>
                  Description
                </h3>
              </div>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Add a more detailed description..."
                rows={4}
                className={modalTextarea}
                readOnly={readOnly}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BsCheckSquare className="text-[#9fadbc] text-sm" />
                <h3 className={modalSectionTitle}>Status</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {STATUS_LABELS.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => !readOnly && onStatusChange(card, status)}
                    disabled={readOnly}
                    className={`${projectStatusPillBase} ${status.pill} ${
                      activeStatus?.id === status.id
                        ? projectStatusPillActive
                        : ''
                    } ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {status.title}
                  </button>
                ))}
              </div>
            </div>

            {card.labels?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BsTag className="text-[#9fadbc] text-sm" />
                  <h3 className={modalSectionTitle}>
                    Labels
                  </h3>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {card.labels.map((label, i) => (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        getStatusByText(label.text)?.badge || ''
                      }`}
                      style={
                        getStatusByText(label.text)
                          ? undefined
                          : { backgroundColor: label.color, color: '#1d2125' }
                      }
                    >
                      {label.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.dueDate && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <BsCalendar className="text-[#9fadbc] text-sm" />
                  <h3 className={modalSectionTitle}>
                    Due Date
                  </h3>
                </div>
                <span className="text-sm text-[#b6c2cf]">
                  {new Date(card.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}

            {card.attachment?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BsPaperclip className="text-[#9fadbc] text-sm" />
                  <h3 className={modalSectionTitle}>Attachments</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {card.attachment.map((item, index) => (
                    <a
                      key={`${item.url}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-lg bg-[#22272b] border border-[#454f59]"
                    >
                      <img
                        src={item.url}
                        alt={item.name || 'Card attachment'}
                        className="h-24 w-full object-cover"
                      />
                      <span className="block truncate px-2 py-1 text-[11px] text-[#b6c2cf]">
                        {item.name || 'Image attachment'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* sidebar actions */}
          <div className="w-36 flex flex-col gap-2 shrink-0">
            <p className="text-xs font-semibold text-[#9fadbc] uppercase tracking-wide mb-1">
              Actions
            </p>
            {[
              { icon: <BsPeopleFill />, label: 'Members' },
              { icon: <BsTag />, label: 'Labels' }
            ].map(({ icon, label }) => (
              <button
                key={label}
                className={modalActionBtn}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
            {!readOnly && (
              <>
                {[
                  { icon: <BsCheckSquare />, label: 'Checklist' },
                  { icon: <BsCalendar />, label: 'Dates' },
                  { icon: <BsPaperclip />, label: 'Attachment' }
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (label === 'Attachment') fileInputRef.current?.click()
                    }}
                    className={modalActionBtn}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAttachImage}
                />
                {attaching && (
                  <p className="text-[11px] text-[#9fadbc] px-1">
                    Uploading image...
                  </p>
                )}
                <hr className="border-[#454f59] my-1" />
                <button
                  onClick={() => {
                    onDelete(card._id, card.listId?.toString() || '')
                    onClose()
                  }}
                  className={modalDangerBtn}
                >
                  <BsTrash /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-2">
          {!readOnly ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className={modalPrimaryBtn}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={onClose}
                className={modalCancelBtn}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={modalPrimaryBtn}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Sortable Card

function SortableCard({ card, listId, onDelete, onOpen, isEditable }) {
  const sortableId = `card:${card._id}`
  const status = getCardStatus(card)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: sortableId,
    data: { type: 'card', cardId: card._id, listId },
    disabled: !isEditable
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardSurface}
      onClick={() => onOpen(card)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cardText}>
          {card.title}
        </p>
        {isEditable && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card._id, listId)
            }}
            className={cardDeleteBtn}
          >
            <BsX />
          </button>
        )}
      </div>

      {card.labels?.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {card.labels.map((label, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                getStatusByText(label.text)?.badge || ''
              }`}
              style={
                getStatusByText(label.text)
                  ? undefined
                  : { backgroundColor: label.color, color: '#1d2125' }
              }
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      {!card.labels?.length && status && (
        <div className="flex gap-1 mt-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.badge}`}>
            {status.title}
          </span>
        </div>
      )}

      {card.dueDate && (
        <p className={cardMetaText}>
          <BsCalendar className="text-[10px]" />
          {new Date(card.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

function DragCard({ card }) {
  return (
    <div className={cardOverlay}>
      <p className="text-sm text-[#b6c2cf]">{card.title}</p>
    </div>
  )
}

// Add Card Form

function AddCardForm({ listId, onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onCancel()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onCancel])

  const handleAdd = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    await onAdd(listId, { title: title.trim() })
    setSubmitting(false)
    setTitle('')
  }

  return (
    <div ref={formRef} className="mt-2">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleAdd()
          }
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Enter a title for this card..."
        rows={2}
        autoFocus
        className={projectTextarea}
      />
      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={handleAdd}
          disabled={submitting || !title.trim()}
          className={projectPrimarySmallBtn}
        >
          {submitting ? 'Adding...' : 'Add card'}
        </button>
        <button onClick={onCancel} className={projectMutedIconBtn}>
          <BsX className="text-lg" />
        </button>
      </div>
    </div>
  )
}

// List Column

function ListColumn({
  list,
  cards,
  onAddCard,
  onDeleteCard,
  onDeleteList,
  onOpenCard,
  onStatusList,
  isEditable
}) {
  const [showAddCard, setShowAddCard] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleVal, setTitleVal] = useState(list.title)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const listStatus = getStatusByText(list.title)

  useEffect(() => {
    setTitleVal(list.title)
  }, [list.title])

  useEffect(() => {
    if (!showMenu) return

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const {
    attributes,
    listeners,
    setNodeRef: setListNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `list:${list._id}`,
    data: { type: 'list', listId: list._id },
    disabled: !isEditable
  })

  const { setNodeRef, isOver } = useDroppable({
    id: `list-drop:${list._id}`,
    data: { type: 'list-drop', listId: list._id }
  })

  const cardIds = (cards || []).map((c) => `card:${c._id}`)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setListNodeRef}
      style={style}
      className={`${listColumnBase} ${
        listStatus?.list || listColumnDefault
      }`}
    >
      {/* list header */}
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={listHeader}
      >
        {editingTitle && isEditable ? (
          <input
            autoFocus
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setEditingTitle(false)
              if (e.key === 'Escape') {
                setTitleVal(list.title)
                setEditingTitle(false)
              }
            }}
            className={listTitleInput}
          />
        ) : (
          <h3
            className={`${listTitle} ${!isEditable ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
            onClick={() => isEditable && setEditingTitle(true)}
          >
            {list.title}
          </h3>
        )}
        <div className="relative">
          <button
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu((v) => !v)
            }}
            className={listIconButton}
          >
            <BsThreeDots />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className={listMenu}
              onClick={(e) => e.stopPropagation()}
            >
              {!isEditable ? (
                <div className="p-3 text-sm text-[#d1d9e0]">
                  This board is view-only. List actions are disabled.
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowAddCard(true)
                      setShowMenu(false)
                    }}
                    className={listMenuItem}
                  >
                    Add card
                  </button>
                  <div className={`my-1 border-t border-[#3a424a]`} />
                  {STATUS_LABELS.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => {
                        onStatusList(list, status)
                        setShowMenu(false)
                      }}
                      className={`${listMenuItem} flex items-center gap-2`}
                    >
                      <span className={`w-2 h-2 rounded-full ${status.badge}`} />
                      Set as {status.title}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onDeleteList(list._id)
                      setShowMenu(false)
                    }}
                    className={listMenuDanger}
                  >
                    Delete list
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* cards drop zone */}
      <div
        ref={setNodeRef}
        className={`${listDropZone} ${
          isOver ? listDropZoneOver : ''
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {(cards || []).map((card) => (
            <SortableCard
              key={card._id}
              card={card}
              listId={list._id}
              onDelete={onDeleteCard}
              onOpen={onOpenCard}
              isEditable={isEditable}
            />
          ))}
        </SortableContext>

        {showAddCard && isEditable && (
          <AddCardForm
            listId={list._id}
            onAdd={onAddCard}
            onCancel={() => setShowAddCard(false)}
          />
        )}
      </div>

      {/* add card btn — only shown when editable */}
      {isEditable && !showAddCard && (
        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center gap-1.5 mx-2 mb-2 px-2 py-1.5 rounded-lg text-xs text-[#9fadbc] hover:bg-[#2c333a] hover:text-white transition-colors"
        >
          <BsPlusLg className="text-xs" /> Add a card
        </button>
      )}
    </div>
  )
}

// Add List Form

function AddListForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    await onAdd(title.trim())
    setSubmitting(false)
    setTitle('')
  }

  return (
    <div className={addListPanel}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Enter list title..."
        autoFocus
        className={`${projectInput} mb-2`}
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleAdd}
          disabled={submitting || !title.trim()}
          className={projectPrimarySmallBtn}
        >
          {submitting ? 'Adding...' : 'Add list'}
        </button>
        <button onClick={onCancel} className={projectMutedIconBtn}>
          <BsX className="text-lg" />
        </button>
      </div>
    </div>
  )
}

// Main Project Component

function Project() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const {
    activeProject,
    lists,
    cards,
    loading,
    fetchProject,
    fetchLists,
    fetchCards,
    createList,
    createCard,
    deleteCard,
    deleteList,
    updateList,
    updateCard,
    uploadCardAttachment,
    setActiveProject,
    projects,
    moveCard,
    moveCardBetweenLists,
    reorderLists,
    reorderCardsInList,
    persistCardOrder,
    joinProject,
    leaveProject
  } = useProjectStore()
  const { currentUser } = useAuth()

  const [showAddList, setShowAddList] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [modalCard, setModalCard] = useState(null)
  const [localLists, setLocalLists] = useState([])
  const [listsReady, setListsReady] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const dragStartListId = useRef(null)
  const statusInitBoard = useRef(null)

  useEffect(() => {
    setLocalLists(lists)
  }, [lists])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  //fetch project data and join socket room
  useEffect(() => {
    if (!projectId) return
    setListsReady(false)
    fetchLists(projectId).finally(() => setListsReady(true))
    const project = projects.find((b) => b._id === projectId)
    if (project) setActiveProject(project)
    else fetchProject(projectId)
    joinProject(projectId)

    return () => {
      leaveProject(projectId)
    }
  }, [
    projectId,
    projects,
    fetchProject,
    fetchLists,
    joinProject,
    leaveProject,
    setActiveProject
  ])

  //hydrate every visible list with its current cards
  useEffect(() => {
    localLists.forEach((list) => {
      if (!cards[list._id]) fetchCards(list._id)
    })
  }, [cards, fetchCards, localLists])

  const findListByCardId = useCallback(
    (cardId) => {
      for (const [listId, listCards] of Object.entries(cards)) {
        if (listCards?.some((c) => c._id === cardId)) return listId
      }
      return null
    },
    [cards]
  )

  const getOverListId = (over) => {
    const overData = over?.data.current
    if (!overData) return null
    if (overData.type === 'list' || overData.type === 'list-drop') {
      return overData.listId
    }
    if (overData.type === 'card') return overData.listId
    return null
  }

  const findStatusList = useCallback(
    (status, sourceLists = localLists) =>
      sourceLists.find(
        (list) =>
          normalizeStatusText(list.title) ===
          normalizeStatusText(status.listTitle)
      ),
    [localLists]
  )

  const orderStatusLists = useCallback(
    async (nextLists) => {
      const statusLists = STATUS_LABELS.map((status) =>
        nextLists.find(
          (list) =>
            normalizeStatusText(list.title) ===
            normalizeStatusText(status.listTitle)
        )
      ).filter(Boolean)
      const statusIds = statusLists.map((list) => list._id)
      const rest = nextLists.filter((list) => !statusIds.includes(list._id))
      const ordered = [...statusLists, ...rest]
      setLocalLists(ordered)
      await reorderLists(projectId, ordered)
      return ordered
    },
    [projectId, reorderLists]
  )

  const ensureStatusList = useCallback(
    async (status) => {
      const existing = findStatusList(status)
      if (existing) return existing
      const created = await createList(projectId, status.listTitle)
      if (!created) return null
      const nextLists = [...localLists, created]
      await orderStatusLists(nextLists)
      return created
    },
    [projectId, createList, findStatusList, localLists, orderStatusLists]
  )

  useEffect(() => {
    if (
      !projectId ||
      !listsReady ||
      loading ||
      statusInitBoard.current === projectId
    ) {
      return
    }
    statusInitBoard.current = projectId

    const ensureBoardStatuses = async () => {
      const missingStatuses = STATUS_LABELS.filter(
        (status) => !findStatusList(status)
      )
      if (missingStatuses.length === 0) {
        await orderStatusLists(localLists)
        return
      }
      for (const status of missingStatuses) {
        await createList(projectId, status.listTitle)
      }
      const loadedLists = await fetchLists(projectId)
      await orderStatusLists(loadedLists)
    }

    ensureBoardStatuses()
  }, [
    projectId,
    createList,
    fetchLists,
    findStatusList,
    listsReady,
    loading,
    localLists,
    orderStatusLists
  ])

  // DnD handlers

  const handleDragStart = ({ active }) => {
    const data = active.data.current
    if (data?.type === 'card') {
      const cardId = data.cardId
      const listId = data.listId || findListByCardId(cardId)
      const card = cards[listId]?.find((c) => c._id === cardId)
      dragStartListId.current = listId
      setActiveCard(card)
    } else {
      dragStartListId.current = null
      setActiveCard(null)
    }
  }

  const handleDragOver = ({ active, over }) => {
    if (!over) return
    const activeData = active.data.current
    if (activeData?.type !== 'card') return

    const cardId = activeData.cardId
    const activeListId = findListByCardId(cardId)
    const overListId = getOverListId(over)
    if (!activeListId || !overListId) return

    if (activeListId === overListId && over.data.current?.type === 'card') {
      const listCards = cards[activeListId] || []
      const activeIndex = listCards.findIndex((card) => card._id === cardId)
      const overIndex = listCards.findIndex(
        (card) => card._id === over.data.current.cardId
      )
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        reorderCardsInList(
          activeListId,
          arrayMove(listCards, activeIndex, overIndex)
        )
      }
      return
    }

    if (activeListId !== overListId) {
      const overCards = cards[overListId] || []
      const overIndex =
        over.data.current?.type === 'card'
          ? overCards.findIndex(
              (card) => card._id === over.data.current.cardId
            )
          : overCards.length
      moveCardBetweenLists(cardId, activeListId, overListId, overIndex)
    }
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveCard(null)

    const activeData = active.data.current
    if (!activeData) return
    if (!over) return

    if (activeData.type === 'list') {
      const overData = over.data.current
      if (overData?.type !== 'list') return
      const activeIndex = localLists.findIndex(
        (list) => list._id === activeData.listId
      )
      const overIndex = localLists.findIndex(
        (list) => list._id === overData.listId
      )
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return
      }
      const nextLists = arrayMove(localLists, activeIndex, overIndex)
      setLocalLists(nextLists)
      await reorderLists(projectId, nextLists)
      return
    }

    if (activeData.type === 'card') {
      const cardId = activeData.cardId
      const startListId = dragStartListId.current
      const finalListId = findListByCardId(cardId)
      if (!finalListId) return
      const finalList = localLists.find((list) => list._id === finalListId)
      const finalStatus = getStatusByText(finalList?.title)
      const finalCard = cards[finalListId]?.find((card) => card._id === cardId)

      // Build card patch based on whether the list has a status or not
      let cardPatch = {}
      if (finalCard) {
        if (finalStatus) {
          // If the list has a status, update with that status
          cardPatch = {
            labels: [
              ...getNonStatusLabels(finalCard.labels),
              { text: finalStatus.label, color: finalStatus.color }
            ],
            status: finalStatus.taskStatus
          }
        } else {
          // If it's a custom list (no status), reset labels to blank
          cardPatch = {
            labels: [],
            status: null
          }
        }
      }

      if (Object.keys(cardPatch).length > 0) {
        moveCardBetweenLists(cardId, finalListId, finalListId, null, cardPatch)
      }

      if (startListId && startListId !== finalListId) {
        await moveCard(cardId, finalListId, cardPatch)
        await persistCardOrder(startListId)
      } else if (Object.keys(cardPatch).length > 0) {
        await updateCard(cardId, cardPatch)
      }
      await persistCardOrder(finalListId)
    }
  }

  // Event handlers

  const handleAddList = async (title) => {
    const list = await createList(projectId, title)
    if (!list) {
      toast.error('Could not add list')
      return
    }
    setShowAddList(false)
    toast.success('List added!')
  }

  const handleAddCard = async (listId, cardData) => {
    const list = localLists.find((l) => l._id === listId)
    const status = getStatusByText(list?.title)

    const finalData = { ...cardData }
    if (status) {
      finalData.labels = [{ text: status.label, color: status.color }]
      finalData.status = status.taskStatus
    }

    const card = await createCard(listId, finalData)
    if (!card) {
      toast.error('Could not add card')
      return
    }
    toast.success('Card added!')
  }

  const handleDeleteCard = async (cardId, listId) => {
    await deleteCard(cardId, listId)
    toast.success('Card deleted')
  }

  const handleDeleteList = async (listId) => {
    await deleteList(listId)
    toast.success('List deleted')
  }

  const handleSaveCard = async (cardId, data) => {
    const updated = await updateCard(cardId, data)
    if (!updated) {
      toast.error('Could not update card')
      return
    }
    toast.success('Card updated')
  }

  const handleAttachCardImage = async (cardId, file) => {
    const updated = await uploadCardAttachment(cardId, file)
    if (!updated) {
      toast.error('Could not upload image')
      return
    }
    setModalCard(updated)
    toast.success('Image attached')
  }

  const handleCardStatusChange = async (card, status) => {
    const targetList = await ensureStatusList(status)
    const fromListId = findListByCardId(card._id) || card.listId?.toString()
    if (!targetList || !fromListId) {
      toast.error('Could not resolve status list')
      return
    }

    const labels = [
      ...getNonStatusLabels(card.labels),
      { text: status.label, color: status.color }
    ]
    const cardPatch = { labels, status: status.taskStatus }
    const nextCard = { ...card, ...cardPatch, listId: targetList._id }

    moveCardBetweenLists(card._id, fromListId, targetList._id, null, {
      ...cardPatch
    })
    setModalCard(nextCard)
    const moved = await moveCard(card._id, targetList._id, cardPatch)
    if (!moved) {
      toast.error('Could not move card')
      return
    }
    if (fromListId !== targetList._id) await persistCardOrder(fromListId)
    await persistCardOrder(targetList._id)
    toast.success(`Moved to ${status.title}`)
  }

  const handleListStatusChange = async (list, status) => {
    const updated = await updateList(list._id, { title: status.listTitle })
    if (!updated) {
      toast.error('Could not update list status')
      return
    }
    const nextLists = localLists.map((item) =>
      item._id === list._id
        ? { ...item, ...updated, title: status.listTitle }
        : item
    )
    await orderStatusLists(nextLists)
    toast.success(`List set as ${status.title}`)
  }

  const handlePublishSave = (updatedProject) => {
    setActiveProject(updatedProject)
    setShowPublishModal(false)
  }

  //owner check: only the creator can edit
  const isOwner =
    activeProject?.creatorId?._id?.toString() === currentUser?._id?.toString() ||
    activeProject?.creatorId?.toString() === currentUser?._id?.toString()

  //owner can always edit; others can edit only if isEditable is explicitly true
  const canEdit = isOwner || activeProject?.isEditable === true
  const readOnlyMode = !canEdit

  const projectBg = activeProject?.img
    ? ''
    : activeProject?.color
    ? `bg-linear-to-br ${activeProject.color}`
    : projectFallbackBg
  const projectStyle = activeProject?.img
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), url(${activeProject.img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : undefined

  return (
    <div
      className={`flex flex-col h-screen ${projectBg} overflow-hidden`}
      style={projectStyle}
    >
      {/* project header */}
      <Navbar />
      <div className={projectHeader}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/main-page')}
            className={projectHeaderBtn}
          >
            <BsArrowLeft /> Back
          </button>
          <h1 className={projectHeaderTitle}>
            {activeProject?.title || 'Project'}
          </h1>
          {!canEdit && (
            <span className="rounded-full bg-[#2f3741] px-3 py-1 text-xs uppercase tracking-widest text-[#8c9bab]">
              View-only board
            </span>
          )}
          {activeProject?.isPublished && (
            <span className="rounded-full bg-[#164b35] px-3 py-1 text-xs uppercase tracking-widest text-[#4caf50]">
              Published
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* publish button — only shown to the board owner */}
          {isOwner && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#216e4e] hover:bg-[#1e6045] text-white transition-colors"
            >
              🚀 {activeProject?.isPublished ? 'Edit Publish' : 'Publish'}
            </button>
          )}
          <button className={projectShareBtn}>
            <BsPeopleFill className="text-xs" /> Share
          </button>
        </div>
      </div>

      <div className={projectStatusBar}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={projectStatusBarLabel}>Status labels</span>
          {STATUS_LABELS.map((status) => (
            <button
              key={status.id}
              onClick={() => ensureStatusList(status)}
              className={`${projectStatusPillBase} ${status.pill}`}
              title={`Cards marked ${status.title} move to the ${status.listTitle} list`}
            >
              {status.title}
            </button>
          ))}
          {!canEdit && (
            <span className="text-sm text-[#9fadbc] ml-3">
              View-only mode: editing disabled.
            </span>
          )}
        </div>
      </div>

      {/* lists area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={projectCanvas}>
          <div className={projectListRow}>
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <SortableContext
                  items={localLists.map((list) => `list:${list._id}`)}
                  strategy={horizontalListSortingStrategy}
                >
                  {localLists.map((list) => (
                    <ListColumn
                      key={list._id}
                      list={list}
                      cards={cards[list._id]}
                      onAddCard={handleAddCard}
                      onDeleteCard={handleDeleteCard}
                      onDeleteList={handleDeleteList}
                      onOpenCard={setModalCard}
                      onStatusList={handleListStatusChange}
                      isEditable={canEdit}
                    />
                  ))}
                </SortableContext>

                {showAddList ? (
                  <AddListForm
                    onAdd={handleAddList}
                    onCancel={() => setShowAddList(false)}
                  />
                ) : canEdit ? (
                  <button
                    onClick={() => setShowAddList(true)}
                    className={addListButton}
                  >
                    <BsPlusLg className="text-xs" /> Add another list
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mx-2 mb-2 px-3 py-2 rounded-lg border border-[#3a424a] text-xs text-[#9fadbc]">
                    This board is view-only. Lists cannot be added.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? <DragCard card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>

      {/* card detail modal */}
      {modalCard && (
        <CardDetailModal
          card={modalCard}
          listTitle={
            localLists.find(
              (l) =>
                l._id ===
                (modalCard.listId?.toString() ||
                  findListByCardId(modalCard._id))
            )?.title || 'List'
          }
          onClose={() => setModalCard(null)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onStatusChange={handleCardStatusChange}
          onAttach={handleAttachCardImage}
          readOnly={readOnlyMode}
        />
      )}

      {/* publish modal */}
      {showPublishModal && (
        <PublishForm
          project={activeProject}
          onClose={() => setShowPublishModal(false)}
          onSave={handlePublishSave}
        />
      )}
    </div>
  )
}

export default Project
