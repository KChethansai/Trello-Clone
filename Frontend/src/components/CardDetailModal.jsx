import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  BsX,
  BsTrash,
  BsCalendar,
  BsTag,
  BsPaperclip,
  BsChatLeft,
  BsCheckSquare,
  BsPlusLg,
  BsPersonPlus,
  BsCalendarCheck,
  BsReply
} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../config/api'
import {
  modalBackdrop,
  modalPanel,
  modalHeader,
  modalTitleInput,
  modalMutedText,
  modalSectionTitle,
  modalTextarea,
  modalActionBtn,
  modalDangerBtn,
  modalPrimaryBtn,
  modalCancelBtn,
  projectMutedIconBtn,
  projectInput,
  projectPrimarySmallBtn,
  projectStatusPillBase,
  projectStatusPillActive,
  dashboardMutedColor,
  dashboardBorderColor,
  dashboardTextColor,
  dashboardSurfaceColor
} from '../Styles/common'
import {
  STATUS_LABELS,
  PRIORITY_OPTIONS,
  RECURRING_OPTIONS,
  LABEL_COLOR_VALUES,
  LABEL_PRESETS,
  blankChecklist,
  getCardStatus,
  getNonStatusLabels,
  getStatusByText,
  getLabelColorClass,
  getId,
  getInitials,
  getAvatarClass,
  timeAgo,
  normalizeMember
} from '../utils/projectUtils'

export default function CardDetailModal({
  card,
  listTitle,
  onClose,
  onSave,
  onDelete,
  onStatusChange,
  onAttach,
  onTyping,
  typingUsers,
  currentUser,
  readOnly,
  members = [],
  onQuickUpdate,
  onCommentCountChange
}) {
  const [title, setTitle] = useState(card.title || '')
  const [desc, setDesc] = useState(card.description || '')
  const [richDescription, setRichDescription] = useState(
    card.richDescription || card.description || ''
  )
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().slice(0, 10) : ''
  )
  const [priority, setPriority] = useState(card.priority || 'MEDIUM')
  const [labelText, setLabelText] = useState('')
  const [labels, setLabels] = useState(card.labels || [])
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    card.estimatedMinutes || 0
  )
  const [recurring, setRecurring] = useState(
    card.recurring || { enabled: false, interval: 'NONE', nextRunAt: null }
  )
  const [subtasks, setSubtasks] = useState(card.subtasks || [])
  const [checklists, setChecklists] = useState(
    card.checklists?.length ? card.checklists : [blankChecklist]
  )
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(card.comments || [])
  const [reactions, setReactions] = useState(card.reactions || [])
  const [saving, setSaving] = useState(false)
  const [attaching, setAttaching] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [postingComment, setPostingComment] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showLabels, setShowLabels] = useState(false)
  const [selectedLabelColor, setSelectedLabelColor] = useState(
    LABEL_COLOR_VALUES[0]
  )
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const fileInputRef = useRef(null)
  const typingTimer = useRef(null)
  const activeStatus = getCardStatus(card)
  const nonStatusLabels = getNonStatusLabels(labels)
  const memberList = members.map(normalizeMember).filter(Boolean)
  const assignedMemberId = getId(card.memberId)
  const assignedMember =
    memberList.find((member) => getId(member) === assignedMemberId) ||
    (typeof card.memberId === 'object' ? card.memberId : null)
  const visibleTypingUsers = Object.values(typingUsers || {}).filter(
    (user) => (user._id || user.id) !== currentUser?._id
  )

  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/api/comment/${card._id}`, {
          withCredentials: true
        })
        const nextComments = res.data.payload || []
        setComments(nextComments)
        onCommentCountChange?.(card._id, nextComments.length)
      } catch {
        setComments([])
      } finally {
        setCommentsLoading(false)
      }
    }

    loadComments()
  }, [card._id, onCommentCountChange])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

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
    await onSave(card._id, {
      title: title.trim(),
      description: desc,
      richDescription,
      dueDate: dueDate || null,
      priority,
      labels,
      estimatedMinutes: Number(estimatedMinutes) || 0,
      recurring,
      subtasks,
      checklists,
      reactions
    })
    setSaving(false)
    onClose()
  }

  const handleTyping = () => {
    if (readOnly || !onTyping) return
    onTyping(card._id, true)
    window.clearTimeout(typingTimer.current)
    typingTimer.current = window.setTimeout(() => {
      onTyping(card._id, false)
    }, 900)
  }

  const addLabel = () => {
    if (!labelText.trim()) return
    const nextLabels = [
      ...nonStatusLabels,
      { text: labelText.trim(), color: selectedLabelColor }
    ]
    setLabels([
      ...labels.filter((label) => getStatusByText(label.text)),
      ...nextLabels
    ])
    onQuickUpdate?.(card._id, {
      labels: [
        ...labels.filter((label) => getStatusByText(label.text)),
        ...nextLabels
      ]
    })
    setLabelText('')
  }

  const removeLabel = (index) => {
    const statusLabels = labels.filter((label) => getStatusByText(label.text))
    const nextNonStatus = nonStatusLabels.filter((_, idx) => idx !== index)
    const nextLabels = [...statusLabels, ...nextNonStatus]
    setLabels(nextLabels)
    onQuickUpdate?.(card._id, { labels: nextLabels })
  }

  const addComment = async () => {
    if (!commentText.trim()) return
    setPostingComment(true)
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/comment`,
        { taskId: card._id, body: commentText.trim() },
        { withCredentials: true }
      )
      const nextComments = [res.data.payload, ...comments]
      setComments(nextComments)
      onCommentCountChange?.(card._id, nextComments.length)
      setCommentText('')
      toast.success('Comment added')
    } catch {
      toast.error('Could not add comment')
    } finally {
      setPostingComment(false)
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/comment/${commentId}`, {
        withCredentials: true
      })
      const nextComments = comments.filter(
        (comment) => comment._id !== commentId
      )
      setComments(nextComments)
      onCommentCountChange?.(card._id, nextComments.length)
      toast.success('Comment deleted')
    } catch {
      toast.error('Could not delete comment')
    }
  }

  const handleAssignMember = async (memberId) => {
    const updated = await onQuickUpdate?.(card._id, { memberId })
    if (updated) toast.success(memberId ? 'Member assigned' : 'Member removed')
    setShowMembers(false)
  }

  const handleDateChange = async (value) => {
    setDueDate(value)
    const updated = await onQuickUpdate?.(card._id, { dueDate: value || null })
    if (updated) toast.success(value ? 'Due date updated' : 'Due date cleared')
  }

  useEffect(() => {
    return () => window.clearTimeout(typingTimer.current)
  }, [])

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
              <p className={`text-sm ${dashboardMutedColor} mt-2`}>
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

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:flex-row">
          {/* main content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BsChatLeft className={`${dashboardMutedColor} text-sm`} />
                <h3 className={modalSectionTitle}>Description</h3>
              </div>
              <textarea
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value)
                  handleTyping()
                }}
                placeholder="Add a more detailed description..."
                rows={4}
                className={modalTextarea}
                readOnly={readOnly}
              />
              <textarea
                value={richDescription}
                onChange={(e) => {
                  setRichDescription(e.target.value)
                  handleTyping()
                }}
                placeholder="Rich notes, acceptance criteria, links, or @mentions..."
                rows={5}
                className={`${modalTextarea} mt-3`}
                readOnly={readOnly}
              />
              {visibleTypingUsers.length > 0 && (
                <p className={`mt-2 text-xs ${dashboardMutedColor}`}>
                  {visibleTypingUsers.map((user) => user.name).join(', ')}{' '}
                  typing...
                </p>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BsCheckSquare className={`${dashboardMutedColor} text-sm`} />
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

            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <label className={`text-xs ${dashboardMutedColor}`}>
                Due date
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  readOnly={readOnly}
                  className={`${projectInput} mt-1`}
                />
              </label>
              <label className={`text-xs ${dashboardMutedColor}`}>
                Priority
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={readOnly}
                  className={`${projectInput} mt-1`}
                >
                  {PRIORITY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={`text-xs ${dashboardMutedColor}`}>
                Estimate
                <input
                  type="number"
                  min="0"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  readOnly={readOnly}
                  className={`${projectInput} mt-1`}
                  placeholder="Minutes"
                />
              </label>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className={`text-xs ${dashboardMutedColor}`}>
                Recurrence
                <select
                  value={recurring.interval || 'NONE'}
                  onChange={(e) =>
                    setRecurring({
                      ...recurring,
                      enabled: e.target.value !== 'NONE',
                      interval: e.target.value
                    })
                  }
                  disabled={readOnly}
                  className={`${projectInput} mt-1`}
                >
                  {RECURRING_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className={`text-xs ${dashboardMutedColor}`}>
                Labels
                <div className="mt-1 flex gap-2">
                  <input
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                    readOnly={readOnly}
                    className={projectInput}
                    placeholder="Add label"
                  />
                  {!readOnly && (
                    <button
                      onClick={addLabel}
                      className={projectPrimarySmallBtn}
                    >
                      Add
                    </button>
                  )}
                </div>
                {!readOnly && showLabels && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {LABEL_COLOR_VALUES.map((value, index) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedLabelColor(value)}
                        className={`h-6 w-6 rounded-full ${LABEL_PRESETS[index]} ${
                          selectedLabelColor === value
                            ? 'ring-2 ring-white'
                            : ''
                        }`}
                        aria-label={`Choose ${value} label`}
                      />
                    ))}
                  </div>
                )}
              </label>
            </div>

            {labels?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BsTag className={`${dashboardMutedColor} text-sm`} />
                  <h3 className={modalSectionTitle}>Labels</h3>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {nonStatusLabels.map((label, i) => (
                    <span
                      key={i}
                      onClick={() => !readOnly && removeLabel(i)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold text-white ${getLabelColorClass(label.color)} ${readOnly ? '' : 'cursor-pointer'}`}
                    >
                      {label.text}
                      {!readOnly && <span className="ml-1">x</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.dueDate && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <BsCalendar className={`${dashboardMutedColor} text-sm`} />
                  <h3 className={modalSectionTitle}>Due Date</h3>
                </div>
                <span className={`text-sm ${dashboardTextColor}`}>
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
                  <BsPaperclip className={`${dashboardMutedColor} text-sm`} />
                  <h3 className={modalSectionTitle}>Attachments</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {card.attachment.map((item, index) => (
                    <a
                      key={`${item.url}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`block overflow-hidden rounded-lg bg-[#18181b] border ${dashboardBorderColor}`}
                    >
                      <img
                        src={item.url}
                        alt={item.name || 'Card attachment'}
                        className="h-24 w-full object-cover"
                      />
                      <span
                        className={`block truncate px-2 py-1 text-[11px] ${dashboardTextColor}`}
                      >
                        {item.name || 'Image attachment'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BsCheckSquare className={`${dashboardMutedColor} text-sm`} />
                <h3 className={modalSectionTitle}>Subtasks</h3>
              </div>
              <div className="space-y-2">
                {subtasks.map((item, index) => (
                  <label
                    key={`${item.title}-${index}`}
                    className={`flex items-center gap-2 rounded-lg border ${dashboardBorderColor} bg-[#18181b] px-3 py-2 text-sm ${dashboardTextColor}`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(item.completed)}
                      disabled={readOnly}
                      onChange={(e) =>
                        setSubtasks((items) =>
                          items.map((entry, idx) =>
                            idx === index
                              ? { ...entry, completed: e.target.checked }
                              : entry
                          )
                        )
                      }
                    />
                    <span
                      className={
                        item.completed ? 'line-through opacity-60' : ''
                      }
                    >
                      {item.title}
                    </span>
                  </label>
                ))}
                {!readOnly && (
                  <button
                    className={modalActionBtn}
                    onClick={() =>
                      setSubtasks((items) => [
                        ...items,
                        {
                          title: `Subtask ${items.length + 1}`,
                          completed: false
                        }
                      ])
                    }
                  >
                    <BsPlusLg /> Add subtask
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BsCheckSquare className={`${dashboardMutedColor} text-sm`} />
                <h3 className={modalSectionTitle}>Checklist</h3>
              </div>
              {checklists.map((checklist, checklistIndex) => (
                <div key={checklistIndex} className="mb-3 space-y-2">
                  <input
                    value={checklist.title}
                    onChange={(e) =>
                      setChecklists((items) =>
                        items.map((entry, idx) =>
                          idx === checklistIndex
                            ? { ...entry, title: e.target.value }
                            : entry
                        )
                      )
                    }
                    readOnly={readOnly}
                    className={projectInput}
                  />
                  {(checklist.items || []).map((item, itemIndex) => (
                    <label
                      key={`${item.title}-${itemIndex}`}
                      className={`flex items-center gap-2 text-sm ${dashboardTextColor}`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(item.completed)}
                        disabled={readOnly}
                        onChange={(e) =>
                          setChecklists((items) =>
                            items.map((entry, idx) =>
                              idx === checklistIndex
                                ? {
                                    ...entry,
                                    items: entry.items.map(
                                      (checkItem, checkIdx) =>
                                        checkIdx === itemIndex
                                          ? {
                                              ...checkItem,
                                              completed: e.target.checked
                                            }
                                          : checkItem
                                    )
                                  }
                                : entry
                            )
                          )
                        }
                      />
                      <span
                        className={
                          item.completed ? 'line-through opacity-60' : ''
                        }
                      >
                        {item.title}
                      </span>
                    </label>
                  ))}
                  {!readOnly && (
                    <button
                      className={modalActionBtn}
                      onClick={() =>
                        setChecklists((items) =>
                          items.map((entry, idx) =>
                            idx === checklistIndex
                              ? {
                                  ...entry,
                                  items: [
                                    ...(entry.items || []),
                                    {
                                      title: `Item ${(entry.items || []).length + 1}`,
                                      completed: false
                                    }
                                  ]
                                }
                              : entry
                          )
                        )
                      }
                    >
                      <BsPlusLg /> Add item
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BsChatLeft className={`${dashboardMutedColor} text-sm`} />
                <h3 className={modalSectionTitle}>Comments</h3>
              </div>
              <div className="space-y-2">
                {commentsLoading ? (
                  <div
                    className={`rounded-lg border ${dashboardBorderColor} ${dashboardSurfaceColor} p-3 text-xs ${dashboardMutedColor}`}
                  >
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div
                    className={`rounded-lg border ${dashboardBorderColor} ${dashboardSurfaceColor} p-3 text-xs ${dashboardMutedColor}`}
                  >
                    No comments yet.
                  </div>
                ) : (
                  comments.map((comment) => {
                    const isOwn = getId(comment.author) === currentUser?._id
                    const authorName =
                      comment.author?.name || comment.authorName || 'Teammate'
                    return (
                      <div
                        key={comment._id || comment.createdAt}
                        className={`rounded-lg border ${dashboardBorderColor} ${dashboardSurfaceColor} p-3`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold ${dashboardTextColor}`}
                            >
                              {authorName}
                            </p>
                            <p className={`mt-1 text-sm ${dashboardTextColor}`}>
                              {comment.body}
                            </p>
                          </div>
                          {isOwn && !readOnly && (
                            <button
                              type="button"
                              onClick={() => deleteComment(comment._id)}
                              className={`${dashboardMutedColor} hover:text-white`}
                              aria-label="Delete comment"
                            >
                              <BsTrash />
                            </button>
                          )}
                        </div>
                        <div
                          className={`mt-2 flex items-center gap-3 text-xs ${dashboardMutedColor}`}
                        >
                          <span>{timeAgo(comment.createdAt)}</span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 hover:text-white"
                            onClick={() => setCommentText(`@${authorName} `)}
                          >
                            <BsReply /> Reply
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              {!readOnly && (
                <div className="mt-3">
                  <textarea
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value)
                      handleTyping()
                    }}
                    rows={2}
                    placeholder="Write a comment with @mentions..."
                    className={modalTextarea}
                  />
                  <button
                    className={`${projectPrimarySmallBtn} mt-2`}
                    onClick={() => addComment()}
                    disabled={postingComment || !commentText.trim()}
                  >
                    {postingComment ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* sidebar actions */}
          <div className="flex shrink-0 flex-col gap-2 lg:w-40">
            <p
              className={`text-xs font-semibold ${dashboardMutedColor} uppercase tracking-wide mb-1`}
            >
              Actions
            </p>
            <button
              className={modalActionBtn}
              onClick={() => !readOnly && setShowMembers((open) => !open)}
              disabled={readOnly}
            >
              <BsPersonPlus /> Members
            </button>
            {showMembers && (
              <div
                className={`rounded-lg border ${dashboardBorderColor} ${dashboardSurfaceColor} p-2`}
              >
                {assignedMember && (
                  <button
                    type="button"
                    onClick={() => handleAssignMember(null)}
                    className={`${modalActionBtn} mb-1 w-full`}
                  >
                    Unassign {assignedMember.name || assignedMember.email}
                  </button>
                )}
                {memberList.length === 0 ? (
                  <p className={`px-2 py-1 text-xs ${dashboardMutedColor}`}>
                    No members available.
                  </p>
                ) : (
                  memberList.map((member) => (
                    <button
                      key={getId(member)}
                      type="button"
                      onClick={() => handleAssignMember(getId(member))}
                      className={`${modalActionBtn} w-full`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarClass(member.name || member.email)}`}
                      >
                        {getInitials(member.name || member.email)}
                      </span>
                      {member.name || member.email}
                    </button>
                  ))
                )}
              </div>
            )}
            <button
              className={modalActionBtn}
              onClick={() => !readOnly && setShowLabels((open) => !open)}
              disabled={readOnly}
            >
              <BsTag /> Labels
            </button>
            <button className={modalActionBtn}>
              <BsEye /> {card.watchers?.length || 0} watching
            </button>
            <div className="flex flex-wrap gap-1">
              {['+1', 'Hot', 'Done'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  disabled={readOnly}
                  onClick={() =>
                    setReactions((items) => [
                      ...items,
                      { emoji, userId: currentUser?._id }
                    ])
                  }
                  className="rounded-md bg-[#18181b] px-2 py-1 text-sm hover:bg-[#27272a] disabled:opacity-60"
                >
                  {emoji}{' '}
                  {reactions.filter((item) => item.emoji === emoji).length}
                </button>
              ))}
            </div>
            {!readOnly && (
              <>
                {[
                  { icon: <BsCheckSquare />, label: 'Checklist' },
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
                <button
                  onClick={() => setShowDatePicker((open) => !open)}
                  className={modalActionBtn}
                >
                  <BsCalendarCheck /> Dates
                </button>
                {showDatePicker && (
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={projectInput}
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAttachImage}
                />
                {attaching && (
                  <p className={`text-[11px] ${dashboardMutedColor} px-1`}>
                    Uploading image...
                  </p>
                )}
                <hr className={`${dashboardBorderColor} my-1`} />
                {deleteConfirm ? (
                  <div
                    className={`rounded-lg border ${dashboardBorderColor} ${dashboardSurfaceColor} p-2`}
                  >
                    <p className={`mb-2 text-xs ${dashboardMutedColor}`}>
                      Delete this card?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onDelete(card._id, card.listId?.toString() || '')
                          onClose()
                        }}
                        className={modalDangerBtn}
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className={modalActionBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className={modalDangerBtn}
                  >
                    <BsTrash /> Delete
                  </button>
                )}
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
              <button onClick={onClose} className={modalCancelBtn}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={onClose} className={modalPrimaryBtn}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
import { BsEye } from 'react-icons/bs'
