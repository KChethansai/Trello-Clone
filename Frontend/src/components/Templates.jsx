import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsSearch,
  BsHeart,
  BsHeartFill,
  BsX,
  BsLockFill,
  BsPencil,
  BsBoxArrowUpRight,
  BsCalendar3,
  BsPerson
} from 'react-icons/bs'

import axios from 'axios'
import toast from 'react-hot-toast'

import { API_BASE_URL } from '../config/api'
import { useAuth } from '../store/authStore'
import Navbar from './Navbar'

//includes 'Project' since all published boards fall under this category
const sideCategories = [
  'All',
  'Favorites',
  'Project',
  'Business',
  'Personal',
  'Education',
  'Engineering',
  'Marketing',
  'HR & Operations'
]

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

// ─────────────────────────────────────────────────────────────
// EDIT FORM
// ─────────────────────────────────────────────────────────────

function PublishForm({ template, onClose, onSave }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: template.title || '',
    description: template.description || '',
    category: template.category || '',
    isPublished: template.isPublished || false,
    isViewOnly: template.isViewOnly ?? true,
    allowPublicEdit: template.allowPublicEdit || false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await axios.put(
        `${API_BASE_URL}/api/templates/${template._id}`,
        form,
        { withCredentials: true }
      )
      toast.success('Template updated')
      onSave(res.data.payload)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#282e33] w-full max-w-lg rounded-2xl border border-[#3a424a] shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-semibold">Edit Template</h2>
          <button onClick={onClose} className="text-[#9fadbc] hover:text-white">
            <BsX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Template title"
            className="w-full bg-[#1d2125] border border-[#454f59] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#579dff]"
          />
          <textarea
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Template description"
            className="w-full bg-[#1d2125] border border-[#454f59] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#579dff]"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-[#1d2125] border border-[#454f59] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#579dff]"
          >
            {sideCategories
              .filter((c) => c !== 'All' && c !== 'Favorites')
              .map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>

          <label className="flex items-center gap-3 text-sm text-white">
            <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
            Published
          </label>
          <label className="flex items-center gap-3 text-sm text-white">
            <input type="checkbox" name="isViewOnly" checked={form.isViewOnly} onChange={handleChange} />
            View Only
          </label>
          <label className="flex items-center gap-3 text-sm text-white">
            <input type="checkbox" name="allowPublicEdit" checked={form.allowPublicEdit} onChange={handleChange} />
            Allow Public Edit
          </label>

          <button
            disabled={saving}
            className="w-full h-10 rounded-lg bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DETAIL PANEL
// ─────────────────────────────────────────────────────────────

function DetailPanel({ template, onClose, isOwner, onEdit, onDelete, onToggleFav }) {
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
        year: 'numeric', month: 'short', day: 'numeric'
      })
    : null

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-[420px] z-40 bg-[#282e33] border-l border-[#3a424a] shadow-2xl flex flex-col animate-slide-in">

        {/* hero */}
        <div className="relative h-44 shrink-0">
          {template.images?.[0] ? (
            <img src={template.images[0]} alt={template.title} className="w-full h-full object-cover" />
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
              <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">PUBLISHED</span>
            )}
            {template.type === 'project' && (
              <span className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">PROJECT</span>
            )}
          </div>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6">

          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-white text-xl font-bold leading-snug">{template.title}</h2>
            <button
              onClick={() => onToggleFav(template._id)}
              className="shrink-0 w-8 h-8 rounded-lg bg-[#1d2125] flex items-center justify-center hover:bg-[#353d47] transition-colors"
            >
              {template.favourite
                ? <BsHeartFill className="text-red-400 text-sm" />
                : <BsHeart className="text-[#9fadbc] text-sm" />
              }
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            <span className="flex items-center gap-1.5 text-[#9fadbc] text-xs">
              <BsPerson size={12} />{template.creatorName}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1.5 text-[#9fadbc] text-xs">
                <BsCalendar3 size={11} />{formattedDate}
              </span>
            )}
            <span className="bg-[#1d2125] px-2 py-0.5 rounded text-[10px] text-[#9fadbc]">
              {template.category}
            </span>
          </div>

          {template.description ? (
            <p className="text-[#b6c2cf] text-sm leading-relaxed mb-6">{template.description}</p>
          ) : (
            <p className="text-[#6b7280] text-sm italic mb-6">No description provided.</p>
          )}

          {/* permissions */}
          <div className="rounded-xl border border-[#3a424a] bg-[#1d2125] p-4 mb-6">
            <p className="text-xs text-[#9fadbc] font-medium mb-3 uppercase tracking-wide">Permissions</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#b6c2cf]">Editable</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  template.isEditable || template.allowPublicEdit
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/15 text-red-400'
                }`}>
                  {template.isEditable || template.allowPublicEdit ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#b6c2cf]">View Only</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  template.isViewOnly
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#2c333a] text-[#9fadbc]'
                }`}>
                  {template.isViewOnly ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* use template / locked */}
          {canUse ? (
            <button
              onClick={handleUseTemplate}
              className="w-full h-11 rounded-xl bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <BsBoxArrowUpRight size={14} />
              Use Template
            </button>
          ) : (
            <div className="w-full rounded-xl border border-[#454f59] bg-[#1d2125] p-4 flex items-center gap-3">
              <BsLockFill className="text-[#9fadbc] shrink-0" size={16} />
              <div>
                <p className="text-white text-sm font-medium">Template is locked</p>
                <p className="text-[#9fadbc] text-xs mt-0.5">This template is view-only and cannot be edited.</p>
              </div>
            </div>
          )}

          {/* owner actions */}
          {isOwner && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { onClose(); onEdit(template) }}
                className="flex-1 h-9 rounded-lg bg-[#2c333a] hover:bg-[#353d47] text-[#9fadbc] hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <BsPencil size={13} /> Edit
              </button>
              <button
                onClick={() => { onClose(); onDelete(template._id) }}
                className="flex-1 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
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

// ─────────────────────────────────────────────────────────────
// TEMPLATE CARD
// ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onToggleFav, isOwner, onClick }) {
  const linear = cardLinear(template.title)

  return (
    <div
      onClick={onClick}
      className="rounded-xl overflow-hidden bg-[#2c333a] hover:bg-[#353d47] transition-all cursor-pointer border border-transparent hover:border-[#454f59]"
    >
      <div className="relative h-24">
        {template.images?.[0] ? (
          <img src={template.images[0]} alt={template.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${linear}`} />
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(template._id) }}
          className="absolute top-2 right-2 w-7 h-7 rounded bg-black/40 flex items-center justify-center hover:bg-black/60"
        >
          {template.favourite
            ? <BsHeartFill className="text-red-400 text-xs" />
            : <BsHeart className="text-white text-xs" />
          }
        </button>

        {template.isPublished && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-500 text-white text-[9px] px-2 py-1 rounded font-bold">PUBLISHED</span>
          </div>
        )}

        {template.isViewOnly && !template.isEditable && !template.allowPublicEdit && !isOwner && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-black/70 text-white text-[9px] px-2 py-1 rounded flex items-center gap-1">
              <BsLockFill size={8} /> View Only
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate">{template.title}</p>
        <p className="text-[#9fadbc] text-xs mb-3">by {template.creatorName}</p>
        <div className="flex items-center justify-between">
          <span className="bg-[#1d2125] px-2 py-1 rounded text-[10px] text-[#9fadbc]">
            {template.category}
          </span>
          {(template.isEditable || template.allowPublicEdit || isOwner) && (
            <span className="text-[10px] text-green-400 font-medium">Editable</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

function Templates() {
  const { currentUser } = useAuth()

  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [editTarget, setEditTarget] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  //fetch all templates and merge with fetched data
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/api/templates`, {
        withCredentials: true
      })
      setTemplates(res.data.payload || [])
    } catch {
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTemplates() }, [])

  //toggle favourite — works for both template and project types
  const toggleFavourite = async (id) => {
    //optimistic update
    setTemplates((prev) =>
      prev.map((t) => t._id === id ? { ...t, favourite: !t.favourite } : t)
    )
    setSelectedTemplate((prev) =>
      prev?._id === id ? { ...prev, favourite: !prev.favourite } : prev
    )

    try {
      await axios.patch(
        `${API_BASE_URL}/api/templates/${id}/favourite`,
        {},
        { withCredentials: true }
      )
    } catch {
      //revert on failure
      toast.error('Failed to update favourite')
      setTemplates((prev) =>
        prev.map((t) => t._id === id ? { ...t, favourite: !t.favourite } : t)
      )
      setSelectedTemplate((prev) =>
        prev?._id === id ? { ...prev, favourite: !prev.favourite } : prev
      )
    }
  }

  //delete / unpublish template
  const handleDeleteTemplate = async (id) => {
    const confirmed = window.confirm('Remove this template?')
    if (!confirmed) return
    try {
      await axios.delete(`${API_BASE_URL}/api/templates/${id}`, {
        withCredentials: true
      })
      toast.success('Template removed')
      setSelectedTemplate(null)
      //remove from local state immediately
      setTemplates((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove template')
    }
  }

  //save after edit
  const handlePublishSave = async (updatedTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => t._id === updatedTemplate._id ? updatedTemplate : t)
    )
    await fetchTemplates()
  }

  //owner check
  const isTemplateOwner = (template) => {
    if (!currentUser) return false
    return (
      template.creatorId?._id?.toString() === currentUser._id?.toString() ||
      template.creatorId?.toString() === currentUser._id?.toString()
    )
  }

  //filter by category + search
const filtered = templates.filter((t) => {

  const templateCategory =
    t.category?.trim().toLowerCase()

  const selectedCategory =
    activeCategory?.trim().toLowerCase()

  const matchCategory =
    selectedCategory === 'all'
      ? true
      : selectedCategory === 'favorites'
      ? t.favourite === true
      : templateCategory === selectedCategory

  const matchSearch =
    !search ||
    t.title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    t.description
      ?.toLowerCase()
      .includes(search.toLowerCase())

  return matchCategory && matchSearch
})
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1d2125]">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {editTarget && (
          <PublishForm
            template={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={handlePublishSave}
          />
        )}

        {selectedTemplate && (
          <DetailPanel
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            isOwner={
              isTemplateOwner(selectedTemplate) ||
              currentUser?.role === 'ADMIN'
            }
            onEdit={(t) => setEditTarget(t)}
            onDelete={handleDeleteTemplate}
            onToggleFav={toggleFavourite}
          />
        )}

        {/* sidebar */}
        <aside className="w-56 shrink-0 border-r border-[#2c333a] p-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {sideCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#579dff1a] text-[#579dff]'
                    : 'text-[#9fadbc] hover:bg-[#2c333a] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* main */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="relative max-w-sm mb-6">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9fadbc]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full h-10 rounded-lg bg-[#2c333a] border border-[#454f59] pl-10 pr-3 text-white placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff]"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#579dff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-[#9fadbc]">No templates found</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((template) => (
                <TemplateCard
                  key={template._id}
                  template={template}
                  onToggleFav={toggleFavourite}
                  isOwner={
                    isTemplateOwner(template) ||
                    currentUser?.role === 'ADMIN'
                  }
                  onClick={() => setSelectedTemplate(template)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Templates
