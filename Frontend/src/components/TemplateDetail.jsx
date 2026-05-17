import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { BsArrowLeft, BsHeart, BsHeartFill, BsPencil, BsTrash } from 'react-icons/bs'
import axios from 'axios'
import toast from 'react-hot-toast'

import { API_BASE_URL } from '../config/api'
import { useAuth } from '../store/authStore'

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
  }, [id])

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
      <div className="min-h-screen flex items-center justify-center bg-[#1d2125]">
        <div className="w-8 h-8 border-2 border-[#579dff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!template) return null

  const linear = cardLinear(template.title)

  return (
    <div className="min-h-screen bg-[#1d2125] text-white">
      {/* header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#2c333a]">
        <button
          onClick={() => navigate('/templates')}
          className="flex items-center gap-2 text-[#9fadbc] hover:text-white transition-colors text-sm"
        >
          <BsArrowLeft />
          Back to Templates
        </button>

        <div className="flex items-center gap-3">
          {/* favourite */}
          <button
            onClick={toggleFavourite}
            className="w-9 h-9 rounded-lg bg-[#2c333a] flex items-center justify-center hover:bg-[#353d47] transition-colors"
          >
            {template.favourite ? (
              <BsHeartFill className="text-red-400" />
            ) : (
              <BsHeart className="text-[#9fadbc]" />
            )}
          </button>

          {/* owner actions */}
          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/templates/${id}/edit`)}
                className="flex items-center gap-2 px-4 h-9 rounded-lg bg-[#2c333a] text-[#9fadbc] hover:bg-[#353d47] hover:text-white transition-colors text-sm"
              >
                <BsPencil />
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
              >
                <BsTrash />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* hero banner */}
      <div className="w-full h-48 relative">
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
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
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
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {template.title}
            </h1>
            <p className="text-[#9fadbc] text-sm">
              by {template.creatorName}
            </p>
          </div>

          <span className="bg-[#2c333a] px-3 py-1 rounded-full text-xs text-[#9fadbc]">
            {template.category}
          </span>
        </div>

        {template.description && (
          <p className="text-[#9fadbc] text-sm leading-relaxed mt-4">
            {template.description}
          </p>
        )}

        {/* use template button — hidden in view only for non-owners */}
        {(!viewOnly || isOwner) && (
          <button
            className="mt-8 px-6 h-10 rounded-lg bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] font-semibold text-sm transition-colors"
            onClick={() => toast.success('Template applied!')}
          >
            Use Template
          </button>
        )}
      </div>
    </div>
  )
}

export default TemplateDetail
