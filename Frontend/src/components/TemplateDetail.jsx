import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { BsArrowLeft, BsHeart, BsHeartFill, BsPencil, BsTrash } from 'react-icons/bs'
import axios from 'axios'
import toast from 'react-hot-toast'

import { API_BASE_URL } from '../config/api'
import { useAuth } from '../store/authStore'
import {
  buttonPrimary,
  buttonSecondary,
  dangerButton,
  errorText,
  headingPage,
  successBg,
  dashboardBgColor,
  dashboardPrimaryBg,
  dashboardMutedColor,
  dashboardSurfaceColor,
  dashboardSurfaceHover
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

function TemplateDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const viewOnly = searchParams.get('viewOnly') === 'true'

  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)

  //fetch template by id
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${API_BASE_URL}/api/templates/${id}`,
          { withCredentials: true }
        )
        setTemplate(res.data.payload)
      } catch (err) {
        toast.error(
          err.response?.data?.message || 'Failed to load template'
        )
        navigate('/templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id, navigate])

  //owner check
  const isOwner =
    currentUser &&
    template &&
    (template.creatorId?._id?.toString() === currentUser._id?.toString() ||
      template.creatorId?.toString() === currentUser._id?.toString() ||
      currentUser?.role === 'ADMIN')

  //toggle favourite
  const toggleFavourite = async () => {
    setTemplate((prev) => ({
      ...prev,
      favourite: !prev.favourite
    }))
    try {
      await axios.patch(
        `${API_BASE_URL}/api/templates/${id}/favourite`,
        {},
        { withCredentials: true }
      )
    } catch {
      toast.error('Failed to update favourite')
      setTemplate((prev) => ({
        ...prev,
        favourite: !prev.favourite
      }))
    }
  }

  //delete template
  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this template?')
    if (!confirmed) return
    try {
      await axios.delete(`${API_BASE_URL}/api/templates/${id}`, {
        withCredentials: true
      })
      toast.success('Template deleted')
      navigate('/templates')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete template')
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dashboardBgColor}`}>
        <div className={`w-8 h-8 border-2 ${dashboardPrimaryBg.replace("bg-", "border-")} border-t-transparent rounded-full animate-spin`} />
      </div>
    )
  }

  if (!template) return null

  const linear = cardLinear(template.title)

  return (
    <div className={`min-h-screen ${dashboardBgColor} text-white`}>
      {/* header */}
      <div className="flex flex-col gap-3 border-b border-[#18181b] px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <button
          onClick={() => navigate('/templates')}
          className={`flex items-center gap-2 ${dashboardMutedColor} hover:text-white transition-colors text-sm`}
        >
          <BsArrowLeft />
          Back to Templates
        </button>

        <div className="flex items-center gap-3">
          {/* favourite */}
          <button
            onClick={toggleFavourite}
            className={`w-9 h-9 rounded-lg ${dashboardSurfaceColor} flex items-center justify-center ${dashboardSurfaceHover} transition-colors`}
          >
            {template.favourite ? (
              <BsHeartFill className={`${errorText}`} />
            ) : (
              <BsHeart className={`${dashboardMutedColor}`} />
            )}
          </button>

          {/* owner actions */}
          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/templates/${id}/edit`)}
                className={buttonSecondary}
              >
                <BsPencil />
                Edit
              </button>

              <button
                onClick={handleDelete}
                className={dangerButton}
              >
                <BsTrash />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* hero banner */}
      <div className="relative h-56 w-full overflow-hidden">
        {template.images?.[0] ? (
          <img
            src={template.images[0]}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${linear}`} />
        )}

        {/* badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {template.isPublished && (
            <span className={`${successBg} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
              PUBLISHED
            </span>
          )}
          {viewOnly && (
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              VIEW ONLY
            </span>
          )}
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className={headingPage}>
              {template.title}
            </h1>
            <p className={`${dashboardMutedColor} text-sm`}>
              by {template.creatorName}
            </p>
          </div>

          <span className={`${dashboardSurfaceColor} px-3 py-1 rounded-full text-xs ${dashboardMutedColor}`}>
            {template.category}
          </span>
        </div>

        {template.description && (
          <p className={`${dashboardMutedColor} text-sm leading-relaxed mt-4`}>
            {template.description}
          </p>
        )}

        {/* use template button - hidden in view only for non-owners */}
        {(!viewOnly || isOwner) && (
          <button className={`${buttonPrimary} mt-8`} onClick={() => toast.success('Template applied!')}>
            Use Template
          </button>
        )}
      </div>
    </div>
  )
}

export default TemplateDetail
