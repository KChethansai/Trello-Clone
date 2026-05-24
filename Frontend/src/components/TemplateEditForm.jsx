import { useState } from 'react'
import { BsX } from 'react-icons/bs'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../config/api'
import {
  commonCheckbox,
  dashboardMutedColor,
  dashboardBgColor,
  dashboardBorderColor,
  dashboardPrimaryBg,
  dashboardPrimaryBgHover,
  dashboardPrimaryText,
  dashboardPanelElevated
} from '../Styles/common'

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

export default function TemplateEditForm({ template, onClose, onSave }) {
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
      <div className="premium-card animate-enter w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-semibold">Edit Template</h2>
          <button
            onClick={onClose}
            className={`${dashboardMutedColor} hover:text-white`}
          >
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
            className={`w-full ${dashboardBgColor} border ${dashboardBorderColor} rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff4d67]`}
          />
          <textarea
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Template description"
            className={`w-full ${dashboardBgColor} border ${dashboardBorderColor} rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff4d67]`}
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full ${dashboardBgColor} border ${dashboardBorderColor} rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff4d67]`}
          >
            {sideCategories
              .filter((c) => c !== 'All' && c !== 'Favorites')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className={commonCheckbox}
            />
            Published
          </label>
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              name="isViewOnly"
              checked={form.isViewOnly}
              onChange={handleChange}
              className={commonCheckbox}
            />
            View Only
          </label>
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              name="allowPublicEdit"
              checked={form.allowPublicEdit}
              onChange={handleChange}
              className={commonCheckbox}
            />
            Allow Public Edit
          </label>

          <button
            disabled={saving}
            className={`w-full h-10 rounded-lg ${dashboardPrimaryBg} ${dashboardPrimaryBgHover} ${dashboardPrimaryText} font-semibold transition-colors disabled:opacity-60`}
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </form>
      </div>
    </div>
  )
}
