import { useNavigate } from 'react-router-dom'
import {
  BsX,
  BsHeart,
  BsHeartFill,
  BsPerson,
  BsCalendar3,
  BsLockFill,
  BsBoxArrowUpRight,
  BsPencil
} from 'react-icons/bs'
import {
  successBg,
  accentBg,
  errorText,
  errorBg,
  errorBgHover,
  successText,
  dashboardMutedColor,
  dashboardBgColor,
  dashboardBorderColor,
  dashboardPrimaryBg,
  dashboardPrimaryBgHover,
  dashboardPrimaryText,
  dashboardSurfaceColor,
  dashboardSurfaceHover,
  dashboardTextColor
} from '../Styles/common'

const linears = [
  'from-blue-500 to-blue-700',
  'from-violet-500 to-purple-700',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-rose-500',
  'from-slate-500 to-slate-700',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500'
]

function cardLinear(title) {
  let hash = 0
  for (let i = 0; i < (title || '').length; i++) {
    hash += title.charCodeAt(i)
  }
  return linears[hash % linears.length]
}

export default function TemplateDetailPanel({
  template,
  onClose,
  isOwner,
  onEdit,
  onDelete,
  onToggleFav
}) {
  const navigate = useNavigate()
  const linear = cardLinear(template.title)

  const canUse =
    isOwner ||
    template.isEditable ||
    template.allowPublicEdit ||
    template.type === 'project'

  const handleUseTemplate = () => {
    navigate(`/projects/${template._id}`)
  }

  const formattedDate = template.createdAt
    ? new Date(template.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />

      <div className="premium-card fixed right-0 top-0 h-full w-full max-w-[420px] z-40 border-l border-white/[0.08] flex flex-col animate-slide-in">
        {/* hero */}
        <div className="relative h-44 shrink-0">
          {template.images?.[0] ? (
            <img
              src={template.images[0]}
              alt={template.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${linear}`} />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <BsX size={18} />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {template.isPublished && (
              <span
                className={`${successBg} text-white text-[10px] px-2 py-1 rounded-full font-bold`}
              >
                PUBLISHED
              </span>
            )}
            {template.type === 'project' && (
              <span
                className={`${accentBg} text-white text-[10px] px-2 py-1 rounded-full font-bold`}
              >
                PROJECT
              </span>
            )}
          </div>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-white text-xl font-bold leading-snug">
              {template.title}
            </h2>
            <button
              onClick={() => onToggleFav(template._id)}
              className={`shrink-0 w-8 h-8 rounded-lg ${dashboardBgColor} flex items-center justify-center ${dashboardSurfaceHover} transition-colors`}
            >
              {template.favourite ? (
                <BsHeartFill className={`${errorText} text-sm`} />
              ) : (
                <BsHeart className={`${dashboardMutedColor} text-sm`} />
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            <span
              className={`flex items-center gap-1.5 ${dashboardMutedColor} text-xs`}
            >
              <BsPerson size={12} />
              {template.creatorName}
            </span>
            {formattedDate && (
              <span
                className={`flex items-center gap-1.5 ${dashboardMutedColor} text-xs`}
              >
                <BsCalendar3 size={11} />
                {formattedDate}
              </span>
            )}
            <span
              className={`${dashboardBgColor} px-2 py-0.5 rounded text-[10px] ${dashboardMutedColor}`}
            >
              {template.category}
            </span>
          </div>

          {template.description ? (
            <p className={`${dashboardTextColor} text-sm leading-relaxed mb-6`}>
              {template.description}
            </p>
          ) : (
            <p className="text-[#6b7280] text-sm italic mb-6">
              No description provided.
            </p>
          )}

          {/* permissions */}
          <div
            className={`rounded-xl border border-[#27272a] ${dashboardBgColor} p-4 mb-6`}
          >
            <p
              className={`text-xs ${dashboardMutedColor} font-medium mb-3 uppercase tracking-wide`}
            >
              Permissions
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${dashboardTextColor}`}>
                  Editable
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    template.isEditable || template.allowPublicEdit
                      ? 'bg-green-500/15 text-green-300'
                      : 'bg-[#e11d48]/10 text-[#fb7185]'
                  }`}
                >
                  {template.isEditable || template.allowPublicEdit
                    ? 'Yes'
                    : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${dashboardTextColor}`}>
                  View Only
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    template.isViewOnly
                      ? 'bg-amber-500/15 text-amber-200'
                      : 'bg-[#18181b] text-[#d2dbcc]'
                  }`}
                >
                  {template.isViewOnly ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* use template / locked */}
          {canUse ? (
            <button
              onClick={handleUseTemplate}
              className={`w-full h-11 rounded-xl ${dashboardPrimaryBg} ${dashboardPrimaryBgHover} ${dashboardPrimaryText} font-semibold text-sm transition-colors flex items-center justify-center gap-2`}
            >
              <BsBoxArrowUpRight size={14} />
              Use Template
            </button>
          ) : (
            <div
              className={`w-full rounded-xl border ${dashboardBorderColor} ${dashboardBgColor} p-4 flex items-center gap-3`}
            >
              <BsLockFill
                className={`${dashboardMutedColor} shrink-0`}
                size={16}
              />
              <div>
                <p className="text-white text-sm font-medium">
                  Template is locked
                </p>
                <p className={`${dashboardMutedColor} text-xs mt-0.5`}>
                  This template is view-only and cannot be edited.
                </p>
              </div>
            </div>
          )}

          {/* owner actions */}
          {isOwner && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  onClose()
                  onEdit(template)
                }}
                className={`flex-1 h-9 rounded-lg ${dashboardSurfaceColor} ${dashboardSurfaceHover} ${dashboardMutedColor} hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2`}
              >
                <BsPencil size={13} /> Edit
              </button>
              <button
                onClick={() => {
                  onClose()
                  onDelete(template._id)
                }}
                className={`flex-1 h-9 rounded-lg ${errorBg} ${errorBgHover} ${errorText} text-sm font-medium transition-colors flex items-center justify-center gap-2`}
              >
                <BsX size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </>
  )
}
