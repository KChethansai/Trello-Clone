import { BsHeart, BsHeartFill, BsLockFill } from 'react-icons/bs'
import {
  errorText,
  successBg,
  successText,
  dashboardMutedColor,
  dashboardBgColor
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

export default function TemplateCard({ template, onToggleFav, isOwner, onClick }) {
  const linear = cardLinear(template.title)

  return (
    <div
      onClick={onClick}
      className="premium-card premium-card-hover overflow-hidden rounded-xl cursor-pointer"
    >
      <div className="relative h-24">
        {template.images?.[0] ? (
          <img
            src={template.images[0]}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${linear}`} />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFav(template._id)
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded bg-black/40 flex items-center justify-center hover:bg-black/60"
        >
          {template.favourite ? (
            <BsHeartFill className={`${errorText} text-xs`} />
          ) : (
            <BsHeart className="text-white text-xs" />
          )}
        </button>

        {template.isPublished && (
          <div className="absolute top-2 left-2">
            <span
              className={`${successBg} text-white text-[9px] px-2 py-1 rounded font-bold`}
            >
              PUBLISHED
            </span>
          </div>
        )}

        {template.isViewOnly &&
          !template.isEditable &&
          !template.allowPublicEdit &&
          !isOwner && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-black/70 text-white text-[9px] px-2 py-1 rounded flex items-center gap-1">
                <BsLockFill size={8} /> View Only
              </span>
            </div>
          )}
      </div>

      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate">
          {template.title}
        </p>
        <p className={`${dashboardMutedColor} text-xs mb-3`}>
          by {template.creatorName}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`${dashboardBgColor} px-2 py-1 rounded text-[10px] ${dashboardMutedColor}`}
          >
            {template.category}
          </span>
          {(template.isEditable || template.allowPublicEdit || isOwner) && (
            <span className={`text-[10px] ${successText} font-medium`}>
              Editable
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
