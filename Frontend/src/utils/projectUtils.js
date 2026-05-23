import { statusLabelStyles } from '../Styles/common'

export const TEMPLATE_CATEGORIES = [
  'Business',
  'Personal',
  'Education',
  'Engineering',
  'Marketing',
  'HR & Operations'
]

export const STATUS_LABELS = [
  { id: 'todo', ...statusLabelStyles.todo },
  { id: 'inProgress', ...statusLabelStyles.inProgress },
  { id: 'done', ...statusLabelStyles.done }
]

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', className: 'bg-slate-500/20 text-slate-200' },
  {
    value: 'MEDIUM',
    label: 'Medium',
    className: 'bg-blue-500/20 text-blue-200'
  },
  { value: 'HIGH', label: 'High', className: 'bg-amber-500/20 text-amber-200' },
  { value: 'URGENT', label: 'Urgent', className: 'bg-red-500/20 text-red-200' }
]

export const RECURRING_OPTIONS = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']

export const blankChecklist = { title: 'Checklist', items: [] }

export const LABEL_PRESETS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-gray-500'
]

export const LABEL_COLOR_VALUES = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'pink',
  'gray'
]

export const LABEL_COLOR_CLASS = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500'
}

export const avatarClasses = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-slate-500'
]

export const getPriorityMeta = (priority = 'MEDIUM') =>
  PRIORITY_OPTIONS.find((item) => item.value === priority) ||
  PRIORITY_OPTIONS[1]

export const normalizeStatusText = (value = '') =>
  value.toLowerCase().replace(/[\s_-]+/g, '')

export const getStatusByText = (value = '') =>
  STATUS_LABELS.find(
    (status) =>
      normalizeStatusText(status.title) === normalizeStatusText(value) ||
      normalizeStatusText(status.label) === normalizeStatusText(value) ||
      normalizeStatusText(status.listTitle) === normalizeStatusText(value)
  )

export const getCardStatus = (card) =>
  card?.labels?.map((label) => getStatusByText(label.text)).find(Boolean) ||
  null

export const getNonStatusLabels = (labels = []) =>
  labels.filter((label) => !getStatusByText(label.text))

export const getLabelColorClass = (color) =>
  LABEL_COLOR_CLASS[color] || 'bg-gray-500'

export const getId = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return (
    value._id?.toString() || value.id?.toString() || value.toString?.() || ''
  )
}

export const getInitials = (name = 'User') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

export const getAvatarClass = (name = '') => {
  const hash = name
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0)
  return avatarClasses[hash % avatarClasses.length]
}

export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const getDueDateMeta = (date) => {
  if (!date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(date)
  due.setHours(0, 0, 0, 0)
  if (due < today) return 'bg-red-500/20 text-red-300'
  if (due.getTime() === today.getTime()) return 'bg-amber-500/20 text-amber-300'
  return 'text-[#a1a1aa] bg-black/20' // dashboardMutedColor is text-[#a1a1aa]
}

export const timeAgo = (dateStr) => {
  if (!dateStr) return 'Recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.max(0, Math.floor(diff / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export const normalizeMember = (member) => member?.user || member
