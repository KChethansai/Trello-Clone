import { memo, useState, useEffect, useRef } from 'react'
import {
  BsX,
  BsCalendar,
  BsPaperclip,
  BsCheckSquare,
  BsChat,
  BsClock,
  BsPencil
} from 'react-icons/bs'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  cardDeleteBtn,
  cardMetaText,
  cardOverlay,
  cardSurface,
  cardText,
  projectInput,
  projectMutedIconBtn,
  projectPrimarySmallBtn,
  projectTextarea,
  dashboardTextColor
} from '../Styles/common'
import {
  getCardStatus,
  getPriorityMeta,
  getDueDateMeta,
  getNonStatusLabels,
  getLabelColorClass,
  getAvatarClass,
  getInitials,
  formatShortDate,
  PRIORITY_OPTIONS
} from '../utils/projectUtils'

export const SortableCard = memo(function SortableCard({
  card,
  listId,
  onDelete,
  onOpen,
  onQuickUpdate,
  isEditable
}) {
  const sortableId = `card:${card._id}`
  const status = getCardStatus(card)
  const priority = getPriorityMeta(card.priority)
  const assignedMember =
    typeof card.memberId === 'object' ? card.memberId : null
  const commentCount = card.commentCount ?? card.comments?.length ?? 0
  const dueMeta = getDueDateMeta(card.dueDate)
  const nonStatusLabels = getNonStatusLabels(card.labels || [])
  const checklistTotal = (card.checklists || []).reduce(
    (total, checklist) => total + (checklist.items?.length || 0),
    0
  )
  const checklistDone = (card.checklists || []).reduce(
    (total, checklist) =>
      total + (checklist.items || []).filter((item) => item.completed).length,
    0
  )
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
    transition: transition || 'transform 180ms ease, opacity 160ms ease',
    opacity: isDragging ? 0.4 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-card-id={card._id}
      {...attributes}
      {...listeners}
      className={cardSurface}
      onClick={() => onOpen(card)}
    >
      {(card.coverImage?.url || card.attachment?.[0]?.url) && (
        <img
          src={card.coverImage?.url || card.attachment[0].url}
          alt=""
          className="mb-2 h-24 w-full rounded-md object-cover"
        />
      )}
      <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpen(card)
          }}
          className={cardDeleteBtn}
          aria-label="Edit card"
        >
          <BsPencil />
        </button>
        {isEditable && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card._id, listId)
            }}
            className={cardDeleteBtn}
            aria-label="Delete card"
          >
            <BsX />
          </button>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 pr-8">
        <p className={cardText}>{card.title}</p>
      </div>

      {nonStatusLabels.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {nonStatusLabels.map((label, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold text-white ${getLabelColorClass(label.color)}`}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${priority.className}`}
        >
          {priority.label}
        </span>
        {card.recurring?.enabled && (
          <span
            className={`${cardMetaText} mt-0 rounded-md bg-black/20 px-2 py-1`}
          >
            {card.recurring.interval}
          </span>
        )}
      </div>

      {!card.labels?.length && status && (
        <div className="flex gap-1 mt-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.badge}`}
          >
            {status.title}
          </span>
        </div>
      )}

      {(card.dueDate ||
        card.attachment?.length ||
        commentCount ||
        card.estimatedMinutes ||
        checklistTotal) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {card.dueDate && (
            <span
              className={`${cardMetaText} ${dueMeta} mt-0 rounded-md px-2 py-1`}
            >
              <BsCalendar className="text-[10px]" />
              {formatShortDate(card.dueDate)}
            </span>
          )}
          {card.attachment?.length > 0 && (
            <span
              className={`${cardMetaText} mt-0 rounded-md bg-black/20 px-2 py-1`}
            >
              <BsPaperclip className="text-[10px]" />
              {card.attachment.length}
            </span>
          )}
          {card.estimatedMinutes > 0 && (
            <span
              className={`${cardMetaText} mt-0 rounded-md bg-black/20 px-2 py-1`}
            >
              <BsClock className="text-[10px]" />
              {card.estimatedMinutes}m
            </span>
          )}
          {checklistTotal > 0 && (
            <span
              className={`${cardMetaText} mt-0 rounded-md bg-black/20 px-2 py-1`}
            >
              <BsCheckSquare className="text-[10px]" />
              {checklistDone}/{checklistTotal}
            </span>
          )}
          {commentCount > 0 && (
            <span
              className={`${cardMetaText} mt-0 rounded-md bg-black/20 px-2 py-1`}
            >
              <BsChat className="text-[10px]" />
              {commentCount}
            </span>
          )}
        </div>
      )}
      {assignedMember && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (isEditable) onQuickUpdate?.(card._id, { memberId: null })
          }}
          className={`mt-3 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarClass(assignedMember.name || assignedMember.email)}`}
          title={
            isEditable
              ? 'Click to unassign'
              : assignedMember.name || assignedMember.email
          }
        >
          {getInitials(assignedMember.name || assignedMember.email)}
        </button>
      )}
    </div>
  )
})

export function DragCard({ card, width }) {
  return (
    <div
      className={`${cardOverlay} scale-[1.03]`}
      style={width ? { width } : undefined}
    >
      <p className={`text-sm ${dashboardTextColor}`}>{card.title}</p>
    </div>
  )
}

export function AddCardForm({ listId, onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
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
    await onAdd(listId, {
      title: title.trim(),
      dueDate: dueDate || null,
      priority
    })
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
      <div className="grid grid-cols-2 gap-2 mt-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={projectInput}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={projectInput}
        >
          {PRIORITY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
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
