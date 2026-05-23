import { useState } from 'react'
import axios from 'axios'
import { BsX } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../config/api'
import {
  projectInput,
  projectTextarea,
  modalPrimaryBtn,
  dashboardMutedColor,
  dashboardBorderColor,
  dashboardTextColor,
  dashboardSurfaceColor,
  dashboardSurfaceHover
} from '../Styles/common'
import { TEMPLATE_CATEGORIES } from '../utils/projectUtils'

export default function PublishForm({ project, onClose, onSave }) {
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
  const [submitted, setSubmitted] = useState(false)

  const errors = {
    title: submitted && !form.title.trim() ? 'Project title is required' : '',
    category: submitted && !form.category.trim() ? 'Category is required' : ''
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    if (!form.title.trim() || !form.category.trim()) return
    setSaving(true)
    try {
      const { title, description, category, viewOnly, ...publishDetails } = form
      const res = await axios.put(
        `${API_BASE_URL}/projects-api/projects/${project._id}`,
        {
          title: title.trim(),
          description,
          isEditable: !viewOnly,
          isPublished: true,
          publishDetails: {
            ...publishDetails,
            category: category.trim()
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
      <div className="premium-card animate-enter flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl mx-4">
        <div
          className={`flex shrink-0 items-center justify-between border-b ${dashboardBorderColor} px-6 py-4`}
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className={`text-xl ${dashboardMutedColor}`}>◆</span> Publish
            Project
          </h3>
          <button
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-md ${dashboardMutedColor} ${dashboardSurfaceColor} hover:text-white transition-colors`}
          >
            <BsX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 app-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Project Title
              </label>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className={projectInput}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-300">{errors.title}</p>
              )}
            </div>
            <div className="col-span-1">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={projectInput}
              >
                <option value="">Select category</option>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-300">{errors.category}</p>
              )}
            </div>
            <div className="col-span-1">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Template Type
              </label>
              <input
                name="templateType"
                type="text"
                value={form.templateType}
                onChange={handleChange}
                className={projectInput}
                placeholder="e.g. Kanban, Calendar"
              />
            </div>
            <div className="col-span-2">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className={projectTextarea}
                placeholder="Describe your project..."
              />
            </div>
            <div className="col-span-2">
              <label
                className={`flex items-center gap-2 text-sm ${dashboardTextColor}`}
              >
                <input
                  name="viewOnly"
                  type="checkbox"
                  checked={form.viewOnly}
                  onChange={handleChange}
                />
                Publish as view-only
              </label>
              <p className={`mt-1 text-xs ${dashboardMutedColor}`}>
                When enabled, the published board will be visible but not
                editable by others.
              </p>
            </div>
            <div
              className={`col-span-2 border-t ${dashboardBorderColor} pt-2 pb-1`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-widest ${dashboardTextColor}`}
              >
                Publisher Details
              </h4>
            </div>
            <div className="col-span-1">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Company Name
              </label>
              <input
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={handleChange}
                className={projectInput}
                placeholder="Your organization"
              />
            </div>
            <div className="col-span-1">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Website
              </label>
              <input
                name="website"
                type="text"
                value={form.website}
                onChange={handleChange}
                className={projectInput}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="col-span-1">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Contact Email
              </label>
              <input
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                className={projectInput}
                placeholder="contact@company.com"
              />
            </div>
            <div className="col-span-2">
              <label
                className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dashboardMutedColor}`}
              >
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className={projectTextarea}
                placeholder="Additional notes..."
              />
            </div>
          </div>
        </div>

        <div
          className={`flex shrink-0 items-center justify-end gap-3 border-t ${dashboardBorderColor} px-6 py-4`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded px-4 py-2 text-sm ${dashboardMutedColor} ${dashboardSurfaceHover} hover:text-white transition-colors`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className={`${modalPrimaryBtn} flex items-center gap-2`}
          >
            {saving && (
              <div className="h-4 w-4 animate-spin rounded-full border border-white/30 border-t-white" />
            )}
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
